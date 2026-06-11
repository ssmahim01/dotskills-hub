/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface ICategory {
  _id: string;
  store: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  status: "ACTIVE" | "INACTIVE";
  totalProducts: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<IResponse<ICategory>, FormData>({
      query: (data) => ({
        url: "/categories/create-category",
        method: "POST",
        data,
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    updateCategory: builder.mutation<
      IResponse<ICategory>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    deleteCategory: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    activateCategory: builder.mutation<IResponse<ICategory>, string>({
      query: (id) => ({
        url: `/categories/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    inactivateCategory: builder.mutation<IResponse<ICategory>, string>({
      query: (id) => ({
        url: `/categories/${id}/inactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["CATEGORIES"],
    }),

    getAllCategories: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      providesTags: ["CATEGORIES"],
    }),
    getMyCategories: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/categories/my-categories",
        method: "GET",
        params,
      }),
      providesTags: ["CATEGORIES"],
    }),

    getCategoriesByStore: builder.query<IResponse<ICategory[]>, string>({
      query: (storeId) => ({
        url: `/categories/store/${storeId}`,
        method: "GET",
      }),
      providesTags: ["CATEGORIES"],
    }),

    getSingleCategory: builder.query<IResponse<ICategory>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["CATEGORIES"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useActivateCategoryMutation,
  useGetMyCategoriesQuery,
  useInactivateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoriesByStoreQuery,
  useGetSingleCategoryQuery,
} = categoryApi;
