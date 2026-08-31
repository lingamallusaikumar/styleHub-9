from django.urls import path
from .views import SimilarProductsView, FrequentlyBoughtTogetherView, PersonalizedFeedView

urlpatterns = [
    path('', PersonalizedFeedView.as_view(), name='rec-root'),
    path('similar/<slug:slug>/', SimilarProductsView.as_view(), name='rec-similar'),
    path('bought-together/<slug:slug>/', FrequentlyBoughtTogetherView.as_view(), name='rec-bought-together'),
    path('personalized/', PersonalizedFeedView.as_view(), name='rec-personalized'),
]
