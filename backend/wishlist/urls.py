from django.urls import path
from .views import UserWishlistView, ToggleWishlistItemView

urlpatterns = [
    path('', UserWishlistView.as_view(), name='wishlist-detail'),
    path('toggle/', ToggleWishlistItemView.as_view(), name='wishlist-toggle'),
]
