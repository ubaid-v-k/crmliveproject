from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTPVerification
from .serializers import (
    UserSerializer, RegisterSerializer, 
    ForgotPasswordSerializer, VerifyOTPSerializer, ResetPasswordSerializer
)
import logging
import traceback
from core.models import Notification

logger = logging.getLogger(__name__)

class RegisterAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "success": True,
                    "message": "User registered successfully",
                    "token": str(refresh.access_token),
                    "user": UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            return Response({
                "success": False,
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({"detail": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            logger.info(f"Login attempt for: {request.data.get('username') or request.data.get('email')}")
            
            email = request.data.get('username') or request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=email, password=password)

            if user:
                Notification.objects.create(
                    user=user,
                    title="Welcome back!",
                    message=f"You successfully logged in.",
                    type="success"
                )

                refresh = RefreshToken.for_user(user)
                return Response({
                    "access_token": str(refresh.access_token),
                    "refresh_token": str(refresh),
                    "token_type": "bearer",
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({"detail": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ForgotPasswordAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = ForgotPasswordSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                try:
                    user = User.objects.get(email=email)
                    otp_obj = OTPVerification.generate_otp(user)
                    return Response({
                        "success": True, 
                        "message": "OTP sent successfully to email"
                    }, status=status.HTTP_200_OK)
                except User.DoesNotExist:
                    return Response({
                        "success": True,
                        "message": "If an account with that email exists, an OTP will be sent."
                    }, status=status.HTTP_200_OK)
            return Response({"success": False, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Forgot Password error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({"detail": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            try:
                user = User.objects.get(email=email)
                otp_obj = OTPVerification.objects.filter(user=user, otp=otp_code, is_verified=False).order_by('-created_at').first()
                if otp_obj and otp_obj.is_valid():
                    otp_obj.is_verified = True
                    otp_obj.save()
                    return Response({"success": True, "message": "OTP verified successfully"}, status=status.HTTP_200_OK)
                return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": False, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            try:
                user = User.objects.get(email=email)
                # Ensure OTP was verified previously
                otp_obj = OTPVerification.objects.filter(user=user, otp=otp_code, is_verified=True).order_by('-created_at').first()
                if otp_obj:
                    user.set_password(new_password)
                    user.save()
                    otp_obj.delete() # Consume OTP
                    
                    Notification.objects.create(
                        user=user,
                        title="Security Update",
                        message="Your password was reset successfully.",
                        type="info"
                    )

                    return Response({"success": True, "message": "Password reset successfully"}, status=status.HTTP_200_OK)
                return Response({"detail": "Invalid or unverified OTP"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": False, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ProfileAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
