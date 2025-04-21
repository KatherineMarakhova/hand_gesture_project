from rest_framework import status, generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

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

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

