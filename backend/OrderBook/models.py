import uuid
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Order(models.Model):
    class SideChoice(models.TextChoices):
        BUY = 'BUY', _('Buy')
        SELL = 'SELL', _('Sell')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    symbol = models.CharField(max_length=10)
    side = models.CharField(
        max_length=4,
        choices=SideChoice.choices,
        default=SideChoice.BUY
    )
    gtc = models.BooleanField(default=False)
    exp_date = models.DateField(blank=True, null=True)
    value = models.DecimalField(
        max_digits=25,
        decimal_places=10,
        blank=True,
        null=True
    )
    shares = models.DecimalField(
        max_digits=15,
        decimal_places=6,
        validators=[MinValueValidator(limit_value=Decimal('0.000001'))]
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        validators=[MinValueValidator(limit_value=Decimal('0.0001'))]
    )

    def save(self, *args, **kwargs):
        self.value = self.shares * self.price
        super().save(*args, **kwargs)
