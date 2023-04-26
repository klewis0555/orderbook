from django.contrib import admin
from .models import Order

class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'symbol',
        'side',
        'gtc',
        'exp_date',
        'value',
        'shares',
        'price'
    )

# Register your models here.

admin.site.register(Order, OrderAdmin)