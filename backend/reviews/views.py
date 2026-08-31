from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Review, ReviewHelpfulVote
from .serializers import ReviewSerializer
from catalog.models import Product

class ProductReviewListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_slug = self.kwargs.get('product_slug')
        return Review.objects.filter(product__slug=product_slug).select_related('user').prefetch_related('images')

    def perform_create(self, serializer):
        product_slug = self.kwargs.get('product_slug')
        product = Product.objects.get(slug=product_slug)
        serializer.save(product=product, user=self.request.user)


class VoteHelpfulReviewView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        vote, created = ReviewHelpfulVote.objects.get_or_create(review=review, user=request.user)
        if created:
            review.helpful_count += 1
            review.save()
            return Response({'message': 'Vote recorded', 'helpful_count': review.helpful_count})
        return Response({'message': 'Already voted', 'helpful_count': review.helpful_count})


class SellerReplyReviewView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

        reply = request.data.get('response', '')
        review.seller_response = reply
        review.save()
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
