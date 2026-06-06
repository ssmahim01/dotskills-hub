export interface IRegister {
    name: string
    email: string
    password: string,
    address: string,
    phone: string
}

export interface ILogin {
    email: string,
    password: string
}

export interface IRegisterResponse {
    _id: string
    name: string
    email: string
    password: string
    role: string
    isDeleted: boolean
    isActive: string
    isVerified: boolean
    salary?: number;
    createdAt?: string
    updatedAt?: string
}

export type UserRole = 'super-admin' | 'store-owner';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
}

export interface AuthSession {
  userId: string;
  user: User;
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}