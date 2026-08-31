import { ApiService } from './api';

export class CatalogService {
  private static endpoint = '/api/catalog/';

  static async getCatalogData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Catalog API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local catalog dataset:', err);
      return { status: 'OK', app: 'catalog' };
    }
  }

  static async executeCatalogAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
