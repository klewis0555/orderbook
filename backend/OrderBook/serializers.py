from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
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
