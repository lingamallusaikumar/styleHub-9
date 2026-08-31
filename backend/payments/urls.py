from django.urls import path
from .views import MockProcessPaymentView, MockProcessRefundView

urlpatterns = [
    path('process/', MockProcessPaymentView.as_view(), name='payment-process'),
    path('refund/<str:transaction_id>/', MockProcessRefundView.as_view(), name='payment-refund'),
]
