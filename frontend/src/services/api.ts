import { Product, Category, Brand, Cart, Order, Review, Coupon, SellerProfile, NotificationItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, MOCK_ORDERS, MOCK_REVIEWS, MOCK_NOTIFICATIONS, MOCK_SELLER_PROFILE } from '../data/mockData';

const BASE_URL = 'http://127.0.0.1:8000/api';

export class ApiService {
  private static getHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  // Auth Methods
  static async login(email: string, password: string) {
    try {
      const res = await fetch(`${BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      return data;
    } catch {
      // Mock Login Fallback
      const userRole = email.includes('admin') ? 'ADMIN' : email.includes('seller') ? 'SELLER' : 'CUSTOMER';
      const mockUser = {
        email,
        full_name: email.split('@')[0].toUpperCase(),
        role: userRole,
        id: 99
      };
      localStorage.setItem('access_token', 'mock_jwt_token_123');
      localStorage.setItem('user_profile', JSON.stringify(mockUser));
      return { access: 'mock_jwt_token_123', user: mockUser };
    }
  }

  // Catalog Methods
  static async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
    try {
      const url = new URL(`${BASE_URL}/catalog/products/`);
      if (params?.category && params.category !== 'all') url.searchParams.append('category', params.category);
      if (params?.search) url.searchParams.append('search', params.search);
      if (params?.sort) url.searchParams.append('ordering', params.sort);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.results || data;
    } catch {
      let filtered = [...INITIAL_PRODUCTS];
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (params?.sort) {
        if (params.sort === 'price_asc') filtered.sort((a, b) => a.base_price - b.base_price);
        if (params.sort === 'price_desc') filtered.sort((a, b) => b.base_price - a.base_price);
        if (params.sort === 'rating') filtered.sort((a, b) => b.avg_rating - a.avg_rating);
      }
      return filtered;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${BASE_URL}/catalog/categories/`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  // Coupon Validation
  static validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'STYLE20') {
      if (subtotal < 100) return { valid: false, discount: 0, message: 'Minimum spend of $100 required for STYLE20' };
      const discount = Math.round(subtotal * 0.20 * 100) / 100;
      return { valid: true, discount, message: '20% Autumn Discount Applied!' };
    }
    if (formatted === 'VIP50') {
      if (subtotal < 300) return { valid: false, discount: 0, message: 'Minimum spend of $300 required for VIP50' };
      return { valid: true, discount: 50.00, message: '$50 VIP Flat Discount Applied!' };
    }
    return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
  }

  // Orders Checkout
  static async checkoutOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch(`${BASE_URL}/orders/checkout/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Checkout API failed');
      return await res.json();
    } catch {
      const newOrder: Order = {
        id: Date.now(),
        order_number: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'PENDING',
        subtotal: orderData.subtotal || 180.00,
        discount_amount: orderData.discount_amount || 0.00,
        shipping_fee: orderData.subtotal >= 200 ? 0.00 : 15.00,
        tax_amount: Math.round((orderData.subtotal * 0.08) * 100) / 100,
        total_amount: Math.round((orderData.subtotal - (orderData.discount_amount || 0) + (orderData.subtotal >= 200 ? 0 : 15) + (orderData.subtotal * 0.08)) * 100) / 100,
        shipping_address_data: orderData.shipping_address,
        coupon_code: orderData.coupon_code,
        created_at: new Date().toISOString().split('T')[0],
        items: orderData.items || [],
        shipment: {
          id: 99,
          carrier: 'STYLEHUB_EXPRESS',
          tracking_number: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          estimated_delivery: 'In 3-4 Business Days',
          current_location: 'Fulfillment Hub (New York, NY)',
          delivery_notes: 'Preparing package for carrier dispatch.'
        }
      };
      return newOrder;
    }
  }

  static async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${BASE_URL}/orders/my-orders/`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Orders fetch error');
      return await res.json();
    } catch {
      return MOCK_ORDERS;
    }
  }

  static async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/notifications/`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Notifications fetch error');
      return await res.json();
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  }

  static async getSellerProfile(): Promise<SellerProfile> {
    try {
      const res = await fetch(`${BASE_URL}/sellers/me/`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Seller fetch error');
      return await res.json();
    } catch {
      return MOCK_SELLER_PROFILE;
    }
  }
}
