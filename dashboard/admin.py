from django.contrib import admin
from dashboard.models import Color


class ColorAdmin(admin.ModelAdmin):
    list_display = ('color_id', 'name', 'hex_value')


admin.site.register(Color, ColorAdmin)

