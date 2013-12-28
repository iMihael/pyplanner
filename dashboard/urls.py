from django.conf.urls import patterns, url
from dashboard import views

urlpatterns = patterns('',
                       url(r'^$', views.index),
                       url(r'^color/$', views.color),
                       url(r'^colors/$', views.colors),
                       url(r'^stickers/$', views.stickers),
                       url(r'^sticker/$', views.sticker),
                       url(r'^sticker/(?P<sticker_id>\d+)$', views.sticker_update),
                       url(r'^sticker-archive/(\d+)$', views.sticker_archive),
                       url(r'^archive/(?P<page>\d+)$', views.archive),
                       url(r'^restore/(?P<sticker_id>\d+)$', views.sticker_restore),
                       url(r'^get_bg/(?P<sticker_id>\d+)/(?P<url>.*)$', views.get_bg),
)