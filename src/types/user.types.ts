import { IsActive } from ".";
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

export enum Role {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address: string;
  status?: string;
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}