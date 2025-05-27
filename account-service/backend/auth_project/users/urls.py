from django.urls import path
from .views import RegisterView, UserView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def verify_token(request):
    if request.user.is_authenticated:
        return Response({'valid': True}, status=status.HTTP_200_OK)
    return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('user/', UserView.as_view()),
    path('password-reset/', PasswordResetRequestView.as_view()),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view()),
    path('token/verify/', verify_token, name='token_verify'),
]

