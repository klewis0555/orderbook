# Generated by Django 4.1.7 on 2023-03-16 22:07

from decimal import Decimal
import django.core.validators
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=120)),
                ('symbol', models.CharField(max_length=10)),
                ('side', models.CharField(choices=[('BUY', 'Buy'), ('SELL', 'Sell')], default='BUY', max_length=4)),
                ('gtc', models.BooleanField(default=False)),
                ('exp_date', models.DateField(blank=True, null=True)),
                ('value', models.DecimalField(blank=True, decimal_places=10, max_digits=25, null=True)),
                ('shares', models.DecimalField(decimal_places=6, max_digits=15, validators=[django.core.validators.MinValueValidator(limit_value=Decimal('0.000001'))])),
                ('price', models.DecimalField(decimal_places=4, max_digits=10, validators=[django.core.validators.MinValueValidator(limit_value=Decimal('0.0001'))])),
            ],
        ),
    ]
