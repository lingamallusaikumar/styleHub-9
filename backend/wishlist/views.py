from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer
from catalog.models import Product

class UserWishlistView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user, is_default=True)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)


class ToggleWishlistItemView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        wishlist, _ = Wishlist.objects.get_or_create(user=request.user, is_default=True)
        item, created = WishlistItem.objects.get_or_create(wishlist=wishlist, product=product)

        if not created:
            item.delete()
            is_in_wishlist = False
        else:
            is_in_wishlist = True

        serializer = WishlistSerializer(wishlist)
        return Response({
            'is_in_wishlist': is_in_wishlist,
            'wishlist': serializer.data
        })
