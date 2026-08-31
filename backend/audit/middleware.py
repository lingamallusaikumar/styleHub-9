from .models import AuditLog

class AuditLoggingMiddleware:
    """
    Middleware to automatically track state-changing API operations (POST, PUT, PATCH, DELETE)
    and record security/audit events into the AuditLog table.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Log mutating API requests or admin endpoints
        if request.path.startswith('/api/') or request.path.startswith('/admin/'):
            if request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] or 'admin' in request.path:
                try:
                    user = request.user if hasattr(request, 'user') and request.user.is_authenticated else None
                    
                    # Extract IP address
                    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                    if x_forwarded_for:
                        ip = x_forwarded_for.split(',')[0].strip()
                    else:
                        ip = request.META.get('REMOTE_ADDR')

                    action = 'UPDATE'
                    if request.method == 'POST':
                        action = 'CREATE'
                    elif request.method == 'DELETE':
                        action = 'DELETE'
                    
                    if 'login' in request.path:
                        action = 'LOGIN'
                    elif 'register' in request.path:
                        action = 'REGISTER'
                    elif 'checkout' in request.path:
                        action = 'CHECKOUT'
                    elif 'payment' in request.path:
                        action = 'PAYMENT'
                    elif 'refund' in request.path:
                        action = 'REFUND'
                    elif 'admin' in request.path:
                        action = 'ADMIN_ACTION'

                    AuditLog.objects.create(
                        user=user,
                        action=action,
                        method=request.method,
                        path=request.path[:254],
                        ip_address=ip,
                        status_code=response.status_code,
                        details={
                            'query_params': dict(request.GET),
                            'content_type': request.content_type,
                        }
                    )
                except Exception:
                    # Logging failure must never break user request processing
                    pass

        return response
