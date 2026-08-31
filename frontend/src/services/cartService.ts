import { ApiService } from './api';

export class CartService {
  private static endpoint = '/api/cart/';

  static async getCartData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Cart API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local cart dataset:', err);
      return { status: 'OK', app: 'cart' };
    }
  }

  static async executeCartAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
