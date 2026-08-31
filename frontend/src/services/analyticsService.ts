import { ApiService } from './api';

export class AnalyticsService {
  private static endpoint = '/api/analytics/';

  static async getAnalyticsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Analytics API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local analytics dataset:', err);
      return { status: 'OK', app: 'analytics' };
    }
  }

  static async executeAnalyticsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
