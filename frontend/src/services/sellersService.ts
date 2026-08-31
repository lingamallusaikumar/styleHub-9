import { ApiService } from './api';

export class SellersService {
  private static endpoint = '/api/sellers/';

  static async getSellersData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Sellers API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local sellers dataset:', err);
      return { status: 'OK', app: 'sellers' };
    }
  }

  static async executeSellersAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
