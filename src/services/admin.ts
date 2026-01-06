import { http } from './http';

export type SuperAdminDashboardStats = {
  totalCenters: number;
  totalUsers: number;
  monthlyRevenue: number;
  activeStudents: number;
};

export async function getSuperAdminDashboardStats(): Promise<SuperAdminDashboardStats> {
  const res = await http.get<SuperAdminDashboardStats>('/admin/dashboard-stats');
  return res.data as SuperAdminDashboardStats;
}
