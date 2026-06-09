/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface IStore {
  _id: string;

  owner: string;

  subscription?: string;

  currentSubscription?: string | null | IPopulatedSubscription;

  storeName: string;

  slug: string;

  subdomain: string;

  customDomain?: string;

  businessType: string;

  logo?: string;

  banner?: string;

  email?: string;

  phone?: string;

  address?: string;

  description?: string;

  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";

  totalProducts: number;

  totalOrders: number;

  totalCustomers: number;

  totalRevenue: number;

  isVerified: boolean;

  isDeleted: boolean;

  lastActivityAt?: string;

  createdAt: string;

  updatedAt: string;
}

export interface IPopulatedSubscription {
  _id: string;
  plan?: {
    _id: string;
    displayName: string;
    monthlyPrice: number;
  };
  status?: string;
  currentPeriodEnd?: string;
  endDate?: string;
  startDate?: string;
}

interface GetAllStoresResponse {
  success: boolean;
  data: IStore[];
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
}

export const storeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStore: builder.mutation<IResponse<IStore>, FormData>({
      query: (data) => ({
        url: "/stores/create-store",
        method: "POST",
        data,
      }),
      invalidatesTags: ["STORES", "SUBSCRIPTIONS"],
    }),

    updateStore: builder.mutation<
      IResponse<IStore>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/stores/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "STORES",
        { type: "STORE", id },
      ],
    }),

    activateStore: builder.mutation<IResponse<IStore>, string>({
      query: (id) => ({
        url: `/stores/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["STORES", { type: "STORE", id }],
    }),

    suspendStore: builder.mutation<IResponse<IStore>, string>({
      query: (id) => ({
        url: `/stores/${id}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["STORES", { type: "STORE", id }],
    }),

    deleteStore: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["STORES", { type: "STORE", id }],
    }),

    getSingleStore: builder.query<IResponse<IStore>, string>({
      query: (id) => ({
        url: `/stores/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "STORE", id }],
    }),

    getAllStores: builder.query<GetAllStoresResponse, Record<string, any>>({
      query: (params) => ({
        url: "/stores",
        method: "GET",
        params,
      }),
      providesTags: ["STORES"],
    }),

    getMyStore: builder.query<IResponse<IStore>, void>({
      query: () => ({
        url: "/stores/my-store",
        method: "GET",
      }),
      providesTags: ["STORES"],
    }),

    getStoreAnalytics: builder.query<IResponse<any>, void>({
      query: () => ({
        url: "/stores/analytics",
        method: "GET",
      }),
      providesTags: ["STORES"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useActivateStoreMutation,
  useSuspendStoreMutation,
  useDeleteStoreMutation,
  useGetSingleStoreQuery,
  useGetAllStoresQuery,
  useGetMyStoreQuery,
  useGetStoreAnalyticsQuery,
} = storeApi;
