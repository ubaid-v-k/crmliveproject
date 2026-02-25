from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import random
import threading
import logging

logger = logging.getLogger(__name__)

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    company = models.CharField(max_length=150, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=50, default='user')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_valid(self):
        # OTP valid for 10 minutes
        return timezone.now() < self.created_at + timezone.timedelta(minutes=10) and not self.is_verified

    @classmethod
    def generate_otp(cls, user):
        otp_code = f"{random.randint(100000, 999999)}"
        # Invalidate all previous unverified OTPs
        cls.objects.filter(user=user, is_verified=False).delete()
        
        otp_obj = cls.objects.create(user=user, otp=otp_code)
        
        # Send the OTP via email
        subject = 'Your Password Reset OTP'
        message = f'Hello {user.first_name or user.username},\n\nYour OTP for password reset is: {otp_code}\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nCRM Team'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        
        def send_email_thread(subject, message, from_email, recipient_list):
            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                logger.info(f"========== OTP EMAIL SENT TO {user.email} ==========")
            except Exception as e:
                logger.error(f"========== FAILED TO SEND OTP EMAIL TO {user.email}: {str(e)} ==========")

        threading.Thread(target=send_email_thread, args=(subject, message, from_email, recipient_list)).start()
            
        return otp_obj
