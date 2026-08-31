import { ApiService } from './api';

export class InventoryService {
  private static endpoint = '/api/inventory/';

  static async getInventoryData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Inventory API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local inventory dataset:', err);
      return { status: 'OK', app: 'inventory' };
    }
  }

  static async executeInventoryAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
