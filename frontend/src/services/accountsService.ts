import { ApiService } from './api';

export class AccountsService {
  private static endpoint = '/api/accounts/';

  static async getAccountsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Accounts API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local accounts dataset:', err);
      return { status: 'OK', app: 'accounts' };
    }
  }

  static async executeAccountsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
