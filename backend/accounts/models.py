from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('SELLER', 'Seller/Merchant'),
        ('SUPPORT', 'Support Agent'),
        ('ADMIN', 'Platform Administrator'),
    )

    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_('full name'), max_length=150)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class UserProfile(models.Model):
    GENDER_CHOICES = (
        ('ALL', 'Unspecified / Unisex'),
        ('WOMEN', 'Womenswear'),
        ('MEN', 'Menswear'),
        ('KIDS', 'Kidswear'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    preferred_size = models.CharField(max_length=10, default='M', blank=True)
    favorite_color = models.CharField(max_length=30, default='Midnight Black', blank=True)
    gender_preference = models.CharField(max_length=20, choices=GENDER_CHOICES, default='ALL')
    loyalty_points = models.PositiveIntegerField(default=100)
    newsletter_subscribed = models.BooleanField(default=True)

    def __str__(self):
        return f"Profile for {self.user.email}"


class Address(models.Model):
    ADDRESS_TYPES = (
        ('HOME', 'Home Address'),
        ('WORK', 'Work / Office'),
        ('OTHER', 'Other Location'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=50, choices=ADDRESS_TYPES, default='HOME')
    recipient_name = models.CharField(max_length=150)
    street_address = models.CharField(max_length=255)
    apartment = models.CharField(max_length=100, blank=True, default='')
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United States')
    phone_number = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_default', '-created_at']

    def save(self, *args, **kwargs):
        if self.is_default:
            # Set other user addresses default=False
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title}: {self.recipient_name}, {self.city}"
