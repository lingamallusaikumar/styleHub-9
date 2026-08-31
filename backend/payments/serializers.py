from rest_framework import serializers
from .models import PaymentTransaction, RefundTransaction

class RefundTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundTransaction
        fields = ['id', 'refund_id', 'amount', 'reason', 'status', 'created_at']

class PaymentTransactionSerializer(serializers.ModelSerializer):
    refunds = RefundTransactionSerializer(many=True, read_only=True)
    order_number = serializers.ReadOnlyField(source='order.order_number')

    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'order', 'order_number', 'transaction_id',
            'payment_method', 'amount', 'currency', 'status',
            'provider_response', 'refunds', 'created_at'
        ]
