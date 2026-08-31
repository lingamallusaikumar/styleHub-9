import pytest
from rest_framework.test import APIClient
from catalog.models import Category, Brand, Product, ProductVariant

@pytest.mark.django_db
class TestCatalogAndSearch:
    def setup_method(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Outerwear', slug='outerwear')
        self.brand = Brand.objects.create(name='Noir Couture', slug='noir-couture')
        self.product = Product.objects.create(
            title='Classic Cashmere Coat',
            slug='classic-cashmere-coat',
            description='Pure cashmere luxury coat',
            category=self.category,
            brand=self.brand,
            base_price=350.00,
            gender='UNISEX',
            is_featured=True
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku='SKU-COAT-BLK-M',
            color_name='Midnight Black',
            size='M',
            stock_quantity=25
        )

    def test_product_list_api(self):
        response = self.client.get('/api/catalog/products/')
        assert response.status_code == 200
        assert response.data['count'] >= 1
        assert response.data['results'][0]['title'] == 'Classic Cashmere Coat'

    def test_product_search(self):
        response = self.client.get('/api/catalog/products/?q=Cashmere')
        assert response.status_code == 200
        assert response.data['count'] == 1

    def test_product_category_filter(self):
        response = self.client.get('/api/catalog/products/?category=outerwear')
        assert response.status_code == 200
        assert response.data['count'] == 1

    def test_product_detail_and_view_count(self):
        response = self.client.get('/api/catalog/products/classic-cashmere-coat/')
        assert response.status_code == 200
        assert response.data['title'] == 'Classic Cashmere Coat'
        assert response.data['views_count'] == 1
