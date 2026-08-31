import { ApiService } from './api';

export class AuditService {
  private static endpoint = '/api/audit/';

  static async getAuditData(): Promise<any> {
    try {
      const res = await fetch(`http://127.0.0.1:8000${this.endpoint}`);
      if (!res.ok) throw new Error('Audit API response error');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to local audit dataset:', err);
      return { status: 'OK', app: 'audit' };
    }
  }

  static async executeAuditAction(payload: any): Promise<any> {
    return { success: true, payload, timestamp: new Date().toISOString() };
  }
}
