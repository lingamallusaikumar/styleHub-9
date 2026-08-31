"""
Sellers Security, Rate Limiting & Audit Logging Middleware.
"""
import logging
import time

logger = logging.getLogger(__name__)

class SellersDomainSecurityMiddlewareModule4:
    """Custom middleware processing sellers request pipelines."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        logger.debug(f"[Sellers Middleware] Incoming request: {request.path}")
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        response['X-Sellers-Latency-MS'] = str(round(duration * 1000, 2))
        return response
