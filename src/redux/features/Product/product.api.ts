/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import { IResponse } from "@/types";

export interface IProduct {
  _id: string;
  store?: string;
  category: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  images: string[];
  price: number;
  discountPrice: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: string;
  isFeatured: boolean;
  totalSold: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation<IResponse<IProduct>, FormData>({
      query: (formData) => ({
        url: "/products/create-product",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),

    updateProduct: builder.mutation<
      IResponse<IProduct>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["PRODUCTS"],
    }),

    deleteProduct: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),

    activateProduct: builder.mutation<IResponse<IProduct>, string>({
      query: (id) => ({
        url: `/products/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),

    archiveProduct: builder.mutation<IResponse<IProduct>, string>({
      query: (id) => ({
        url: `/products/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),

    getAllProducts: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["PRODUCTS"],
    }),

    getProductsByStore: builder.query<IResponse<IProduct[]>, string>({
      query: (storeId) => ({
        url: `/products/store/${storeId}`,
        method: "GET",
      }),
      providesTags: ["PRODUCTS"],
    }),
    getMyProducts: builder.query<any, Record<string, any>>({
      query: (params) => ({
        url: `/products/my-products`,
        method: "GET",
        params,
      }),
      providesTags: ["PRODUCTS"],
    }),

    getSingleProduct: builder.query<IResponse<IProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["PRODUCTS"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useActivateProductMutation,
  useGetMyProductsQuery,
  useArchiveProductMutation,
  useGetAllProductsQuery,
  useGetProductsByStoreQuery,
  useGetSingleProductQuery,
} = productApi;
