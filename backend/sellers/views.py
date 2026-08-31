from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import SellerProfile
from .serializers import SellerProfileSerializer
from accounts.permissions import IsSellerOrAdmin

class SellerProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = SellerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'store_name': f"{self.request.user.full_name}'s Boutique",
                'store_slug': f"{self.request.user.id}-store",
                'contact_email': self.request.user.email,
            }
        )
        return profile


class PublicSellerStoreView(generics.RetrieveAPIView):
    queryset = SellerProfile.objects.filter(is_approved=True)
    serializer_class = SellerProfileSerializer
    lookup_field = 'store_slug'
    permission_classes = [permissions.AllowAny]


class AdminSellerListView(generics.ListUpdateAPIView):
    queryset = SellerProfile.objects.all()
    serializer_class = SellerProfileSerializer
    permission_classes = [permissions.IsAdminUser]
