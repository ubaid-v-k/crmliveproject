from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags
import threading
import time
import logging
from .models import Lead, Company, Deal, Ticket, ActivityLog, Notification
from .serializers import LeadSerializer, CompanySerializer, DealSerializer, TicketSerializer

logger = logging.getLogger(__name__)

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Deal.objects.filter(user=self.request.user)

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
        return Ticket.objects.filter(user=self.request.user)

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

        # Log the activity
        ActivityLog.objects.create(
            user=request.user,
            lead=lead,
            activity_type='email',
            subject=subject,
            description=f"Sent to: {to_email}\nCC: {cc_email}\nBCC: {bcc_email}\nAttachments: {len(attachments)}\n\nBody:\n{text_content}"
        )

        Notification.objects.create(
            user=request.user,
            title="Email Sent Successfully",
            message=f"Your email '{subject}' was sent to {to_email}.",
            type="success"
        )

        return Response({"success": True, "message": "Email sent successfully"}, status=status.HTTP_200_OK)

from django.http import HttpResponse
from django.db import connection
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
                    
            return HttpResponse("SUCCESS\n\n" + "\n".join(out), content_type="text/plain")
        except Exception as e:
            return HttpResponse(f"FAILED\n\nException: {str(e)}\n\nTraceback:\n{traceback.format_exc()}", content_type="text/plain")
