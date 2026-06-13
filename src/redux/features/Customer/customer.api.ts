/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface ICustomer {
  _id: string;
  store: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  isVIP: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation<IResponse<ICustomer>, any>({
      query: (data) => ({
        url: "/customers/create-customer",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    updateCustomer: builder.mutation<
      IResponse<ICustomer>,
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    activateCustomer: builder.mutation<IResponse<ICustomer>, string>({
      query: (id) => ({
        url: `/customers/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    blockCustomer: builder.mutation<IResponse<ICustomer>, string>({
      query: (id) => ({
        url: `/customers/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    markCustomerAsVIP: builder.mutation<IResponse<ICustomer>, string>({
      query: (id) => ({
        url: `/customers/${id}/vip`,
        method: "PATCH",
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    deleteCustomer: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CUSTOMERS"],
    }),

    getAllCustomers: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params,
      }),
      providesTags: ["CUSTOMERS"],
    }),
    getMyCustomers: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/customers/my-customers",
        method: "GET",
        params,
      }),
      providesTags: ["CUSTOMERS"],
    }),

    getCustomersByStore: builder.query<
      IResponse<ICustomer[]>,
      string
    >({
      query: (storeId) => ({
        url: `/customers/store/${storeId}`,
        method: "GET",
      }),
      providesTags: ["CUSTOMERS"],
    }),

    getSingleCustomer: builder.query<IResponse<ICustomer>, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
      providesTags: ["CUSTOMERS"],
    }),

    getCustomerAnalytics: builder.query<IResponse<any>, void>({
      query: () => ({
        url: "/customers/analytics",
      }),
      providesTags: ["CUSTOMERS"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useActivateCustomerMutation,
  useBlockCustomerMutation,
  useMarkCustomerAsVIPMutation,
  useDeleteCustomerMutation,
  useGetMyCustomersQuery,
  useGetAllCustomersQuery,
  useGetCustomersByStoreQuery,
  useGetSingleCustomerQuery,
  useGetCustomerAnalyticsQuery,
} = customerApi;