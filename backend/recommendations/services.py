from django.db.models import Q, Count
from catalog.models import Product
from orders.models import OrderItem

class RecommendationEngine:
    @staticmethod
    def get_similar_products(product, limit=6):
        """
        Finds products in the same category or brand with similar price range & gender.
        """
        min_p = float(product.base_price) * 0.7
        max_p = float(product.base_price) * 1.3

        similar = Product.objects.filter(
            Q(category=product.category) | Q(brand=product.brand),
            gender__in=[product.gender, 'UNISEX'],
            base_price__gte=min_p,
            base_price__lte=max_p
        ).exclude(id=product.id).select_related('category', 'brand').prefetch_related('images')[:limit]

        if len(similar) < limit:
            fallback = Product.objects.filter(category=product.category).exclude(id=product.id)[:limit]
            return list(set(list(similar) + list(fallback)))[:limit]
        return similar

    @staticmethod
    def get_frequently_bought_together(product, limit=4):
        """
        Identifies products co-purchased in completed order histories.
        """
        order_ids = OrderItem.objects.filter(variant__product=product).values_list('order_id', flat=True)
        co_items = OrderItem.objects.filter(order_id__in=order_ids).exclude(variant__product=product).values('variant__product').annotate(count=Count('id')).order_by('-count')[:limit]

        product_ids = [item['variant__product'] for item in co_items if item['variant__product']]
        products = Product.objects.filter(id__in=product_ids).prefetch_related('images')
        
        if len(products) < limit:
            fallback = Product.objects.filter(category=product.category).exclude(id=product.id)[:limit]
            return list(set(list(products) + list(fallback)))[:limit]
        return products

    @staticmethod
    def get_personalized_recommendations(user, limit=8):
        """
        Recommends products based on user profile preferences or top trending products.
        """
        if user and hasattr(user, 'profile') and user.profile.gender_preference != 'ALL':
            pref = user.profile.gender_preference
            queryset = Product.objects.filter(gender__iexact=pref)
        else:
            queryset = Product.objects.all()

        return queryset.filter(is_featured=True).order_by('-rating_avg', '-views_count')[:limit]
