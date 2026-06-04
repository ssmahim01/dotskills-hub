import { UserRole, UserStatus } from './auth.types';

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  createdAt: string;
  lastLoginAt?: string;
  storeId?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  storeId?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  storeId?: string;
}
