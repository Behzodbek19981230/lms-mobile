import { http } from './http';
import type { Subject } from '../types/subject';

export type SubjectStats = {
  totalSubjects: number;
  activeSubjects: number;
  subjectsWithFormulas: number;
  totalTests: number;
  subjectsByCategory: Record<string, number>;
};

export async function getSubjects(): Promise<Subject[]> {
  const res = await http.get<Subject[]>('/subjects');
  return res.data;
}

export async function getSubjectStats(): Promise<SubjectStats> {
  const res = await http.get<SubjectStats>('/subjects/stats');
  return res.data as SubjectStats;
}
