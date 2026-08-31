from rest_framework import views, permissions, status
from rest_framework.response import Response
from .services import AnalyticsService

class ExecutiveDashboardView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        kpis = AnalyticsService.get_executive_kpis()
        sales_category = AnalyticsService.get_sales_by_category()
        top_products = AnalyticsService.get_top_products()

        return Response({
            'kpis': kpis,
            'sales_by_category': sales_category,
            'top_products': top_products,
        })
