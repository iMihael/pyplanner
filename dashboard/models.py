__author__ = 'mihael'

from django.db import models
from django.contrib.auth.models import User
import base64


class Color(models.Model):
    color_id = models.AutoField(primary_key=True)
    hex_value = models.CharField(max_length=7)
    name = models.CharField(max_length=16, blank=True, null=True)
    font_color = models.CharField(max_length=7, default='000000')

    def __unicode__(self):
        return self.name if self.name else self.hex_value

    class Meta:
        app_label = 'dashboard'


class Sticker(models.Model):
    sticker_id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now=True)
    body = models.CharField(max_length=2048, blank=True, null=True)
    color = models.ForeignKey(Color)
    archived = models.DateTimeField(null=True)
    deleted = models.DateTimeField(null=True)
    width = models.SmallIntegerField(default=200)
    height = models.SmallIntegerField(default=200)
    position = models.IntegerField(default=0)
    owner = models.ForeignKey(User)

    def __unicode__(self):
        return self.sticker_id

    class Meta:
        app_label = 'dashboard'
        ordering = ['-position']


class Bgimage(models.Model):
    name = models.CharField(max_length=64, primary_key=True)
    url = models.CharField(max_length=2048)
    _raw = models.TextField(db_column='raw', blank=True)

    def set_data(self, raw):
        self._raw = base64.encodestring(raw)

    def get_data(self):
        return base64.decodestring(self._raw)

    raw = property(get_data, set_data)


class Pic(models.Model):
    name = models.CharField(max_length=64)
    uploaded = models.DateTimeField(auto_now=True)
    stick = models.ForeignKey(Sticker, related_name='pics')
    _raw = models.TextField(db_column='raw', blank=True)

    def set_data(self, raw):
        self._raw = base64.encodestring(raw)

    def get_data(self):
        return base64.decodestring(self._raw)

    raw = property(get_data, set_data)


#def create_user_stickers(sender, instance, created, **kwargs):
#    if created:
#        colors = Color.objects.all()
#        sizes = [{'w': 250, 'h': 250}, {'w': 200, 'h': 200}, {'w': 150, 'h': 150}, {'w': 300, 'h': 300}]
#        for i in range(0, 5):
#            size = sizes[randint(0, 3)]
#            sticker = Sticker(
#                color=colors[randint(0, colors.count() - 1)],
#                body="Sticker #" + str(i),
#                width=size['w'],
#                height=size['h'],
#                position=i,
#                owner=instance
#            )
#            sticker.save()
#

## post_save.connect(create_user_stickers, sender=User)