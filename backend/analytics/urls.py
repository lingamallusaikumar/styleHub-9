from django.urls import path
from .views import ExecutiveDashboardView

urlpatterns = [
    path('', ExecutiveDashboardView.as_view(), name='analytics-root'),
    path('dashboard/', ExecutiveDashboardView.as_view(), name='analytics-dashboard'),
]
