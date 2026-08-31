import { Product, Category, Brand, Order, SellerProfile, Review, NotificationItem } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'All Collection', slug: 'all' },
  { id: 2, name: "Women's Fashion", slug: 'womens-fashion' },
  { id: 3, name: "Men's Luxury", slug: 'mens-luxury' },
  { id: 4, name: 'Outerwear & Coats', slug: 'outerwear' },
  { id: 5, name: 'Footwear & Boots', slug: 'footwear' },
  { id: 6, name: 'Bags & Accessories', slug: 'accessories' },
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 1, name: 'Aura Milano', slug: 'aura-milano' },
  { id: 2, name: 'Maison Noir', slug: 'maison-noir' },
  { id: 3, name: 'Apex Atelier', slug: 'apex-atelier' },
  { id: 4, name: 'Vanguard Tailors', slug: 'vanguard-tailors' },
  { id: 5, name: 'Solstice Silk', slug: 'solstice-silk' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    title: 'Milano Cashmere Overcoat',
    slug: 'milano-cashmere-overcoat',
    description: 'Handcrafted from 100% Mongolian cashmere. Features tailored double-breasted buttoning, peak lapels, and a silk lining for supreme winter luxury.',
    base_price: 890.00,
    category: 'outerwear',
    brand: 'Aura Milano',
    avg_rating: 4.9,
    review_count: 38,
    view_count: 1240,
    is_featured: true,
    discount_percentage: 15,
    images: [
      { id: 1, image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop', is_primary: true },
      { id: 2, image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop', is_primary: false },
    ],
    variants: [
      { id: 1001, sku: 'COAT-BLK-S', color_name: 'Obsidian Black', size: 'S', stock_quantity: 12 },
      { id: 1002, sku: 'COAT-BLK-M', color_name: 'Obsidian Black', size: 'M', stock_quantity: 8 },
      { id: 1003, sku: 'COAT-CAM-L', color_name: 'Camel Beige', size: 'L', stock_quantity: 15 },
    ]
  },
  {
    id: 102,
    title: 'Vanguard Italian Leather Jacket',
    slug: 'vanguard-italian-leather-jacket',
    description: 'Precision-cut lambskin leather jacket with custom champagne gold zip hardware and padded quilted shoulders.',
    base_price: 1150.00,
    category: 'outerwear',
    brand: 'Vanguard Tailors',
    avg_rating: 4.8,
    review_count: 24,
    view_count: 980,
    is_featured: true,
    images: [
      { id: 3, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop', is_primary: true },
      { id: 4, image_url: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1000&auto=format&fit=crop', is_primary: false },
    ],
    variants: [
      { id: 1004, sku: 'LEATH-BLK-M', color_name: 'Midnight Black', size: 'M', stock_quantity: 5 },
      { id: 1005, sku: 'LEATH-BRN-L', color_name: 'Cognac Brown', size: 'L', stock_quantity: 7 },
    ]
  },
  {
    id: 103,
    title: 'Maison Noir Silk Pleated Gown',
    slug: 'maison-noir-silk-pleated-gown',
    description: 'Floor-length silk chiffon gown with delicate accordion pleats, an asymmetric neckline, and a flowing train designed for red-carpet elegance.',
    base_price: 1420.00,
    category: 'womens-fashion',
    brand: 'Maison Noir',
    avg_rating: 5.0,
    review_count: 19,
    view_count: 1560,
    is_featured: true,
    discount_percentage: 20,
    images: [
      { id: 5, image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', is_primary: true },
      { id: 6, image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', is_primary: false },
    ],
    variants: [
      { id: 1006, sku: 'GOWN-EMR-S', color_name: 'Emerald Green', size: 'S', stock_quantity: 4 },
      { id: 1007, sku: 'GOWN-RED-M', color_name: 'Ruby Scarlet', size: 'M', stock_quantity: 6 },
    ]
  },
  {
    id: 104,
    title: 'Apex Runner Chunky Sneakers',
    slug: 'apex-runner-chunky-sneakers',
    description: 'Avant-garde luxury footwear blending Italian calfskin leather with lightweight sculptural EVA outsoles.',
    base_price: 460.00,
    category: 'footwear',
    brand: 'Apex Atelier',
    avg_rating: 4.7,
    review_count: 52,
    view_count: 2100,
    is_featured: false,
    images: [
      { id: 7, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', is_primary: true },
    ],
    variants: [
      { id: 1008, sku: 'SNK-WHT-41', color_name: 'Alabaster White', size: '41', stock_quantity: 20 },
      { id: 1009, sku: 'SNK-WHT-42', color_name: 'Alabaster White', size: '42', stock_quantity: 18 },
    ]
  },
  {
    id: 105,
    title: 'Solstice Monogram Leather Tote Bag',
    slug: 'solstice-monogram-leather-tote-bag',
    description: 'Structured full-grain pebble leather tote featuring gold-plated lock clasp, suede-lined dual compartments, and detachable shoulder strap.',
    base_price: 680.00,
    category: 'accessories',
    brand: 'Solstice Silk',
    avg_rating: 4.9,
    review_count: 41,
    view_count: 1840,
    is_featured: true,
    images: [
      { id: 8, image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', is_primary: true },
    ],
    variants: [
      { id: 1010, sku: 'TOTE-TAN-OS', color_name: 'Tuscan Tan', size: 'One Size', stock_quantity: 14 },
    ]
  },
  {
    id: 106,
    title: 'Vanguard Bespoke Double-Breasted Suit',
    slug: 'vanguard-bespoke-double-breasted-suit',
    description: 'Precision-tailored Super 150s Wool suit crafted in Naples. Soft natural shoulder padding and horn buttons.',
    base_price: 1650.00,
    category: 'mens-luxury',
    brand: 'Vanguard Tailors',
    avg_rating: 5.0,
    review_count: 15,
    view_count: 750,
    is_featured: true,
    images: [
      { id: 9, image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop', is_primary: true },
    ],
    variants: [
      { id: 1011, sku: 'SUIT-NVY-40R', color_name: 'Navy Blue', size: '40R', stock_quantity: 3 },
      { id: 1012, sku: 'SUIT-CHA-42R', color_name: 'Charcoal Grey', size: '42R', stock_quantity: 5 },
    ]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    user_name: 'Victoria S.',
    rating: 5,
    title: 'Exquisite Quality & Drape',
    comment: 'The cashmere feels insanely soft against the skin. The tailoring is flawless, fits true to size with room for layering.',
    is_verified_purchase: true,
    created_at: '2026-08-25'
  },
  {
    id: 2,
    user_name: 'Julian M.',
    rating: 5,
    title: 'Worth Every Penny',
    comment: 'Fast 2-day delivery and immaculate packaging. The leather is rich and smells incredible.',
    is_verified_purchase: true,
    created_at: '2026-08-28'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Order Shipped!',
    message: 'Your order #ORD-9841A2 has been handed to STYLEHUB Express with tracking #TRK-90A412F.',
    notification_type: 'ORDER_UPDATE',
    is_read: false,
    created_at: '10 mins ago'
  },
  {
    id: 2,
    title: 'Special Coupon Unlocked',
    message: 'Use code STYLE20 at checkout for 20% off your autumn wardrobe.',
    notification_type: 'PROMO',
    is_read: false,
    created_at: '1 hour ago'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'ORD-9841A2',
    status: 'SHIPPED',
    subtotal: 890.00,
    discount_amount: 178.00,
    shipping_fee: 0.00,
    tax_amount: 56.96,
    total_amount: 768.96,
    coupon_code: 'STYLE20',
    shipping_address_data: {
      recipient_name: 'Eleanor Vance',
      street_address: '742 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      postal_code: '10019',
      country: 'USA'
    },
    created_at: '2026-08-29',
    items: [
      {
        id: 1,
        product_title: 'Milano Cashmere Overcoat',
        color_name: 'Obsidian Black',
        size: 'M',
        sku: 'COAT-BLK-M',
        image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop',
        unit_price: 890.00,
        quantity: 1,
        total_price: 890.00
      }
    ],
    shipment: {
      id: 1,
      carrier: 'STYLEHUB_EXPRESS',
      tracking_number: 'TRK-90A412F',
      estimated_delivery: '2026-09-04',
      current_location: 'In Transit - Distribution Center (Jersey City, NJ)',
      delivery_notes: 'On track for scheduled delivery window.'
    }
  }
];

export const MOCK_SELLER_PROFILE: SellerProfile = {
  id: 1,
  store_name: 'Aura Milano Boutique',
  store_slug: 'aura-milano-store',
  description: 'Official flagship boutique of Aura Milano high fashion.',
  is_approved: true,
  commission_rate: 12.5,
  total_sales: 148500.00,
  rating: 4.95
};
