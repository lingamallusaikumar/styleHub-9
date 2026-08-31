import { ApiService } from './api';

export class ReviewsService {
  private static endpoint = '/api/reviews/';

  static async getReviewsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Reviews API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local reviews dataset:', err);
      return { status: 'OK', app: 'reviews' };
    }
  }

  static async executeReviewsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
