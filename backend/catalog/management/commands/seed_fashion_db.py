import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from accounts.models import UserProfile, Address
from sellers.models import SellerProfile
from catalog.models import Category, Brand, Tag, Product, ProductVariant, ProductImage, ProductSpec

User = get_user_model()

# High quality Unsplash fashion images
IMAGE_POOL = {
    'Dresses': [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop',
    ],
    'Suits': [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop',
    ],
    'Jackets': [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop',
    ],
    'Sneakers': [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop',
    ],
    'Handbags': [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop',
    ],
    'Sunglasses': [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop',
    ],
    'Hoodies': [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop',
    ],
    'Jeans': [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop',
    ],
    'Watches': [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
    ],
    'Sweaters': [
        'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
    ]
}

COLORS = [
    ('Midnight Black', '#0F172A'),
    ('Pearl White', '#F8FAFC'),
    ('Royal Navy', '#1E3A8A'),
    ('Burgundy Red', '#881337'),
    ('Emerald Green', '#064E3B'),
    ('Camel Brown', '#9A3412'),
    ('Slate Gray', '#475569'),
    ('Rose Gold', '#FDA4AF'),
]

SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

FASHION_TITLES = [
    ("Velvet Evening Gown", "Dresses", "WOMEN", 280, 240),
    ("Silk Slip Midi Dress", "Dresses", "WOMEN", 195, 165),
    ("Floral Empire Maxi Dress", "Dresses", "WOMEN", 210, None),
    ("Pleated Cocktail Dress", "Dresses", "WOMEN", 260, 220),
    ("Ribbed Knit Bodycon Dress", "Dresses", "WOMEN", 145, 120),
    ("Tailored Double-Breasted Suit", "Suits", "MEN", 450, 380),
    ("Slim-Fit Tuxedo Blazer", "Suits", "MEN", 390, None),
    ("Modern Italian Wool Suit", "Suits", "MEN", 520, 440),
    ("Classic Tweed Blazer", "Suits", "MEN", 310, 270),
    ("Pinstripe Business Suit", "Suits", "MEN", 480, None),
    ("Leather Moto Biker Jacket", "Jackets", "UNISEX", 320, 280),
    ("Quilted Down Parka Coat", "Jackets", "UNISEX", 290, 230),
    ("Vintage Denim Trucker Jacket", "Jackets", "UNISEX", 160, 135),
    ("Oversized Trench Coat", "Jackets", "WOMEN", 340, 295),
    ("Waterproof Technical Windbreaker", "Jackets", "MEN", 210, 175),
    ("Retro High-Top Leather Sneakers", "Sneakers", "UNISEX", 180, 150),
    ("Chunky Athletic Running Shoes", "Sneakers", "UNISEX", 165, 140),
    ("Minimalist Calfskin Low-Tops", "Sneakers", "UNISEX", 220, 190),
    ("Canvas Skater Sneakers", "Sneakers", "UNISEX", 110, 90),
    ("Luxury Designer Trainer Sneakers", "Sneakers", "UNISEX", 350, 295),
    ("Monogram Leather Tote Bag", "Handbags", "WOMEN", 420, 360),
    ("Quilted Chain Shoulder Bag", "Handbags", "WOMEN", 380, None),
    ("Structured Crossbody Bag", "Handbags", "WOMEN", 240, 195),
    ("Suede Bucket Shoulder Bag", "Handbags", "WOMEN", 290, 245),
    ("Minimalist Clutch Purse", "Handbags", "WOMEN", 175, 140),
    ("Polarized Aviator Sunglasses", "Sunglasses", "UNISEX", 160, 130),
    ("Cat-Eye Acetate Sunglasses", "Sunglasses", "WOMEN", 185, 155),
    ("Square Frame Tortoiseshell Shades", "Sunglasses", "UNISEX", 140, 115),
    ("Retro Gold-Rimmed Sunglasses", "Sunglasses", "UNISEX", 195, None),
    ("Heavyweight Fleece Pullover Hoodie", "Hoodies", "UNISEX", 130, 105),
    ("French Terry Zip-Up Hoodie", "Hoodies", "UNISEX", 120, 95),
    ("Graphic Streetwear Oversized Hoodie", "Hoodies", "UNISEX", 145, 125),
    ("Embroidered Logo Hoodie", "Hoodies", "UNISEX", 160, None),
    ("Raw Selvedge Slim Jeans", "Jeans", "MEN", 175, 145),
    ("High-Waisted Wide-Leg Denim", "Jeans", "WOMEN", 165, 135),
    ("Distressed Vintage Straight Jeans", "Jeans", "UNISEX", 150, 120),
    ("Relaxed Fit Carpenter Jeans", "Jeans", "MEN", 140, None),
    ("Automatic Chronograph Leather Watch", "Watches", "UNISEX", 580, 490),
    ("Minimalist Stainless Steel Watch", "Watches", "UNISEX", 310, 260),
    ("Rose Gold Skeleton Dial Watch", "Watches", "WOMEN", 460, 395),
    ("Cashmere Crewneck Knit Sweater", "Sweaters", "UNISEX", 260, 215),
    ("Cable-Knit Chunky Cardigan", "Sweaters", "UNISEX", 190, 160),
    ("Merino Wool Turtleneck Sweater", "Sweaters", "UNISEX", 210, 175),
]

