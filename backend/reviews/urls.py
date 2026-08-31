from django.urls import path
from .views import ProductReviewListView, VoteHelpfulReviewView, SellerReplyReviewView

urlpatterns = [
    path('product/<slug:product_slug>/', ProductReviewListView.as_view(), name='product-reviews'),
    path('helpful/<int:review_id>/', VoteHelpfulReviewView.as_view(), name='review-helpful'),
    path('reply/<int:review_id>/', SellerReplyReviewView.as_view(), name='review-reply'),
]
