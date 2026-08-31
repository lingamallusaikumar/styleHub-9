from rest_framework import serializers
from .models import Category, Brand, Tag, Product, ProductVariant, ProductImage, ProductSpec

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodNestedField() if hasattr(serializers, 'SerializerMethodNestedField') else serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'parent', 'children', 'is_featured']

    def get_children(self, obj):
        if obj.children.exists():
            return CategorySerializer(obj.children.all(), many=True).data
        return []


class BrandSerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo_url', 'description', 'website', 'is_featured', 'product_count']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class ProductVariantSerializer(serializers.ModelSerializer):
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'sku', 'color_name', 'color_hex', 'size',
            'material', 'stock_quantity', 'additional_price',
            'final_price', 'is_active'
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'display_order']


class ProductSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpec
        fields = ['id', 'spec_key', 'spec_value']


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    brand_name = serializers.ReadOnlyField(source='brand.name')
    primary_image = serializers.SerializerMethodField()
    current_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'category', 'category_name',
            'brand', 'brand_name', 'gender', 'base_price',
            'sale_price', 'current_price', 'discount_percentage',
            'is_featured', 'is_trending', 'rating_avg', 'rating_count',
            'primary_image', 'created_at'
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if not img:
            img = obj.images.first()
        return img.image_url if img else 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop'


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    specs = ProductSpecSerializer(many=True, read_only=True)
    seller_store = serializers.ReadOnlyField(source='seller.store_name')
    current_price = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'brand', 'seller', 'seller_store', 'gender', 'tags',
            'base_price', 'sale_price', 'current_price', 'discount_percentage',
            'is_featured', 'is_trending', 'rating_avg', 'rating_count',
            'views_count', 'variants', 'images', 'specs',
            'created_at', 'updated_at'
        ]
