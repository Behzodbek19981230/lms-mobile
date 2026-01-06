import { http } from './http';

export type CenterLite = {
  id: number;
  name: string;
  isActive?: boolean;
  [key: string]: any;
};

export async function getCenters(): Promise<CenterLite[]> {
  const res = await http.get<CenterLite[]>('/centers');
  return Array.isArray(res.data) ? res.data : [];
}
