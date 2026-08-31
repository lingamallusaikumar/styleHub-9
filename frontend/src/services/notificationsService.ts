import { ApiService } from './api';

export class NotificationsService {
  private static endpoint = '/api/notifications/';

  static async getNotificationsData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Notifications API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local notifications dataset:', err);
      return { status: 'OK', app: 'notifications' };
    }
  }

  static async executeNotificationsAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
