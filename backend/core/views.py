from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags
import threading
import time
import logging
from .models import Lead, Company, Deal, Ticket, ActivityLog, Notification
from .serializers import LeadSerializer, CompanySerializer, DealSerializer, TicketSerializer, ActivityLogSerializer

logger = logging.getLogger(__name__)

class ActivityLogViewSet(viewsets.ModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = ActivityLog.objects.filter(user=self.request.user)
        
        # Filtering functionality
        lead_id = self.request.query_params.get('lead')
        company_id = self.request.query_params.get('company')
        deal_id = self.request.query_params.get('deal')
        ticket_id = self.request.query_params.get('ticket')
        
        if lead_id:
            queryset = queryset.filter(lead_id=lead_id)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        if deal_id:
            queryset = queryset.filter(deal_id=deal_id)
        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)
            
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(subject__icontains=q) |
                Q(description__icontains=q)
            )

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        activity = self.get_object()
        if activity.activity_type != 'task':
            return Response({"detail": "Only tasks can be toggled."}, status=status.HTTP_400_BAD_REQUEST)
        
        if activity.status == 'completed':
            activity.status = 'pending'
        else:
            activity.status = 'completed'
        activity.save()
        
        return Response({'status': activity.status})

class GenerateSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        entity_type = request.query_params.get('type')
        entity_id = request.query_params.get('id')
        local_attachments = int(request.query_params.get('attachments', '0'))

        if not entity_type or not entity_id:
            return Response({"detail": "type and id are required."}, status=status.HTTP_400_BAD_REQUEST)

        activities = ActivityLog.objects.filter(user=request.user).order_by('created_at')
        
        if entity_type == 'lead':
            activities = activities.filter(lead_id=entity_id)
        elif entity_type == 'company':
            activities = activities.filter(company_id=entity_id)
        elif entity_type == 'deal':
            activities = activities.filter(deal_id=entity_id)
        elif entity_type == 'ticket':
            activities = activities.filter(ticket_id=entity_id)
        else:
            return Response({"detail": "Invalid entity type."}, status=status.HTTP_400_BAD_REQUEST)

        if not activities.exists():
            return Response({"summary": "There are no activities associated with this record yet. Add some notes, emails, calls, tasks, or meetings to get a comprehensive summary."})

        # Rule-based summarization
        activity_counts = {}
        completed_tasks = 0
        pending_tasks = 0
        email_attachment_count = 0
        
        recent_activities = list(activities.order_by('-created_at')[:5])
        
        for act in activities:
            activity_counts[act.activity_type] = activity_counts.get(act.activity_type, 0) + 1
            if act.activity_type == 'task':
                if act.status == 'completed':
                    completed_tasks += 1
                else:
                    pending_tasks += 1
            elif act.activity_type == 'email' and act.description:
                import re
                match = re.search(r'Attachments:\s*(\d+)', act.description)
                if match:
                    email_attachment_count += int(match.group(1))

        summary_parts = []
        summary_parts.append(f"This {entity_type} has a total of {activities.count()} logged activities.")
        
        details = []
        for a_type, count in activity_counts.items():
            if a_type != 'task':
                details.append(f"{count} {a_type}s")
        
        if completed_tasks > 0 or pending_tasks > 0:
            task_str = f"{activity_counts.get('task', 0)} tasks ({completed_tasks} completed, {pending_tasks} pending)"
            details.append(task_str)
            
        if details:
            summary_parts.append(f"The interaction history consists of {', '.join(details)}.")
            
        total_attachments = local_attachments + email_attachment_count
        if total_attachments > 0:
            summary_parts.append(f"There are {total_attachments} file attachments associated with this record.")
            
        if recent_activities:
            summary_parts.append("Recent interactions include:")
            for act in recent_activities[:2]:
                act_date = act.created_at.strftime('%b %d, %Y')
                status_info = f" ({act.status})" if act.activity_type == 'task' else ""
                summary_parts.append(f"A {act.activity_type}{status_info} on {act_date} regarding '{act.subject}'.")

        final_summary = " ".join(summary_parts)
        return Response({"summary": final_summary})

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Lead.objects.filter(user=self.request.user)
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(first_name__icontains=q) |
                Q(last_name__icontains=q) |
                Q(email__icontains=q) |
                Q(phone__icontains=q) |
                Q(company__icontains=q)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Company.objects.filter(user=self.request.user)
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(industry__icontains=q) |
                Q(phone__icontains=q) |
                Q(website__icontains=q)
            )
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Deal.objects.filter(user=self.request.user)
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(contact_email__icontains=q) |
                Q(contact_phone__icontains=q)
            )
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import traceback
            return Response({"error": str(e), "traceback": traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import traceback
            return Response({"error": str(e), "traceback": traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Ticket.objects.filter(user=self.request.user)
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q)
            )
        return queryset

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            import traceback
            return Response({"error": str(e), "traceback": traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            import traceback
            return Response({"error": str(e), "traceback": traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SendCrmEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        lead_id = data.get('lead_id')
        to_email = data.get('to')
        subject = data.get('subject')
        body = data.get('body')

        cc_email = data.get('cc', '')
        bcc_email = data.get('bcc', '')
        
        # Helper to split comma-separated emails
        def parse_emails(email_str):
            if not email_str: return []
            return [e.strip() for e in email_str.split(',') if e.strip()]

        cc_list = parse_emails(cc_email)
        bcc_list = parse_emails(bcc_email)

        if not all([to_email, subject, body]):
            return Response({"detail": "to, subject, and body are required."}, status=status.HTTP_400_BAD_REQUEST)

        lead = None
        if lead_id:
            try:
                lead = Lead.objects.get(id=lead_id, user=request.user)
            except Lead.DoesNotExist:
                # Don't fail if the lead ID doesn't exist in DB (useful for mock frontend IDs)
                pass

        # Read attachments from multipart/form-data
        attachments = request.FILES.getlist('attachments')
        
        # Store file data in memory so the thread can access it after the request completes
        attachment_data = []
        for f in attachments:
            attachment_data.append((f.name, f.read(), f.content_type))

        text_content = strip_tags(body)
        html_content = body
        from_email = settings.EMAIL_HOST_USER
        to_list = parse_emails(to_email)

        # Send the email using the existing SMTP credentials
        def send_email_with_retry(msg, retries=3):
            for i in range(retries):
                try:
                    msg.send(fail_silently=False)
                    logger.info(f"Email sent successfully to {msg.to}")
                    return
                except Exception as e:
                    logger.error(f"Email sending failed (attempt {i+1}): {str(e)}")
                    time.sleep(2)
            logger.error(f"Failed to send email to {msg.to} after {retries} attempts.")

        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to_list, cc=cc_list, bcc=bcc_list)
            msg.attach_alternative(html_content, "text/html")
            
            for file_name, file_content, content_type in attachment_data:
                msg.attach(file_name, file_content, content_type)

            threading.Thread(target=send_email_with_retry, args=(msg,)).start()
        except Exception as e:
            return Response({"detail": f"Failed to initiate email sending: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        attached_file_names = ", ".join([f.name for f in attachments]) if attachments else "None"

        # Log the activity
        ActivityLog.objects.create(
            user=request.user,
            lead=lead,
            activity_type='email',
            subject=subject,
            description=f"Sent to: {to_email}\nCC: {cc_email}\nBCC: {bcc_email}\nAttachments: {len(attachments)}\nAttached Files: {attached_file_names}\n\nBody:\n{text_content}"
        )

        Notification.objects.create(
            user=request.user,
            title="Email Sent Successfully",
            message=f"Your email '{subject}' was sent to {to_email}.",
            type="success"
        )

        return Response({"success": True, "message": "Email sent successfully"}, status=status.HTTP_200_OK)

from django.http import HttpResponse
from django.db import connection, transaction
import traceback

class DatabaseFixView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        out = list()
        try:
            with connection.cursor() as cursor:
                # Fix Deal table
                try:
                    cursor.execute("ALTER TABLE core_deal RENAME COLUMN title TO name;")
                    out.append("Renamed core_deal.title to name successfully.")
                except Exception as e:
                    out.append(f"Skipped Deal rename: {str(e)}")
                
                # Fix Ticket table
                try:
                    cursor.execute("ALTER TABLE core_ticket RENAME COLUMN subject TO title;")
                    out.append("Renamed core_ticket.subject to title successfully.")
                except Exception as e:
                    out.append(f"Skipped Ticket rename: {str(e)}")

                try:
                    cursor.execute("ALTER TABLE core_ticket ADD COLUMN owner_name VARCHAR(100);")
                    out.append("Added owner_name to core_ticket successfully.")
                except Exception as e:
                    out.append(f"Skipped Ticket owner_name addition: {str(e)}")
                    
                try:
                    cursor.execute("ALTER TABLE core_ticket ADD COLUMN deal_id INTEGER;")
                    out.append("Added deal_id to core_ticket successfully.")
                except Exception as e:
                    pass

                try:
                    cursor.execute("ALTER TABLE core_ticket ADD COLUMN company_id INTEGER;")
                    out.append("Added company_id to core_ticket successfully.")
                except Exception as e:
                    pass

                # Fix ActivityLog table (add due_date and status via raw SQL bypass)
                try:
                    cursor.execute("ALTER TABLE core_activitylog ADD COLUMN due_date timestamp with time zone NULL;")
                    out.append("Added due_date to core_activitylog successfully.")
                except Exception as e:
                    pass
                    
                try:
                    cursor.execute("ALTER TABLE core_activitylog ADD COLUMN status VARCHAR(50) DEFAULT 'pending';")
                    out.append("Added status to core_activitylog successfully.")
                except Exception as e:
                    pass

                # Fix Company table
                columns_to_add = {
                    "owner_name": "VARCHAR(100)",
                    "phone": "VARCHAR(50)",
                    "type": "VARCHAR(100)",
                    "city": "VARCHAR(100)",
                    "country": "VARCHAR(100)",
                    "employees": "VARCHAR(50)",
                    "revenue": "VARCHAR(100)",
                    "status": "VARCHAR(50) DEFAULT 'Active'"
                }
                
                for col_name, col_type in columns_to_add.items():
                    try:
                        cursor.execute(f"ALTER TABLE core_company ADD COLUMN {col_name} {col_type};")
                        out.append(f"Added {col_name} to core_company successfully.")
                    except Exception as e:
                        out.append(f"Skipped Company {col_name} addition: {str(e)}")

                # Fix Lead table (Convert to Deal feature)
                lead_columns_to_add = {
                    "company": "VARCHAR(255)",
                    "value": "DECIMAL(10, 2) DEFAULT 0.00",
                    "owner_name": "VARCHAR(100)"
                }
                for col_name, col_type in lead_columns_to_add.items():
                    try:
                        cursor.execute(f"ALTER TABLE core_lead ADD COLUMN {col_name} {col_type};")
                        out.append(f"Added {col_name} to core_lead successfully.")
                    except Exception as e:
                        out.append(f"Skipped Lead {col_name} addition: {str(e)}")

                # Fix Deal table (Convert to Deal feature)
                deal_columns_to_add = {
                    "contact_email": "VARCHAR(254)",
                    "contact_phone": "VARCHAR(20)",
                    "lead_reference_id": "INTEGER"
                }
                for col_name, col_type in deal_columns_to_add.items():
                    try:
                        cursor.execute(f"ALTER TABLE core_deal ADD COLUMN {col_name} {col_type};")
                        out.append(f"Added {col_name} to core_deal successfully.")
                    except Exception as e:
                        out.append(f"Skipped Deal {col_name} addition: {str(e)}")
                    
            return HttpResponse("SUCCESS\n\n" + "\n".join(out), content_type="text/plain")
        except Exception as e:
            return HttpResponse(f"FAILED\n\nException: {str(e)}\n\nTraceback:\n{traceback.format_exc()}", content_type="text/plain")

class LeadConvertAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        lead = get_object_or_404(Lead, pk=pk, user=request.user)

        if lead.status == 'Converted':
            return Response(
                {"success": False, "message": "Lead is already converted."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if lead.status != 'Qualified':
            return Response(
                {"success": False, "message": "Only 'Qualified' leads can be converted."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Attempt to get or create the associated Company
                company_obj = None
                city = request.data.get('city', lead.city or '')
                if lead.company:
                    company_obj, created = Company.objects.get_or_create(
                        user=request.user,
                        name=lead.company,
                        defaults={
                            'owner_name': lead.owner_name, 
                            'phone': lead.phone,
                            'city': city
                        }
                    )
                    
                    if not created and city and not company_obj.city:
                        company_obj.city = city
                        company_obj.save(update_fields=['city'])
                
                # Use provided title or fallback to a default deal name
                deal_title = request.data.get('title') or request.data.get('name')
                if not deal_title:
                    deal_title = f"{lead.first_name} {lead.last_name} Deal"

                amount = request.data.get('amount', lead.value)
                priority = request.data.get('priority', 'Medium')
                stage = request.data.get('stage', 'Proposal/Price Quote')
                close_date = request.data.get('closeDate') or request.data.get('close_date')

                # Create the Deal mapped from Lead data
                deal = Deal.objects.create(
                    user=request.user,
                    name=deal_title,
                    amount=amount,
                    priority=priority,
                    stage=stage,
                    close_date=close_date,
                    company=company_obj,
                    contact_email=lead.email,
                    contact_phone=lead.phone,
                    owner_name=lead.owner_name,
                    lead_reference=lead
                )

                # Update the Lead status
                lead.status = 'Converted'
                lead.save()

                # Generate system activity for the Lead
                ActivityLog.objects.create(
                    user=request.user,
                    lead=lead,
                    activity_type='note',
                    subject='Lead Converted',
                    description=f"This lead was successfully converted to deal '{deal.name}' by {request.user.username}."
                )

                # Generate system activity for the new Deal
                ActivityLog.objects.create(
                    user=request.user,
                    deal=deal,
                    activity_type='note',
                    subject='Deal Created',
                    description=f"This deal was created by converting lead '{lead.first_name} {lead.last_name}' by {request.user.username}."
                )

            serializer = DealSerializer(deal)
            return Response(
                {"success": True, "message": "Lead converted successfully.", "deal": serializer.data},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Failed to convert lead {pk}: {str(e)}\n{traceback.format_exc()}")
            return Response(
                {"success": False, "message": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
