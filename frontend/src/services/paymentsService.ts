import { ApiService } from './api';

export class PaymentsService {
  private static endpoint = '/api/payments/';

  static async getPaymentsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Payments API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local payments dataset:', err);
      return { status: 'OK', app: 'payments' };
    }
  }

  static async executePaymentsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
