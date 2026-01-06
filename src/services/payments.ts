import { http } from './http';
import type { TeacherPaymentsResponse } from '../types/payment';

export async function getTeacherPayments(): Promise<TeacherPaymentsResponse> {
  const res = await http.get<TeacherPaymentsResponse>('/payments/teacher');
  return res.data;
}
