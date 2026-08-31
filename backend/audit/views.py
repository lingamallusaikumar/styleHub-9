from rest_framework import generics, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogListView(generics.ListAPIView):
    """
    List audit logs (Admin only access)
    """
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = AuditLog.objects.select_related('user').all()
        action = self.request.query_params.get('action')
        if action:
            queryset = queryset.filter(action=action)
        return queryset
