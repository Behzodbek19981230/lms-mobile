import { http } from './http';
import type { BulkAttendancePayload } from '../types/attendance';

export async function getTodayPresentStudents(groupId: number): Promise<Array<{ id: number }>> {
  const res = await http.get<Array<{ id: number }>>(`/attendance/present/today/${groupId}`);
  return res.data;
}

export async function submitBulkAttendance(payload: BulkAttendancePayload): Promise<any> {
  const res = await http.post('/attendance/bulk', payload);
  return res.data;
}
