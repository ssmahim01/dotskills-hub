/* eslint-disable @typescript-eslint/no-explicit-any */

import { IRegisterResponse } from "@/types/auth.types";
import { baseApi } from "../baseApi";
import type {
  IUser,
  IUserApiResponse,
  IResponse,
  GetQueryParams,
} from "@/types";

interface GetAllUsersResponse {
  success: boolean;
  data: IUser[];
  meta: {
    total: number;
    totalPage: number;

    totalStaffs: number;
    totalFixedSalary: number;
    totalSalaryByProduct: number;
    totalSalary: number;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IRegisterResponse>, FormData>({
      query: (formData) => ({
        url: "/user/create-user",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: () => ["USERS"],
    }),

    updateUser: builder.mutation<
      IResponse<IUser>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    deleteUser: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    getSingleUser: builder.query<IUserApiResponse, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "USER", id }],
    }),

    getAllUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params,
      }),
      providesTags: ["USERS"],
    }),

    getMe: builder.query<IUserApiResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),

      providesTags: ["ME", "USER"],
    }),

    getAllTrashUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-trash-users",
        method: "GET",
        params,
      }),
      providesTags: ["USERS"],
    }),

    trashUpdateUser: builder.mutation<IResponse<any>, { _id: string }>({
      query: ({ _id }) => ({
        url: `/user/user-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => [
        "USERS",
        { type: "USER", _id },
      ],
    }),

  
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetAllUsersQuery,
  useGetMeQuery,
  useGetAllTrashUsersQuery,
  useTrashUpdateUserMutation,
} = userApi;