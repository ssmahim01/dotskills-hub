import { UserRole } from "./auth.types";
import { UserStatus } from "./auth.types";

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  storeId?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  status?: UserStatus;
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
