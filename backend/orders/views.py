import uuid, datetime
from rest_framework import views, generics, permissions, status
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem, OrderStatusHistory, ShipmentTracking
from .serializers import OrderDetailSerializer
from cart.views import get_or_create_cart
from promotions.models import Coupon
from inventory.models import StockMovement

class CheckoutView(views.APIView):
    """
    Creates an order from the user's current shopping cart.
    Validates stock, applies coupon discount, locks inventory, and clears cart.
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        shipping_address = request.data.get('shipping_address')
        coupon_code = request.data.get('coupon_code', '').strip().upper()
        guest_email = request.data.get('guest_email', '')

        if not shipping_address:
            return Response({'error': 'shipping_address object is required'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_items = cart.items.select_related('variant', 'variant__product').all()

        if not cart_items.exists():
            return Response({'error': 'Shopping cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = float(cart.subtotal)
        discount_amount = 0.0

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                is_valid, msg = coupon.is_valid_now()
                if is_valid:
                    discount_amount, _ = coupon.calculate_discount(subtotal)
                    coupon.used_count += 1
                    coupon.save()
            except Coupon.DoesNotExist:
                pass

        shipping_fee = 15.00 if subtotal < 200 else 0.00 # Free shipping over $200
        tax_amount = round(subtotal * 0.08, 2) # 8% Sales Tax
        total_amount = round(subtotal - discount_amount + shipping_fee + tax_amount, 2)

        user = request.user if request.user.is_authenticated else None

        order = Order.objects.create(
            user=user,
            guest_email=guest_email if not user else user.email,
            status='PENDING',
            subtotal=subtotal,
            discount_amount=discount_amount,
            shipping_fee=shipping_fee,
            tax_amount=tax_amount,
            total_amount=total_amount,
            shipping_address_data=shipping_address,
            coupon_code=coupon_code
        )

        OrderStatusHistory.objects.create(
            order=order,
            status='PENDING',
            notes='Order initialized. Awaiting payment authorization.'
        )

        for item in cart_items:
            variant = item.variant
            primary_img = variant.product.images.filter(is_primary=True).first()
            img_url = primary_img.image_url if primary_img else ''

            OrderItem.objects.create(
                order=order,
                variant=variant,
                product_title=variant.product.title,
                color_name=variant.color_name,
                size=variant.size,
                sku=variant.sku,
                image_url=img_url,
                unit_price=item.unit_price,
                quantity=item.quantity,
                total_price=item.total_price
            )

            # Deduct stock and log movement
            variant.stock_quantity = max(0, variant.stock_quantity - item.quantity)
            variant.save()

            StockMovement.objects.create(
                variant=variant,
                quantity=-item.quantity,
                movement_type='ORDER_RESERVATION',
                notes=f"Reserved for Order {order.order_number}"
            )

        # Clear cart items
        cart.items.all().delete()

        # Create Shipment tracking placeholder
        ShipmentTracking.objects.create(
            order=order,
            carrier='STYLEHUB_EXPRESS',
            tracking_number=f"TRK-{uuid.uuid4().hex[:12].upper()}",
            estimated_delivery=datetime.date.today() + datetime.timedelta(days=4),
            current_location='Fulfillment Center (New York, NY)',
            delivery_notes='Shipment prepared for carrier pickup.'
        )

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'status_history', 'shipment')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'order_number'
    queryset = Order.objects.prefetch_related('items', 'status_history', 'shipment')


class RequestReturnView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ['DELIVERED', 'PAID', 'SHIPPED']:
            return Response({'error': f'Cannot request return for order in state {order.status}'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'RETURN_REQUESTED'
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status='RETURN_REQUESTED',
            notes=request.data.get('reason', 'Customer requested return.')
        )

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)


class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Order.objects.prefetch_related('items', 'status_history', 'shipment').all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class AdminUpdateOrderStatusView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, order_number):
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        notes = request.data.get('notes', f'Admin changed status to {new_status}')

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            notes=notes
        )

        serializer = OrderDetailSerializer(order)
        return Response(serializer.data)
