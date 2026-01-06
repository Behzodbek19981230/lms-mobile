import { http } from './http';

export type TestStats = {
  totalTests: number;
  draftTests: number;
  publishedTests: number;
  archivedTests: number;
  openTests: number;
  closedTests: number;
  mixedTests: number;
  totalQuestions: number;
  averageQuestionsPerTest: number;
  testsBySubject: Record<string, number>;
};

export async function getTestStats(): Promise<TestStats> {
  const res = await http.get<TestStats>('/tests/stats');
  return res.data as TestStats;
}
