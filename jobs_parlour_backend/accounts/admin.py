from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

# Get the current user model
User = get_user_model()

# Custom admin for User model
class CustomUserAdmin(BaseUserAdmin):
    """Custom admin interface for User model with enhanced functionality."""
    
    # Display fields in list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_active', 
                    'is_staff', 'is_superuser', 'date_joined', 'last_login')
    
    # Filter options
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'date_joined')
    
    # Search fields
    search_fields = ('username', 'first_name', 'last_name', 'email')
    
    # Ordering
    ordering = ('-date_joined',)
    
    # Fieldsets for user detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    # Fieldsets for creating new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    # Actions for bulk operations
    actions = ['activate_users', 'deactivate_users', 'make_staff', 'remove_staff']
    
    def activate_users(self, request, queryset):
        """Activate selected users."""
        updated = queryset.update(is_active=True)
        self.message_user(request, _('%d users successfully activated.') % updated)
    activate_users.short_description = _('Activate selected users')
    
    def deactivate_users(self, request, queryset):
        """Deactivate selected users."""
        updated = queryset.update(is_active=False)
        self.message_user(request, _('%d users successfully deactivated.') % updated)
    deactivate_users.short_description = _('Deactivate selected users')
    
    def make_staff(self, request, queryset):
        """Grant staff status to selected users."""
        updated = queryset.update(is_staff=True)
        self.message_user(request, _('%d users granted staff status.') % updated)
    make_staff.short_description = _('Grant staff status to selected users')
    
    def remove_staff(self, request, queryset):
        """Remove staff status from selected users."""
        updated = queryset.update(is_staff=False)
        self.message_user(request, _('%d users removed from staff.') % updated)
    remove_staff.short_description = _('Remove staff status from selected users')
    
    def get_queryset(self, request):
        """Optimize queryset by selecting related data."""
        return super().get_queryset(request).select_related('groups', 'user_permissions')

# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# If you have a custom user model with additional fields, you can extend the admin further
# For example, if you have a CustomUser model with phone_number and profile_picture:

# from .models import CustomUser
# 
# class CustomUserAdmin(BaseUserAdmin):
#     list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'is_active', 'is_staff')
#     list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
#     search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number')
#     
#     fieldsets = BaseUserAdmin.fieldsets + (
#         (_('Additional info'), {'fields': ('phone_number', 'profile_picture', 'bio')}),
#     )
#     
#     add_fieldsets = BaseUserAdmin.add_fieldsets + (
#         (_('Additional info'), {'fields': ('phone_number', 'profile_picture')}),
#     )
# 
# admin.site.register(CustomUser, CustomUserAdmin)