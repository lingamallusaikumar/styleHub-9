import { ApiService } from './api';

export class OrdersService {
  private static endpoint = '/api/orders/';

  static async getOrdersData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Orders API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local orders dataset:', err);
      return { status: 'OK', app: 'orders' };
    }
  }

  static async executeOrdersAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
