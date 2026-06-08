export * from "./pos";
export type { Order, OrderStatus, DeliveryStatus } from "../types/orders";
export type { CourierProvider } from "../types/courier";
export type { GetQueryParams } from "../types/orders";

export interface IIngredient {
  name: string;
  price: number;
}

export type GetQueryParams = {
  searchTerm?: string;
  sort?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
};

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  paymentMethod?: string;
  status?: string;
}

export type { ILogin, IRegister } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export enum Role {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
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

export interface IUserApiResponse {
  data: IUser;
}
