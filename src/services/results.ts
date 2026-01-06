import { http } from './http';

export async function getResultsList(params?: {
  studentId?: number;
  uniqueNumber?: string;
  centerId?: number;
}): Promise<any[]> {
  const res = await http.get<any[]>('/tests/results-list', { params });
  return Array.isArray(res.data) ? res.data : (res.data as any);
}
