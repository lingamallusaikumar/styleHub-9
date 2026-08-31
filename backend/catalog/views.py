from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, F
from .models import Category, Brand, Tag, Product, ProductVariant
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    TagSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductVariantSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True).prefetch_related('children')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related('category', 'brand', 'seller').prefetch_related('images', 'variants', 'tags').all()
        
        # Search query (supports 'search' or 'q')
        q = self.request.query_params.get('search') or self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(
                Q(title__icontains=q) |
                Q(description__icontains=q) |
                Q(category__name__icontains=q) |
                Q(brand__name__icontains=q) |
                Q(tags__name__icontains=q)
            ).distinct()

        # Category filter
        category = self.request.query_params.get('category')
        if category and category != 'all':
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(Q(category__slug=category) | Q(category__parent__slug=category))

        # Brand filter
        brand = self.request.query_params.get('brand')
        if brand and brand != 'all':
            if brand.isdigit():
                queryset = queryset.filter(brand_id=brand)
            else:
                queryset = queryset.filter(brand__slug=brand)

        # Gender filter
        gender = self.request.query_params.get('gender')
        if gender:
            queryset = queryset.filter(gender__iexact=gender)

        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(base_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(base_price__lte=max_price)

        # Featured & Trending flags
        is_featured = self.request.query_params.get('is_featured')
        if is_featured and is_featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        is_trending = self.request.query_params.get('is_trending')
        if is_trending and is_trending.lower() == 'true':
            queryset = queryset.filter(is_trending=True)

        # Color & Size filters
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(variants__color_name__iexact=color).distinct()

        size = self.request.query_params.get('size')
        if size:
            queryset = queryset.filter(variants__size__iexact=size).distinct()

        # Sorting (supports 'sort' or 'ordering')
        sort = self.request.query_params.get('sort') or self.request.query_params.get('ordering')
        if sort == 'price_asc':
            queryset = queryset.order_by('base_price')
        elif sort == 'price_desc':
            queryset = queryset.order_by('-base_price')
        elif sort == 'rating':
            queryset = queryset.order_by('-rating_avg', '-rating_count')
        elif sort == 'popularity':
            queryset = queryset.order_by('-views_count')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views count
        Product.objects.filter(id=instance.id).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)[:8]
        serializer = ProductListSerializer(featured_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending_products = self.get_queryset().filter(is_trending=True)[:8]
        serializer = ProductListSerializer(trending_products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def filters(self, request):
        """Return available categories, brands, colors, and price bounds for dynamic filter sidebars."""
        categories = Category.objects.values('id', 'name', 'slug')
        brands = Brand.objects.values('id', 'name', 'slug')
        colors = ProductVariant.objects.values_list('color_name', flat=True).distinct()
        sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        return Response({
            'categories': list(categories),
            'brands': list(brands),
            'colors': sorted(list(set(colors))),
            'sizes': sizes,
            'genders': ['WOMEN', 'MEN', 'UNISEX', 'KIDS'],
        })
