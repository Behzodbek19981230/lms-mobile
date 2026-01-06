import { http } from './http';
import type { Subject } from '../types/subject';

export async function getSubjects(): Promise<Subject[]> {
  const res = await http.get<Subject[]>('/subjects');
  return res.data;
}
