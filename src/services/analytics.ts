import { http } from './http';

export async function getAnalyticsSummary(days?: number): Promise<any> {
  const res = await http.get('/analytics/admin/summary', {
    params: days ? { days } : undefined,
  });
  return res.data;
}

export async function getAnalyticsRecent(limit?: number): Promise<any[]> {
  const res = await http.get<any[]>('/analytics/admin/recent', {
    params: limit ? { limit } : undefined,
  });
  return Array.isArray(res.data) ? res.data : [];
}
