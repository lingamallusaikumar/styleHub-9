from django.urls import path
from .views import ExecutiveDashboardView

urlpatterns = [
    path('dashboard/', ExecutiveDashboardView.as_view(), name='analytics-dashboard'),
]
