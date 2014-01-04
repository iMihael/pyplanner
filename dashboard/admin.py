from django.contrib import admin
from dashboard.models import Color
from pyplanner.models import Config


class ColorAdmin(admin.ModelAdmin):
    list_display = ('color_id', 'name', 'hex_value')


class ConfigAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')


admin.site.register(Color, ColorAdmin)
admin.site.register(Config, ConfigAdmin)
