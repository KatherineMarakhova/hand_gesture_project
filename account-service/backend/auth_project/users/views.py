from rest_framework import status, generics, permissions
from django.contrib.auth.models import User
from .serializers import (UserSerializer, RegisterSerializer, LoginSerializer, PasswordResetSerializer,
                          PasswordResetConfirmSerializer)
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

import os
from dotenv import load_dotenv

# TODO: update responses in swagger!


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # serializer_class = UserSerializer
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Регистрация нового пользователя",
        responses={201: RegisterSerializer()}
    )
    def post(self, request, *args, **kwargs):
        password = request.data.get('password')
        user = User.objects.create_user(
            username=request.data['username'],
            email=request.data['email'],
            password=password
        )
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Пользовательский профиль",
        responses={200: UserSerializer()}
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class PasswordResetRequestView(APIView):
    @swagger_auto_schema(
        request_body=PasswordResetSerializer,
        operation_description="Сброс пароля (отправка email)",
        responses={200: 'Если email зарегистрирован, письмо отправлено.'}
    )
    def post(self, request):
        load_dotenv()
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"http://localhost:3000/password-reset-confirm/{uid}/{token}/"
            send_mail(
                'Сброс пароля',
                f'Перейдите по ссылке для сброса пароля: {reset_url}',
                os.getenv('EMAIL_HOST_USER'),
                [email],
            )
        return Response({'message': 'Если email зарегистрирован, письмо отправлено.'}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    @swagger_auto_schema(
        request_body=PasswordResetConfirmSerializer,
        operation_description="Сброс пароля (ввод нового пароля)",
        responses={200: "Пароль обновлен"}
    )
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        if not (uidb64 and token and new_password):
            return Response({'error': 'Не все поля заполнены'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Неверная ссылка'}, status=status.HTTP_400_BAD_REQUEST)
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Пароль успешно изменён'})
        else:
            return Response({'error': 'Неверная или устаревшая ссылка'}, status=status.HTTP_400_BAD_REQUEST)
