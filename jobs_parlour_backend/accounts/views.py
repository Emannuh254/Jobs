from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        # If user exists, check password
        if not user.check_password(password):
            return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        # Create new user with given password
        user = User.objects.create(
            username=email.split("@")[0],
            email=email,
            password=make_password(password),
        )

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "username": user.username,
    })
