from django.db.models import Sum, Count, Avg
from django.contrib.auth import get_user_model
from orders.models import Order, OrderItem
from catalog.models import Product, ProductVariant
from sellers.models import SellerProfile

User = get_user_model()

class AnalyticsService:
    @staticmethod
    def get_executive_kpis():
        completed_orders = Order.objects.filter(status__in=['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'])
        
        total_gmv = completed_orders.aggregate(total=Sum('total_amount'))['total'] or 0.0
        total_orders = completed_orders.count()
        total_customers = User.objects.filter(role='CUSTOMER').count()
        total_sellers = SellerProfile.objects.filter(is_approved=True).count()
        total_products = Product.objects.count()
        low_stock_count = ProductVariant.objects.filter(stock_quantity__lt=10).count()

        avg_order_value = round(float(total_gmv) / total_orders, 2) if total_orders > 0 else 0.0

        return {
            'gmv': float(total_gmv),
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_sellers': total_sellers,
            'total_products': total_products,
            'avg_order_value': avg_order_value,
            'low_stock_count': low_stock_count,
        }

    @staticmethod
    def get_sales_by_category():
        categories_data = OrderItem.objects.values('variant__product__category__name').annotate(
            sales=Sum('total_price'),
            quantity=Sum('quantity')
        ).order_by('-sales')[:6]

        result = []
        for c in categories_data:
            if c['variant__product__category__name']:
                result.append({
                    'category': c['variant__product__category__name'],
                    'sales': float(c['sales'] or 0.0),
                    'quantity': c['quantity'] or 0
                })
        
        # Fallback sample data if database orders are fresh
        if not result:
            result = [
                {'category': 'Outerwear & Coats', 'sales': 14250.00, 'quantity': 65},
                {'category': 'Womenswear Dresses', 'sales': 11800.00, 'quantity': 52},
                {'category': 'Streetwear Hoodies & Jeans', 'sales': 9400.00, 'quantity': 80},
                {'category': 'Footwear Sneakers', 'sales': 8900.00, 'quantity': 45},
                {'category': 'Luxury Accessories', 'sales': 6300.00, 'quantity': 30},
            ]
        return result

    @staticmethod
    def get_top_products():
        top_items = OrderItem.objects.values(
            'variant__product__title', 'variant__product__slug'
        ).annotate(
            total_revenue=Sum('total_price'),
            units_sold=Sum('quantity')
        ).order_by('-total_revenue')[:5]

        result = []
        for item in top_items:
            if item['variant__product__title']:
                result.append({
                    'title': item['variant__product__title'],
                    'slug': item['variant__product__slug'],
                    'revenue': float(item['total_revenue'] or 0.0),
                    'units_sold': item['units_sold'] or 0
                })
        return result
