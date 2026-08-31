from django.db import models
from django.conf import settings
from django.db.models import Avg, Count
from catalog.models import Product

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(default=5) # 1 to 5 stars
    title = models.CharField(max_length=150)
    comment = models.TextField()
    is_verified_buyer = models.BooleanField(default=True)
    seller_response = models.TextField(blank=True, default='')
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('product', 'user')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update aggregate rating on product
        stats = Review.objects.filter(product=self.product).aggregate(avg=Avg('rating'), count=Count('id'))
        self.product.rating_avg = round(stats['avg'] or 0.0, 2)
        self.product.rating_count = stats['count'] or 0
        self.product.save()

    def __str__(self):
        return f"{self.rating}★ by {self.user.email} on {self.product.title}"


class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500)

    def __str__(self):
        return f"Image for Review #{self.review.id}"


class ReviewHelpfulVote(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('review', 'user')
