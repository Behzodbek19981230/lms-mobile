export type UserRole =
  | 'SUPERADMIN'
  | 'ADMIN'
  | 'TEACHER'
  | 'STUDENT'
  | string;

export type AuthUser = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  hasCenterAssigned?: boolean;
  needsCenterAssignment?: boolean;
  center?: {
    id: number;
    name: string;
    permissions?: Record<string, boolean>;
  } | null;
};

export type AuthResponse = {
  access_token: string;
  user: AuthUser;
};

export type LoginPayload = {
  username: string;
  password: string;
};
