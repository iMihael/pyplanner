"""
Django settings for pyplanner project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/dev/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'aq=l8!lc$fe$q0@decf4r5rq6yqvo=(gcmf)e7cj$szc%so_z$'

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = True
DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*']

TEMPLATE_EXTENSION = '.html'

TEMPLATE_DIRS = (
    os.path.dirname(__file__) + '/templates',
)

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'social_auth',
    'dashboard',
    'pyplanner',
)

AUTHENTICATION_BACKENDS = (
    'social_auth.backends.contrib.vk.VKOAuth2Backend',
    'social_auth.backends.facebook.FacebookBackend',
    'social_auth.backends.google.GoogleOAuth2Backend',
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.contrib.github.GithubBackend',
    'django.contrib.auth.backends.ModelBackend',
)

FACEBOOK_APP_ID = '244919165572368'
FACEBOOK_API_SECRET = '5abc9cff98dfa03988de3f8184633d5d'

VK_APP_ID = '2698966'
VK_API_SECRET = 'eqWEasdRUCC13JS4dwssF'

GOOGLE_OAUTH2_CLIENT_ID = '595206015716-ru34i9k0pln466qvtv090npd23hs8fea.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET = 'CDkhHRzANJB01oq5tr-SSJob'

TWITTER_CONSUMER_KEY = 'Pouj0yp5f7Iop9VjJ77KDw'
TWITTER_CONSUMER_SECRET = 'RGKMQLLT72EyPY62Za1sQxCvZ0IC6eRtZbN0pQcxU'

GITHUB_APP_ID = '9de78850b36bfae5ec9b'
GITHUB_API_SECRET = '2ed03013e6fdbe96fda4e99373f40853f0f38089'

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request',
    'social_auth.context_processors.social_auth_by_name_backends',
    'django.contrib.messages.context_processors.messages',
)

SOCIAL_AUTH_CREATE_USERS = True
SOCIAL_AUTH_UUID_LENGTH = 16

import random
SOCIAL_AUTH_DEFAULT_USERNAME = lambda: random.choice(['Darth Vader', 'Obi-Wan Kenobi', 'R2-D2', 'C-3PO', 'Yoda'])


LOGIN_URL = '/login-form/'
LOGIN_REDIRECT_URL = '/logged-in/'
LOGIN_ERROR_URL = '/login-error/'

SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'pyplanner.middleware.RequireLoginMiddleware',
)



INTERNAL_IPS = ('127.0.0.1',)

LOGIN_REQUIRED_URLS = (
    r'/a/(.*)$',
    # r'/login_required/(.*)$',
)
LOGIN_REQUIRED_URLS_EXCEPTIONS = (

)

ROOT_URLCONF = 'pyplanner.urls'

WSGI_APPLICATION = 'pyplanner.wsgi.application'


# Database
# https://docs.djangoproject.com/en/dev/ref/settings/#databases

DATABASES = {
    "default": {
        # Add "postgresql_psycopg2", "mysql", "sqlite3" or "oracle".
        "ENGINE": "django.db.backends.",
        # DB name or path to database file if using sqlite3.
        "NAME": "",
        # Not used with sqlite3.
        "USER": "",
        # Not used with sqlite3.
        "PASSWORD": "",
        # Set to empty string for localhost. Not used with sqlite3.
        "HOST": "",
        # Set to empty string for default. Not used with sqlite3.
        "PORT": "",
    }
}

# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/

STATIC_URL = '/static/'

MEDIA_PATH = os.path.dirname(__file__) + '/media/'



##################
# LOCAL SETTINGS #
##################

# Allow any settings to be defined in local_settings.py which should be
# ignored in your version control system allowing for settings to be
# defined per machine.
try:
    from local_settings import *
except ImportError:
    pass