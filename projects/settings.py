import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DJANGO_DEBUG') == '1'

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "danidiaz.onrender.com"
]

# Render publishes the service's own hostname, so a rename does not need a
# code change to keep the site reachable.
if os.getenv('RENDER_EXTERNAL_HOSTNAME'):
    ALLOWED_HOSTS.append(os.getenv('RENDER_EXTERNAL_HOSTNAME'))

INSTALLED_APPS = [
    'index'
]

INSTALLED_APPS += [
    'django.contrib.sessions',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # WhiteNoise has to sit directly below SecurityMiddleware so it can answer
    # a static file without the rest of the stack running.
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# The asymmetric-key demo keeps its keypairs and chat history in the session.
# Signing them into a cookie is what lets the site run without a database.
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'

# Render terminates TLS in front of the app and forwards the original scheme.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

if not DEBUG:
    # The session carries the whole conversation now that there is no database
    # behind it, so it should never travel in the clear.
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True

    # HSTS is deliberately left off: browsers remember it for as long as it is
    # set, which is awkward to undo. Worth turning on once the site is settled.


# STATICFILES_STORAGE was removed in Django 5.1. Setting it here did nothing
# but look right: the default backend stayed in place, so WhiteNoise never
# compressed or fingerprinted anything.
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

ROOT_URLCONF = 'projects.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                # cryptography/asymmetric.html reads request.session directly.
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'projects.wsgi.application'


# The site has no database. The project list lives in index/catalog.py and the
# only per-user state is a signed-cookie session.
DATABASES = {}


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'

# collectstatic writes here, outside the tree the sources live in.
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")