from rest_framework import views, permissions, status
from rest_framework.response import Response
from .services import RecommendationEngine
from catalog.models import Product
from catalog.serializers import ProductListSerializer

class SimilarProductsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        similar = RecommendationEngine.get_similar_products(product, limit=6)
        serializer = ProductListSerializer(similar, many=True)
        return Response(serializer.data)


class FrequentlyBoughtTogetherView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        bought_together = RecommendationEngine.get_frequently_bought_together(product, limit=4)
        serializer = ProductListSerializer(bought_together, many=True)
        return Response(serializer.data)


class PersonalizedFeedView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        recs = RecommendationEngine.get_personalized_recommendations(user, limit=8)
        serializer = ProductListSerializer(recs, many=True)
        return Response(serializer.data)
