export type AppStackParamList = {
  // role dashboards
  TeacherHome: undefined;
  AdminHome: undefined;
  SuperAdminHome: undefined;
  StudentHome: undefined;

  // common
  Profile: undefined;

  // groups
  MyGroups: undefined;
  EditGroup: { groupId: number };

  // teacher/admin
  Payments: undefined;
  Attendance: undefined;
  Tasks: { groupId?: number; date?: string } | undefined;
  TasksHistory: undefined;

  // admin
  Students: undefined;
  Teachers: undefined;
  Guide: undefined;

  // common lists
  Subjects: undefined;
  Results: undefined;

  // telegram
  TelegramManagement: undefined;
  TelegramUser: undefined;

  // teacher-only (mobile placeholder for now)
  Exams: undefined;
  TestGenerator: undefined;
  GeneratedTests: undefined;
  Scanner: undefined;

  // student-only (mobile placeholder for now)
  StudentPayments: undefined;

  // superadmin
  CenterUsers: undefined;
  Analytics: undefined;
  Logs: undefined;
};
