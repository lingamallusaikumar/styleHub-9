from django.urls import path
from .views import WarehouseListView, StockMovementListView

urlpatterns = [
    path('', WarehouseListView.as_view(), name='inventory-root'),
    path('warehouses/', WarehouseListView.as_view(), name='warehouse-list'),
    path('stock-movements/', StockMovementListView.as_view(), name='stock-movement-list'),
]
