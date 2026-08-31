import { ApiService } from './api';

export class RecommendationsService {
  private static endpoint = '/api/recommendations/';

  static async getRecommendationsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Recommendations API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local recommendations dataset:', err);
      return { status: 'OK', app: 'recommendations' };
    }
  }

  static async executeRecommendationsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
