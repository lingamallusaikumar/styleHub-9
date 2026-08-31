from rest_framework import permissions

class IsSellerOrAdmin(permissions.BasePermission):
    """
    Permission check for Sellers or Administrators.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ['SELLER', 'ADMIN'] or request.user.is_staff)
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission check to verify if object belongs to the user or if user is an admin.
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff or request.user.role == 'ADMIN':
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
