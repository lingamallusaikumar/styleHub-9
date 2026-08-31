from django.urls import path
from .views import SellerProfileDetailView, PublicSellerStoreView, AdminSellerListView

urlpatterns = [
    path('', SellerProfileDetailView.as_view(), name='seller-root'),
    path('me/', SellerProfileDetailView.as_view(), name='seller-me'),
    path('store/<slug:store_slug>/', PublicSellerStoreView.as_view(), name='seller-public-store'),
    path('admin/list/', AdminSellerListView.as_view(), name='seller-admin-list'),
]
