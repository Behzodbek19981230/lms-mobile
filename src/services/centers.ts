import { http } from './http';

export type CenterLite = {
  id: number;
  name: string;
  isActive?: boolean;
  [key: string]: any;
};

export type CenterStats = {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  monthlyRevenue: number;
  activeClasses: number;
};

export async function getCenters(): Promise<CenterLite[]> {
  const res = await http.get<CenterLite[]>('/centers');
  return Array.isArray(res.data) ? res.data : [];
}

export async function getCenterStats(centerId: number): Promise<CenterStats> {
  const res = await http.get<CenterStats>(`/centers/${centerId}/stats`);
  return res.data as CenterStats;
}
