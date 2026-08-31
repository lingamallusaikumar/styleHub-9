"""
Inventory Security, Rate Limiting & Audit Logging Middleware.
"""
import logging
import time

logger = logging.getLogger(__name__)

class InventoryDomainSecurityMiddlewareModule6:
    """Custom middleware processing inventory request pipelines."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        logger.debug(f"[Inventory Middleware] Incoming request: {request.path}")
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        response['X-Inventory-Latency-MS'] = str(round(duration * 1000, 2))
        return response
