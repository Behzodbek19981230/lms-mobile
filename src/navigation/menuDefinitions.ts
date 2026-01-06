import type { AppStackParamList } from './AppStackParamList';

export type MenuItem = {
  title: string;
  url: string;
  screen: keyof AppStackParamList;
};

export const superAdminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/account/superadmin', screen: 'SuperAdminHome' },
  { title: 'Mening fanlarim', url: '/account/subjects', screen: 'Subjects' },
  { title: 'Markazlar va foydalanuvchilar', url: '/account/center-users', screen: 'CenterUsers' },
  { title: 'Telegram Management', url: '/account/telegram', screen: 'TelegramManagement' },
  { title: 'Analytics', url: '/account/analytics', screen: 'Analytics' },
  { title: 'Logs', url: '/account/logs', screen: 'Logs' },
];

export const centerAdminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/account/admin', screen: 'AdminHome' },
  { title: "O'quvchilarim", url: '/account/students', screen: 'Students' },
  { title: "O'qituvchilarim", url: '/account/teachers', screen: 'Teachers' },
  { title: 'Guruhlar', url: '/account/groups', screen: 'MyGroups' },
  { title: 'Natijalar', url: '/account/results', screen: 'Results' },
  { title: "To'lovlar", url: '/account/payments', screen: 'Payments' },
  { title: 'Mening fanlarim', url: '/account/subjects', screen: 'Subjects' },
  { title: 'Telegram Management', url: '/account/telegram', screen: 'TelegramManagement' },
  { title: "Foydalanish qo'llanmasi", url: '/account/guide', screen: 'Guide' },
];

export const teacherMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/account/teacher', screen: 'TeacherHome' },
  { title: 'Imtihonlar', url: '/account/exams', screen: 'Exams' },
  { title: 'Mening guruhlarim', url: '/account/groups', screen: 'MyGroups' },
  { title: 'Davomat', url: '/account/attendance', screen: 'Attendance' },
  { title: 'Vazifalar', url: '/account/tasks', screen: 'Tasks' },
  { title: 'Natijalar', url: '/account/results', screen: 'Results' },
  { title: 'Vazifalar tarixi', url: '/account/tasks/history', screen: 'TasksHistory' },
  { title: "To'lovlar", url: '/account/payments', screen: 'Payments' },
  { title: 'Mening fanlarim', url: '/account/subjects', screen: 'Subjects' },
  { title: 'Test generatsiya', url: '/account/test-generator', screen: 'TestGenerator' },
  { title: 'Yaratilgan testlar', url: '/account/generated-tests', screen: 'GeneratedTests' },
  { title: 'Skaner', url: '/account/scanner', screen: 'Scanner' },
  { title: 'Telegram Management', url: '/account/telegram', screen: 'TelegramManagement' },
];

export const studentMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/account/student', screen: 'StudentHome' },
  { title: "Mening to'lovlarim", url: '/account/student-payments', screen: 'StudentPayments' },
  { title: 'Mening fanlarim', url: '/account/subjects', screen: 'Subjects' },
  { title: 'Telegram', url: '/account/telegram-user', screen: 'TelegramUser' },
];
