from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer

class ValidateCouponView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        subtotal = float(request.data.get('subtotal', 0))

        if not code:
            return Response({'error': 'Coupon code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)

        is_valid, msg = coupon.is_valid_now()
        if not is_valid:
            return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)

        discount_amount, calc_msg = coupon.calculate_discount(subtotal)
        if discount_amount <= 0:
            return Response({'error': calc_msg}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': float(coupon.discount_value),
            'discount_amount': discount_amount,
            'new_subtotal': round(subtotal - discount_amount, 2),
            'message': calc_msg
        })


class AdminCouponViewSet(generics.ListCreateAPIView):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]
