export type GroupStudent = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
};

export type Group = {
  id: number;
  name: string;
  description?: string;
  subjectId?: number | null;
  teacherId: number;
  studentIds: number[];
  students: GroupStudent[];
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
};
