/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface ISubscription {
  _id: string;

  user: string;

  store?: string;

  plan: string;

  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

  amount: number;

  durationInMonths: number;

  paymentMethod: string;

  transactionId: string;

  paymentProof?: string;

  ownerName: string;

  ownerEmail: string;

  ownerPhone: string;

  storeName: string;

  subdomain: string;

  customDomain?: string;

  approvedBy?: string;

  approvedAt?: string;

  rejectionReason?: string;

  startDate?: string;

  endDate?: string;

  isExpired: boolean;

  createdAt: string;

  updatedAt: string;
}

interface GetAllSubscriptionsResponse {
  success: boolean;
  data: ISubscription[];
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<IResponse<ISubscription>, FormData>({
      query: (formData) => ({
        url: "/subscriptions/create-subscription",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["SUBSCRIPTIONS"],
    }),

    approveSubscription: builder.mutation<IResponse<ISubscription>, string>({
      query: (id) => ({
        url: `/subscriptions/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "SUBSCRIPTIONS",
        "USERS",
        {
          type: "SUBSCRIPTION",
          id,
        },
      ],
    }),

    rejectSubscription: builder.mutation<
      IResponse<ISubscription>,
      {
        id: string;
        rejectionReason: string;
      }
    >({
      query: ({ id, rejectionReason }) => ({
        url: `/subscriptions/reject/${id}`,
        method: "PATCH",
        data: {
          rejectionReason,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        "SUBSCRIPTIONS",
        {
          type: "SUBSCRIPTION",
          id,
        },
      ],
    }),

    updateSubscription: builder.mutation<
      IResponse<ISubscription>,
      {
        id: string;
        data: Partial<ISubscription>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SUBSCRIPTIONS",
        {
          type: "SUBSCRIPTION",
          id,
        },
      ],
    }),

    getSingleSubscription: builder.query<IResponse<ISubscription>, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        {
          type: "SUBSCRIPTION",
          id,
        },
      ],
    }),

    getMySubscription: builder.query<IResponse<ISubscription>, void>({
      query: () => ({
        url: "/subscriptions/my-subscription",
        method: "GET",
      }),
      providesTags: ["SUBSCRIPTIONS"],
    }),

    getAllSubscriptions: builder.query<
      GetAllSubscriptionsResponse,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/subscriptions",
        method: "GET",
        params,
      }),
      providesTags: ["SUBSCRIPTIONS"],
    }),

    getApprovedOwners: builder.query<IResponse<any[]>, void>({
      query: () => ({
        url: "/subscriptions/approved-owners",
        method: "GET",
      }),
      providesTags: ["SUBSCRIPTIONS"],
    }),

    getSubscriptionAnalytics: builder.query<IResponse<any>, void>({
      query: () => ({
        url: "/subscriptions/analytics",
        method: "GET",
      }),
      providesTags: ["SUBSCRIPTIONS"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateSubscriptionMutation,
  useApproveSubscriptionMutation,
  useRejectSubscriptionMutation,
  useUpdateSubscriptionMutation,

  useGetSingleSubscriptionQuery,
  useGetMySubscriptionQuery,
  useGetAllSubscriptionsQuery,
  useGetApprovedOwnersQuery,
  useGetSubscriptionAnalyticsQuery,
} = subscriptionApi;
