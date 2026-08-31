from django.urls import path
from .views import UserNotificationListView, MarkNotificationReadView, MarkAllReadView

urlpatterns = [
    path('', UserNotificationListView.as_view(), name='notification-list'),
    path('read/<int:notification_id>/', MarkNotificationReadView.as_view(), name='notification-read'),
    path('read-all/', MarkAllReadView.as_view(), name='notification-read-all'),
]
