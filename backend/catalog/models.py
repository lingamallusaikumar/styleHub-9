from django.db import models
from django.utils.text import slugify
from sellers.models import SellerProfile

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    image_url = models.URLField(max_length=500, blank=True, null=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} -> {self.name}"
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, default='')
    website = models.URLField(blank=True, default='')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_CHOICES = (
        ('WOMEN', 'Womenswear'),
        ('MEN', 'Menswear'),
        ('UNISEX', 'Unisex'),
        ('KIDS', 'Kidswear'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    seller = models.ForeignKey(SellerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='UNISEX')
    tags = models.ManyToManyField(Tag, blank=True, related_name='products')
    
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    is_featured = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    rating_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        return self.sale_price if self.sale_price else self.base_price

    @property
    def discount_percentage(self):
        if self.sale_price and self.base_price > self.sale_price:
            discount = ((self.base_price - self.sale_price) / self.base_price) * 100
            return round(discount)
        return 0

    def __str__(self):
        return f"{self.title} (${self.current_price})"


class ProductVariant(models.Model):
    SIZE_CHOICES = (
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', 'Double XL'),
        ('ONE_SIZE', 'One Size'),
    )

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    color_name = models.CharField(max_length=50)
    color_hex = models.CharField(max_length=10, default='#000000')
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='M')
    material = models.CharField(max_length=100, default='100% Premium Cotton')
    stock_quantity = models.PositiveIntegerField(default=50)
    additional_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['color_name', 'size']
        unique_together = ('product', 'color_name', 'size')

    @property
    def final_price(self):
        return self.product.current_price + self.additional_price

    def __str__(self):
        return f"{self.product.title} - {self.color_name} / {self.size} (SKU: {self.sku})"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image_url = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True, default='')
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-is_primary', 'display_order']

    def __str__(self):
        return f"Image for {self.product.title}"


class ProductSpec(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specs')
    spec_key = models.CharField(max_length=100) # e.g., "Care Instructions", "Fabric", "Fit"
    spec_value = models.CharField(max_length=255) # e.g., "Dry Clean Only", "Silk Blend", "Regular Fit"

    class Meta:
        ordering = ['spec_key']

    def __str__(self):
        return f"{self.spec_key}: {self.spec_value}"
