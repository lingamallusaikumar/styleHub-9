import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from catalog.models import Category, Brand, Product, ProductVariant
from promotions.models import Coupon
from orders.models import Order

User = get_user_model()

@pytest.mark.django_db
class TestCartOrdersAndCheckout:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='shopper@example.com', password='Password123!', full_name='Shopper')
        self.client.force_authenticate(user=self.user)

        self.category = Category.objects.create(name='Sneakers', slug='sneakers')
        self.brand = Brand.objects.create(name='Apex', slug='apex')
        self.product = Product.objects.create(
            title='Apex Runner Sneakers',
            slug='apex-runner-sneakers',
            description='Chunky athletic sneakers',
            category=self.category,
            brand=self.brand,
            base_price=180.00
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            sku='SKU-SNK-WHT-42',
            color_name='White',
            size='M',
            stock_quantity=50
        )
        self.coupon = Coupon.objects.create(
            code='STYLE20',
            discount_type='PERCENTAGE',
            discount_value=20.0,
            min_spend=100.0,
            is_active=True
        )

    def test_add_to_cart(self):
        response = self.client.post('/api/cart/add/', {
            'variant_id': self.variant.id,
            'quantity': 2
        }, format='json')
        assert response.status_code == 200
        assert response.data['item_count'] == 2
        assert response.data['subtotal'] == 360.00

    def test_full_checkout_flow(self):
        # 1. Add to cart
        self.client.post('/api/cart/add/', {'variant_id': self.variant.id, 'quantity': 1}, format='json')

        # 2. Checkout
        shipping_addr = {
            'recipient_name': 'Shopper Name',
            'street_address': '100 Fashion Way',
            'city': 'New York',
            'state': 'NY',
            'postal_code': '10001',
            'country': 'USA'
        }
        checkout_res = self.client.post('/api/orders/checkout/', {
            'shipping_address': shipping_addr,
            'coupon_code': 'STYLE20'
        }, format='json')
        
        assert checkout_res.status_code == 201
        order_number = checkout_res.data['order_number']
        assert float(checkout_res.data['discount_amount']) == 36.00 # 20% of $180
        assert checkout_res.data['status'] == 'PENDING'

        # 3. Process Mock Payment
        pay_res = self.client.post('/api/payments/process/', {
            'order_number': order_number,
            'payment_method': 'CREDIT_CARD'
        }, format='json')
        assert pay_res.status_code == 200
        assert pay_res.data['success'] is True

        # 4. Check Order status changed to PROCESSING
        order = Order.objects.get(order_number=order_number)
        assert order.status == 'PAID' or order.status == 'PROCESSING'
