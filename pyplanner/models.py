__author__ = 'mihael'
from django.db import models


class Config(models.Model):
    key = models.CharField(max_length=128, primary_key=True)
    value = models.TextField()

    def __unicode__(self):
        return self.key

    class Meta:
        app_label = 'pyplanner'