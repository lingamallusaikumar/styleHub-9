from django.urls import path
from .views import ValidateCouponView, AdminCouponViewSet

urlpatterns = [
    path('coupons/validate/', ValidateCouponView.as_view(), name='coupon-validate'),
    path('admin/coupons/', AdminCouponViewSet.as_view(), name='admin-coupons'),
]
