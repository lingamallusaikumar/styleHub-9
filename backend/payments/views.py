from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from .models import PaymentTransaction, RefundTransaction
from .serializers import PaymentTransactionSerializer, RefundTransactionSerializer
from orders.models import Order, OrderStatusHistory

class MockProcessPaymentView(views.APIView):
    """
    Simulates a payment gateway response (Credit Card, UPI, Wallet, NetBanking).
    Updates Order status to 'PAID' & 'PROCESSING'.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        order_number = request.data.get('order_number')
        payment_method = request.data.get('payment_method', 'CREDIT_CARD')
        simulate_failure = request.data.get('simulate_failure', False)

        if not order_number:
            return Response({'error': 'order_number is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if simulate_failure:
            txn = PaymentTransaction.objects.create(
                order=order,
                payment_method=payment_method,
                amount=order.total_amount,
                status='FAILED',
                provider_response={'error_code': 'MOCK_DECLINED', 'message': 'Card authorization declined by issuer.'}
            )
            return Response({
                'success': False,
                'message': 'Payment declined',
                'transaction': PaymentTransactionSerializer(txn).data
            }, status=status.HTTP_400_BAD_REQUEST)

        # Successful Mock Payment
        txn = PaymentTransaction.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_amount,
            status='SUCCESS',
            provider_response={
                'authorization_code': 'AUTH-99281',
                'gateway': 'StyleHub Mock Payment Engine',
                'status': 'APPROVED'
            }
        )

        # Update Order Status to PAID and then PROCESSING
        order.status = 'PAID'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status='PAID',
            notes=f"Payment of ${order.total_amount} approved via {payment_method} ({txn.transaction_id})."
        )
        
        OrderStatusHistory.objects.create(
            order=order,
            status='PROCESSING',
            notes="Order dispatched to warehouse for fulfillment."
        )

        return Response({
            'success': True,
            'message': 'Payment processed successfully!',
            'transaction': PaymentTransactionSerializer(txn).data
        }, status=status.HTTP_200_OK)


class MockProcessRefundView(views.APIView):
    """
    Simulates refund processing for returned or cancelled orders.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, transaction_id):
        try:
            payment = PaymentTransaction.objects.get(transaction_id=transaction_id)
        except PaymentTransaction.DoesNotExist:
            return Response({'error': 'Payment transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        reason = request.data.get('reason', 'Customer return approved.')
        amount = float(request.data.get('amount', payment.amount))

        refund = RefundTransaction.objects.create(
            payment=payment,
            amount=amount,
            reason=reason,
            status='SUCCESS'
        )

        payment.status = 'REFUNDED'
        payment.save()

        order = payment.order
        order.status = 'RETURNED'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status='RETURNED',
            notes=f"Refund of ${amount} processed ({refund.refund_id})."
        )

        return Response({
            'success': True,
            'message': 'Refund completed successfully',
            'refund': RefundTransactionSerializer(refund).data
        })
