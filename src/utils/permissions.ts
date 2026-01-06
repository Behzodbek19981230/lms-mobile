export type CenterPermissionKey =
  | 'tests'
  | 'exams'
  | 'test_generation'
  | 'checking'
  | 'telegram_integration'
  | 'attendance'
  | 'attendance_telegram_notifications'
  | 'tasks'
  | 'tasks_telegram_notifications'
  | 'payments'
  | 'payments_telegram_notifications'
  | 'reports_students'
  | 'reports_tests'
  | 'reports_attendance'
  | 'reports_payments';

export function hasCenterPermission(
  centerPermissions: Record<string, boolean> | undefined | null,
  key: CenterPermissionKey,
): boolean {
  // If permissions not loaded yet, default allow to avoid breaking old centers.
  if (!centerPermissions) return true;
  return centerPermissions[key] !== false;
}
