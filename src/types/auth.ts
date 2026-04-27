export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface AuthUser {
  email: string;
  role: UserRole;
  status: UserStatus;
}