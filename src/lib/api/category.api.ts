import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Category,
  CategoriesListResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryQueryParams,
  CategoryOverviewStats,
} from '@/types/category.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/categories`,
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // Get category overview stats
    getCategoryStats: builder.query<CategoryOverviewStats, void>({
      query: () => '/stats',
      providesTags: ['Category'],
    }),

    // Get paginated categories list
    getCategoriesList: builder.query<CategoriesListResponse, CategoryQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', String(params.page));
        if (params.limit) searchParams.append('limit', String(params.limit));
        if (params.search) searchParams.append('search', params.search);
        if (params.status && params.status !== 'all') searchParams.append('status', params.status);
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.order) searchParams.append('order', params.order);
        return `?${searchParams.toString()}`;
      },
      providesTags: ['Category'],
    }),

    // Get single category by ID
    getCategory: builder.query<Category, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // Create new category
    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (payload) => ({
        url: '/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Category'],
    }),

    // Update category
    updateCategory: builder.mutation<Category, { id: string; payload: UpdateCategoryPayload }>({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

    // Activate category
    activateCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }, 'Category'],
    }),

    // Inactivate category
    inactivateCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/${id}/inactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }, 'Category'],
    }),

    // Delete category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }, 'Category'],
    }),
  }),
});

export const {
  useGetCategoryStatsQuery,
  useGetCategoriesListQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useInactivateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
