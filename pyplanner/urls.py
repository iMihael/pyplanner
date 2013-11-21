from django.conf.urls import patterns, include, url
from pyplanner import settings, views
from django.contrib import admin

### from django.contrib.auth.decorators import user_passes_test

admin.autodiscover()

### staff_only = user_passes_test(lambda u: u.is_staff, views.index.index_page)
### registered_only = user_passes_test(lambda u: u.is_authenticated(), views.index.login_form)

logged_paterns = patterns('',
                          # Url patterns for logged only users

                          url(r'^dashboard/', include('dashboard.urls'))
)

urlpatterns = patterns('',
                       # Examples:
                       # url(r'^$', 'pyplanner.views.home', name='home'),
                       # url(r'^blog/', include('blog.urls')),

                       url(r'^$', views.index_page),
                       url(r'^about/$', views.about),
                       url(r'^blog/$', views.blog),
                       url(r'^login-form/$', views.login_form),
                       url(r'^logout/$', views.logout_view),
                       url(r'^logged-in/$', views.logged_in),
                       url(r'^login-error/$', views.login_error),
                       url(r'^contacts/$', views.contacts),

                       url(r'', include('social_auth.urls')),
                       url(r'^admin/', include(admin.site.urls)),

                       url(r'^a/', include(logged_paterns)),

)

if settings.DEBUG:
    urlpatterns += (url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_PATH}),)
