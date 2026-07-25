"""
WSGI config for projects project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "projects.settings")

# Static files are served by WhiteNoise's middleware, configured in settings.
# Wrapping the application here as well added a second, unconfigured copy.
application = get_wsgi_application()
