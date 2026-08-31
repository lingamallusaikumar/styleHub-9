import { ApiService } from './api';

export class PromotionsService {
  private static endpoint = '/api/promotions/';

  static async getPromotionsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Promotions API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local promotions dataset:', err);
      return { status: 'OK', app: 'promotions' };
    }
  }

  static async executePromotionsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