class Command(BaseCommand):
    help = 'Seeds StyleHub database with users, categories, brands, and 100+ realistic fashion products'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting StyleHub Fashion DB Seeding...'))

        # 1. Admin User
        admin_user, created = User.objects.get_or_create(
            email='admin@stylehub.com',
            defaults={
                'full_name': 'StyleHub Administrator',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin12345')
            admin_user.save()
            UserProfile.objects.create(user=admin_user)
            self.stdout.write('Created Superuser: admin@stylehub.com / admin12345')

        # 2. Seller Users & Profiles
        sellers_data = [
            ('Vogue Atelier Store', 'seller@vogue.com', 'vogue-atelier-store'),
            ('Noir & Co. Luxury', 'seller@noir.com', 'noir-co-luxury'),
            ('Urban Stitch Marketplace', 'seller@urban.com', 'urban-stitch-mkt'),
        ]
        seller_profiles = []
        for store_name, email, slug in sellers_data:
            u, _ = User.objects.get_or_create(
                email=email,
                defaults={'full_name': store_name, 'role': 'SELLER'}
            )
            u.set_password('seller12345')
            u.save()
            UserProfile.objects.get_or_create(user=u)
            sp, _ = SellerProfile.objects.get_or_create(
                user=u,
                defaults={
                    'store_name': store_name,
                    'store_slug': slug,
                    'contact_email': email,
                    'is_approved': True
                }
            )
            seller_profiles.append(sp)

        # 3. Customer User
        cust_user, created = User.objects.get_or_create(
            email='customer@example.com',
            defaults={'full_name': 'Sophia Loren', 'role': 'CUSTOMER'}
        )
        if created:
            cust_user.set_password('password123')
            cust_user.save()
            UserProfile.objects.create(user=cust_user)
            Address.objects.create(
                user=cust_user,
                title='HOME',
                recipient_name='Sophia Loren',
                street_address='742 Evergreen Terrace',
                city='New York',
                state='NY',
                postal_code='10001',
                country='United States',
                phone_number='+1 (555) 019-2834',
                is_default=True
            )
            self.stdout.write('Created Customer: customer@example.com / password123')

        # 4. Categories & Subcategories
        main_cats = ['Womenswear', 'Menswear', 'Outerwear', 'Footwear', 'Accessories', 'Streetwear']
        cat_objs = {}
        for mc in main_cats:
            c, _ = Category.objects.get_or_create(name=mc, slug=slugify(mc), is_featured=True)
            cat_objs[mc] = c

        subcats = {
            'Dresses': cat_objs['Womenswear'],
            'Suits': cat_objs['Menswear'],
            'Jackets': cat_objs['Outerwear'],
            'Sneakers': cat_objs['Footwear'],
            'Handbags': cat_objs['Accessories'],
            'Sunglasses': cat_objs['Accessories'],
            'Hoodies': cat_objs['Streetwear'],
            'Jeans': cat_objs['Streetwear'],
            'Watches': cat_objs['Accessories'],
            'Sweaters': cat_objs['Outerwear'],
        }
        subcat_objs = {}
        for name, parent in subcats.items():
            sc, _ = Category.objects.get_or_create(name=name, slug=slugify(name), parent=parent)
            subcat_objs[name] = sc

        # 5. Brands
        brand_names = ['Vogue Atelier', 'Noir & Co.', 'Urban Stitch', 'Apex Luxe', 'Silk & Ember', 'Velvet Vault', 'Modern Line', 'EcoThread']
        brand_objs = []
        for bn in brand_names:
            b, _ = Brand.objects.get_or_create(name=bn, slug=slugify(bn), is_featured=True)
            brand_objs.append(b)

        # 6. Tags
        tag_names = ['Trending', 'Bestseller', 'Eco-Friendly', 'Limited Edition', 'New Arrival', 'Summer Fashion', 'Winter Luxe']
        tag_objs = []
        for tn in tag_names:
            t, _ = Tag.objects.get_or_create(name=tn, slug=slugify(tn))
            tag_objs.append(t)

        # 7. Generate 105 Fashion Products!
        self.stdout.write('Generating 100+ Products...')
        count = 0

        # Loop through fashion titles multiple times with modifiers to create 100+ unique entries
        modifiers = ["Essential", "Luxury", "Haute", "Artisanal", "Signature", "Classic", "Modern", "Urban", "Premium", "Atelier"]
        
        for i in range(105):
            title_base, cat_key, gender, base_p, sale_p = FASHION_TITLES[i % len(FASHION_TITLES)]
            modifier = modifiers[(i // len(FASHION_TITLES)) % len(modifiers)]
            
            title = f"{modifier} {title_base}" if i >= len(FASHION_TITLES) else title_base
            price = base_p + (i % 5) * 10
            sp = price - 30 if (i % 3 == 0) else None

            cat = subcat_objs[cat_key]
            brand = brand_objs[i % len(brand_objs)]
            seller = seller_profiles[i % len(seller_profiles)]
            images = IMAGE_POOL.get(cat_key, IMAGE_POOL['Dresses'])

            product, created = Product.objects.get_or_create(
                title=title,
                defaults={
                    'description': f"Experience unprecedented elegance with the {title}. Crafted with precision tailored for modern fashion enthusiasts.",
                    'category': cat,
                    'brand': brand,
                    'seller': seller,
                    'gender': gender,
                    'base_price': price,
                    'sale_price': sp,
                    'is_featured': (i % 4 == 0),
                    'is_trending': (i % 3 == 0),
                    'rating_avg': round(random.uniform(4.2, 5.0), 2),
                    'rating_count': random.randint(12, 180),
                    'views_count': random.randint(100, 2500)
                }
            )

            if created:
                # Add Tags
                product.tags.add(*random.sample(tag_objs, k=random.randint(1, 3)))

                # Add Primary & Gallery Images
                ProductImage.objects.create(
                    product=product,
                    image_url=images[0],
                    alt_text=f"{product.title} Main",
                    is_primary=True,
                    display_order=1
                )
                if len(images) > 1:
                    ProductImage.objects.create(
                        product=product,
                        image_url=images[1],
                        alt_text=f"{product.title} Gallery View",
                        is_primary=False,
                        display_order=2
                    )

                # Add Specs
                ProductSpec.objects.create(product=product, spec_key='Material', spec_value='100% Sustainable Cotton / Italian Silk')
                ProductSpec.objects.create(product=product, spec_key='Fit', spec_value='Tailored Regular Fit')
                ProductSpec.objects.create(product=product, spec_key='Care', spec_value='Dry Clean Only')

                # Add 3 Variants per product (Different color & size combinations)
                chosen_colors = random.sample(COLORS, k=2)
                for color_name, color_hex in chosen_colors:
                    for size in random.sample(SIZES, k=2):
                        sku = f"SKU-{product.id}-{color_name[:3].upper()}-{size}"
                        ProductVariant.objects.get_or_create(
                            product=product,
                            color_name=color_name,
                            size=size,
                            defaults={
                                'sku': sku,
                                'color_hex': color_hex,
                                'stock_quantity': random.randint(15, 100),
                                'additional_price': 0.00
                            }
                        )
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} fashion products with 300+ variants and images!"))
