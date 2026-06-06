import { baseApi } from "../baseApi";
import { IResponse, IUserApiResponse } from "@/types";
import { IRegister, IRegisterResponse } from "@/types/auth.types";

interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface IAdminChangePasswordPayload {
  userId: string;
  newPassword: string;
}

interface IChangePasswordResponse {
  message: string;
  success: boolean;
}
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IRegisterResponse>, IRegister>({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    userInfo: builder.query<IUserApiResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation<
      IChangePasswordResponse, 
      IChangePasswordPayload 
    >({
      query: (payload) => ({
        url: "/auth/change-password", 
        method: "POST",
        data: payload,
      }),
    }),

    adminChangePassword: builder.mutation<
      IChangePasswordResponse,
      IAdminChangePasswordPayload
    >({
      query: (payload) => ({
        url: "/auth/admin/change-password",
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useChangePasswordMutation,
  useAdminChangePasswordMutation,
} = authApi;
