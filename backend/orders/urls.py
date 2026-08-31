from django.urls import path
from .views import (
    CheckoutView,
    UserOrderListView,
    OrderDetailView,
    RequestReturnView,
    AdminOrderListView,
    AdminUpdateOrderStatusView
)

urlpatterns = [
    path('checkout/', CheckoutView.as_view(), name='order-checkout'),
    path('my-orders/', UserOrderListView.as_view(), name='user-orders'),
    path('detail/<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('return/<str:order_number>/', RequestReturnView.as_view(), name='order-return'),
    path('admin/list/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/status/<str:order_number>/', AdminUpdateOrderStatusView.as_view(), name='admin-order-status'),
]
