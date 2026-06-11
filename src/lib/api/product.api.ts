import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Product,
  ProductsListResponse,
  CreateProductPayload,
  UpdateProductPayload,
  ProductQueryParams,
  ProductOverviewStats,
} from '@/types/product.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/products`,
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    // Get product overview stats
    getProductStats: builder.query<ProductOverviewStats, void>({
      query: () => '/stats',
      providesTags: ['Product'],
    }),

    // Get paginated products list
    getProductsList: builder.query<ProductsListResponse, ProductQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', String(params.page));
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.search) searchParams.append('search', params.search);
        if (params.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params.status && params.status !== 'all') searchParams.append('status', params.status);
        if (params.featured !== undefined && params.featured !== 'all') {
          searchParams.append('featured', String(params.featured));
        }
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.order) searchParams.append('order', params.order);
        return `?${searchParams.toString()}`;
      },
      providesTags: ['Product'],
    }),

    // Get single product by ID
    getProduct: builder.query<Product, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Create new product
    createProduct: builder.mutation<Product, CreateProductPayload>({
      query: (payload) => ({
        url: '/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Product'],
    }),

    // Update product
    updateProduct: builder.mutation<Product, { id: string; payload: UpdateProductPayload }>({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),

    // Activate product
    activateProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, 'Product'],
    }),

    // Archive product
    archiveProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, 'Product'],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, 'Product'],
    }),
  }),
});

export const {
  useGetProductStatsQuery,
  useGetProductsListQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useActivateProductMutation,
  useArchiveProductMutation,
  useDeleteProductMutation,
} = productApi;
