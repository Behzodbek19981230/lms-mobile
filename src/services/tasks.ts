import { http } from './http';

export async function getNotDoneStudentIds(groupId: number, date: string): Promise<number[]> {
  const res = await http.get<number[]>(`/tasks/not-done/${groupId}`, {
    params: { date },
  });
  return Array.isArray(res.data) ? res.data : [];
}

export async function submitBulkTasks(payload: {
  groupId: number;
  date: string;
  notDoneStudentIds: number[];
}): Promise<any> {
  const res = await http.post('/tasks/bulk', payload);
  return res.data;
}

export async function getTasksHistory(
  groupId: number,
  limit = 60,
): Promise<Array<{ date: string; notDoneCount: number }>> {
  const res = await http.get<Array<{ date: string; notDoneCount: number }>>(
    `/tasks/history/${groupId}`,
    { params: { limit } },
  );
  return Array.isArray(res.data) ? res.data : [];
}
