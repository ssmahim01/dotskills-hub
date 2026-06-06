/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface IPlan {
  _id: string;
  name: string;
  slug: string;
  displayName: string;
  description: string;

  monthlyPrice: number;
  yearlyPrice?: number;

  billingCycle: string;

  features: {
    title: string;
  }[];

  maxProducts: number;
  storageGB: number;
  monthlyRequests: number;
  maxUsers: number;

  sortOrder: number;

  isPopular: boolean;

  status: string;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

interface GetAllPlansResponse {
  success: boolean;
  data: IPlan[];
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
}

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPlan: builder.mutation<
      IResponse<IPlan>,
      Partial<IPlan>
    >({
      query: (data) => ({
        url: "/plans/create-plan",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PLANS"],
    }),

    updatePlan: builder.mutation<
      IResponse<IPlan>,
      {
        id: string;
        data: Partial<IPlan>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "PLANS",
        { type: "PLAN", id },
      ],
    }),

    deletePlan: builder.mutation<
      IResponse<null>,
      string
    >({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "PLANS",
        { type: "PLAN", id },
      ],
    }),

    getSinglePlan: builder.query<
      IResponse<IPlan>,
      string
    >({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "PLAN", id },
      ],
    }),

    getAllPlans: builder.query<
      GetAllPlansResponse,
      Record<string, any>
    >({
      query: (params) => ({
        url: "/plans",
        method: "GET",
        params,
      }),
      providesTags: ["PLANS"],
    }),

    getPublicPlans: builder.query<
      IResponse<IPlan[]>,
      void
    >({
      query: () => ({
        url: "/plans/public",
        method: "GET",
      }),
      providesTags: ["PLANS"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetSinglePlanQuery,
  useGetAllPlansQuery,
  useGetPublicPlansQuery,
} = planApi;