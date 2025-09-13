from django.apps import AppConfig
import os

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    verbose_name = 'User Accounts'
    
    def ready(self):
        """
        Perform initialization tasks when the app is ready.
        This is where we can import signals or perform other app-level setup.
        """
        # Import signals module to register signal handlers
        try:
            import accounts.signals  # noqa
        except ImportError:
            pass
        
        # Set default user model if not already set
        if not os.getenv('DJANGO_SETTINGS_MODULE'):
            from django.conf import settings
            if not hasattr(settings, 'AUTH_USER_MODEL'):
                settings.AUTH_USER_MODEL = 'auth.User'