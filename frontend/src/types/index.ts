export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  phone_number?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: number;
}

export interface ProductImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  color_name: string;
  size: string;
  stock_quantity: number;
  price_override?: number | null;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  category: Category | string;
  brand: Brand | string;
  images: ProductImage[];
  variants: ProductVariant[];
  avg_rating: number;
  review_count: number;
  view_count: number;
  is_featured: boolean;
  discount_percentage?: number;
}

export interface CartItem {
  id: number;
  variant: ProductVariant;
  product: {
    id: number;
    title: string;
    slug: string;
    brand_name: string;
    image_url: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

export interface Coupon {
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount_value: number;
  min_spend: number;
}

export interface ShippingAddress {
  recipient_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: number;
  product_title: string;
  color_name: string;
  size: string;
  sku: string;
  image_url: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface ShipmentTracking {
  id: number;
  carrier: string;
  tracking_number: string;
  estimated_delivery: string;
  current_location: string;
  delivery_notes: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED';
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  shipping_address_data: ShippingAddress;
  coupon_code?: string;
  created_at: string;
  items: OrderItem[];
  shipment?: ShipmentTracking;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: 'ORDER_UPDATE' | 'PRICE_DROP' | 'PROMO' | 'SYSTEM';
  is_read: boolean;
  created_at: string;
}

export interface SellerProfile {
  id: number;
  store_name: string;
  store_slug: string;
  description: string;
  is_approved: boolean;
  commission_rate: number;
  total_sales: number;
  rating: number;
}
