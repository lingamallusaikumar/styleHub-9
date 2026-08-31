import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.mark.django_db
class TestAuthenticationAndAccounts:
    def setup_method(self):
        self.client = APIClient()

    def test_user_registration(self):
        payload = {
            'email': 'testuser@example.com',
            'password': 'Password123!',
            'full_name': 'Test User',
            'role': 'CUSTOMER'
        }
        response = self.client.post('/api/auth/register/', payload, format='json')
        assert response.status_code == 201
        assert User.objects.filter(email='testuser@example.com').exists()

    def test_user_jwt_login(self):
        user = User.objects.create_user(
            email='loginuser@example.com',
            password='SecretPassword123',
            full_name='Login User'
        )
        response = self.client.post('/api/auth/token/', {
            'email': 'loginuser@example.com',
            'password': 'SecretPassword123'
        }, format='json')
        assert response.status_code == 200
        assert 'access' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == 'loginuser@example.com'

    def test_user_profile_retrieval(self):
        user = User.objects.create_user(
            email='profileuser@example.com',
            password='SecretPassword123',
            full_name='Profile User'
        )
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/auth/profile/')
        assert response.status_code == 200
        assert response.data['full_name'] == 'Profile User'
