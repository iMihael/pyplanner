from django.contrib import admin
from dashboard.models import Color
from pyplanner.models import Config
from django.contrib.auth.models import User


class ColorAdmin(admin.ModelAdmin):
    list_display = ('color_id', 'name', 'hex_value')


class ConfigAdmin(admin.ModelAdmin):
    list_display = ('key', 'value')


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser',
                    'is_active', 'last_login', 'date_joined')


admin.site.register(Color, ColorAdmin)
admin.site.register(Config, ConfigAdmin)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
