import { http } from './http';

export type LogItem = {
  id?: number;
  level?: string;
  message?: string;
  context?: string;
  createdAt?: string;
  [key: string]: any;
};

export async function getLogs(params?: {
  limit?: number;
  offset?: number;
  level?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  context?: string;
}): Promise<LogItem[]> {
  const res = await http.get<LogItem[]>('/logs', { params });
  return Array.isArray(res.data) ? res.data : [];
}
