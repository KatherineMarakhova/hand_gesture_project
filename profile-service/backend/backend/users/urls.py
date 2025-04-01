from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView, CustomTokenObtainPairView, PasswordResetView


urlpatterns = [
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/', UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    # path('password-reset/done/', PasswordResetDoneView.as_view(), name='password_reset_done')
]