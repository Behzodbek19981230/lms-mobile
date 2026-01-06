import { http } from './http';
import type { UserLite } from '../types/user';

export async function getUsersByRole(role: string): Promise<UserLite[]> {
  const res = await http.get<UserLite[]>('/users', { params: { role } });
  return res.data;
}
