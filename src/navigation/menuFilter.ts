import { hasCenterPermission } from '../utils/permissions';
import type { MenuItem } from './menuDefinitions';

export function filterMenuItemsByCenterPermissions(
  items: MenuItem[],
  opts: {
    isSuperAdmin: boolean;
    centerPermissions: Record<string, boolean> | undefined | null;
  },
): MenuItem[] {
  const { isSuperAdmin, centerPermissions } = opts;
  if (isSuperAdmin) return items;

  return items.filter(item => {
    const url = item.url || '';

    if (url.startsWith('/account/exams')) return hasCenterPermission(centerPermissions, 'exams');
    if (url.startsWith('/account/attendance')) return hasCenterPermission(centerPermissions, 'attendance');
    if (url.startsWith('/account/test-generator') || url.startsWith('/account/generated-tests'))
      return hasCenterPermission(centerPermissions, 'test_generation');
    if (url.startsWith('/account/scanner')) return hasCenterPermission(centerPermissions, 'checking');
    if (url.startsWith('/account/telegram')) return hasCenterPermission(centerPermissions, 'telegram_integration');
    if (url.startsWith('/account/tasks')) return hasCenterPermission(centerPermissions, 'tasks');
    if (url.startsWith('/account/payments') || url.startsWith('/account/student-payments'))
      return hasCenterPermission(centerPermissions, 'payments');
    if (url.startsWith('/account/results')) return hasCenterPermission(centerPermissions, 'reports_tests');

    return true;
  });
}
