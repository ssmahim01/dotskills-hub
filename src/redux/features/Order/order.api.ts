import { baseApi } from "../baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create-order",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    confirmOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    processOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/process`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    shipOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}/ship`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/deliver`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    returnOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/return`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    markAsPaid: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}/pay`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["ORDERS"],
    }),

    refundOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/refund`,
        method: "PATCH",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ORDERS"],
    }),

    getAllOrders: builder.query({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),
    
    getMyOrders: builder.query({
      query: (params) => ({
        url: "/orders/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["ORDERS"],
    }),

    getOrdersByStore: builder.query({
      query: (storeId) => ({
        url: `/orders/store/${storeId}`,
        method: "GET",
      }),
      providesTags: ["ORDERS"],
    }),

    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: ["ORDERS"],
    }),

    getOrderAnalytics: builder.query({
      query: () => ({
        url: "/orders/analytics",
      }),
      providesTags: ["ORDERS"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useConfirmOrderMutation,
  useGetMyOrdersQuery,
  useProcessOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useMarkAsPaidMutation,
  useRefundOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useGetOrdersByStoreQuery,
  useGetSingleOrderQuery,
  useGetOrderAnalyticsQuery,
} = orderApi;
