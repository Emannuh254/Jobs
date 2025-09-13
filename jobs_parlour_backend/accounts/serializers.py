from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
import google.auth.transport.requests
from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True, 
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ["username", "email", "password", "password2"]
    
    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({
                "password": "Passwords must match"
            })
        
        # Validate email uniqueness
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "A user with this email already exists"
            })
            
        return attrs
    
    def create(self, validated_data):
        # Remove password2 as it's not needed for user creation
        validated_data.pop('password2', None)
        
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user

class GoogleLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    google_token = serializers.CharField(write_only=True)
    
    def validate_google_token(self, token):
        try:
            # Specify the CLIENT_ID of the app that accesses the backend
            CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"  # Replace with your actual client ID
            
            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, 
                google.auth.transport.requests.Request(), 
                CLIENT_ID
            )
            
            # Verify the issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValidationError("Invalid issuer")
                
            return idinfo
            
        except GoogleAuthError as e:
            raise ValidationError(f"Google token verification failed: {str(e)}")
        except Exception as e:
            raise ValidationError(f"Token verification error: {str(e)}")
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        google_token = attrs.get('google_token')
        
        # Verify the Google token
        token_data = self.validate_google_token(google_token)
        
        # Verify email matches the token
        if token_data['email'] != email:
            raise ValidationError("Email does not match Google token")
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
            
            # If user exists and has a password, don't allow password reset via this method
            if user.has_usable_password():
                raise ValidationError({
                    "email": "Account already exists. Please sign in with your password."
                })
                
            # If user exists but has no password (social account), set the password
            user.set_password(password)
            user.save()
            
        except User.DoesNotExist:
            # Create new user
            # Generate a unique username from email
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
                
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
            'email': user.email
        }

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # Try to authenticate the user
            user = User.objects.filter(email=email).first()
            
            if user and user.check_password(password):
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                return {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'username': user.username,
                    'email': user.email
                }
            else:
                raise ValidationError("Invalid email or password")
        else:
            raise ValidationError("Must include email and password")