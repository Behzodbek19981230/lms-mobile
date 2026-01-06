import type { UserRole } from './auth';

export type UserLite = {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  role: UserRole;
};
