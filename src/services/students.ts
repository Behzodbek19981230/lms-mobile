import { http } from './http';

export type StudentDashboardStats = {
  enrolledCourses: number;
  completedExams: number;
  totalExams: number;
  completedTests: number;
  totalTests: number;
  averageScore: number;
  upcomingExams: number;
  totalGroups: number;
};

export type StudentDashboardData = {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    center: string | null;
  };
  stats: StudentDashboardStats;
  groups: any[];
};

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const res = await http.get<StudentDashboardData>('/students/dashboard');
  return res.data as StudentDashboardData;
}
