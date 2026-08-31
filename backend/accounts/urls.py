from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserProfileView,
    UpdateProfileExtraView,
    AddressViewSet,
    ChangePasswordView,
    AdminUserListView
)

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/preferences/', UpdateProfileExtraView.as_view(), name='user_preferences'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('', include(router.urls)),
]
