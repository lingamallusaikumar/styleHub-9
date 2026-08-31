from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from catalog.models import ProductVariant

def get_or_create_cart(request):
    """Retrieve active user cart or session cart."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartDetailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class AddToCartView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if not variant_id:
            return Response({'error': 'variant_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            variant = ProductVariant.objects.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Product variant not found'}, status=status.HTTP_404_NOT_FOUND)

        if variant.stock_quantity < quantity:
            return Response({'error': f'Only {variant.stock_quantity} units available in stock.'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateCartItemView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            cart_item.delete()
        else:
            if cart_item.variant.stock_quantity < quantity:
                return Response({'error': f'Only {cart_item.variant.stock_quantity} units in stock.'}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
        except CartItem.DoesNotExist:
            pass

        serializer = CartSerializer(cart)
        return Response(serializer.data)


class ClearCartView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
