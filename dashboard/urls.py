from django.conf.urls import patterns, url
from dashboard import views

urlpatterns = patterns('',
                       url(r'^$', views.index),
                       url(r'^color/$', views.color),
                       url(r'^colors/$', views.colors),
                       url(r'^stickers/$', views.stickers),
                       url(r'^sticker/$', views.sticker),
                       url(r'^sticker/(\d+)$', views.sticker_update),
                       url(r'^sticker-archive/(\d+)$', views.sticker_archive),
)