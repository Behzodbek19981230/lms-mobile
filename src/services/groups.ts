import { http } from './http';
import type { Group, GroupStudent } from '../types/group';

export type UpdateGroupPayload = {
  name?: string;
  description?: string;
  subjectId?: number;
  teacherId?: number;
  studentIds?: number[];
  daysOfWeek?: string[];
  startTime?: string;
  endTime?: string;
};

export async function getMyGroups(): Promise<Group[]> {
  const res = await http.get<Group[]>('/groups/me');
  return res.data;
}

export async function getGroupStudents(groupId: number): Promise<GroupStudent[]> {
  const res = await http.get<GroupStudent[]>(`/groups/${groupId}/students`);
  return res.data;
}

export async function updateGroup(groupId: number, payload: UpdateGroupPayload): Promise<Group> {
  const res = await http.patch<Group>(`/groups/${groupId}`, payload);
  return res.data;
}
