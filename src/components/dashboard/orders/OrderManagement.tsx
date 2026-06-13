/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ErrorState } from "@/components/dashboard/shared/ErrorState";
import {
  useGetMyOrdersQuery,
  useGetOrderAnalyticsQuery,
  useConfirmOrderMutation,
  useProcessOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useRefundOrderMutation,
} from "@/redux/features/Order/order.api";
import { OrderOverviewCards } from "./OrderOverviewCards";
import { OrderFilters } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { CreateOrderDialog } from "./CreateOrderDialog";
import { UpdateOrderDialog } from "./UpdateOrderDialog";
import { MarkAsPaidDialog } from "./MarkAsPaidDialog";
import { DeleteOrderDialog } from "./DeleteOrderDialog";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { ORDER_PAGINATION_LIMIT } from "@/lib/constants/order.constants";
import type { IOrder, OrderStatus, PaymentStatus } from "@/types/order.types";

export function OrderManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // RTK Query hooks
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
    error: ordersErrorObj,
  } = useGetMyOrdersQuery({searchTerm: search});

  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetOrderAnalyticsQuery({});

  const [confirmOrder] = useConfirmOrderMutation();
  const [processOrder] = useProcessOrderMutation();
  const [shipOrder] = useShipOrderMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();
  const [refundOrder] = useRefundOrderMutation();

  const orders = useMemo(() => {
    return ordersData?.data || [];
  }, [ordersData]);

  const totalPages = useMemo(() => {
    return ordersData?.pagination?.pages || 1;
  }, [ordersData]);

  const handleView = (order: IOrder) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (order: IOrder) => {
    setSelectedOrder(order);
    setUpdateDialogOpen(true);
  };

  const handleDelete = (order: IOrder) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleMarkAsPaid = (order: IOrder) => {
    setSelectedOrder(order);
    setMarkAsPaidDialogOpen(true);
  };

  const createMutationHandler =
    (mutation: any, orderId: string) => async () => {
      setActionLoading((prev) => ({ ...prev, [orderId]: true }));
      try {
        await mutation(orderId).unwrap();
      } catch (err) {
        console.error("Failed to perform action:", err);
      } finally {
        setActionLoading((prev) => ({ ...prev, [orderId]: false }));
      }
    };

  if (ordersError) {
    return (
      <ErrorState
        title="Failed to load orders"
        description={
          ordersErrorObj instanceof Error
            ? ordersErrorObj.message
            : "An error occurred while loading orders. Please try again."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Orders"
          description="Manage your store orders, track shipments, and process payments"
          breadcrumbs={[{ label: "Orders", href: "/orders" }]}
        />
        {/* <Button
          onClick={() => setCreateDialogOpen(true)}
          className="hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button> */}
      </div>

      <OrderOverviewCards
        analytics={analyticsData?.data || null}
        isLoading={analyticsLoading}
      />

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6">
          <OrderFilters
            search={search}
            onSearchChange={setSearch}
            orderStatus={orderStatus}
            onOrderStatusChange={setOrderStatus}
            paymentStatus={paymentStatus}
            onPaymentStatusChange={setPaymentStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isLoading={ordersLoading}
          />
        </div>

        <OrderTable
          orders={orders}
          isLoading={ordersLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirm={createMutationHandler(confirmOrder, "")}
          onProcess={createMutationHandler(processOrder, "")}
          onShip={createMutationHandler(shipOrder, "")}
          onDeliver={createMutationHandler(deliverOrder, "")}
          onCancel={createMutationHandler(cancelOrder, "")}
          onReturn={createMutationHandler(returnOrder, "")}
          onMarkAsPaid={handleMarkAsPaid}
          onRefund={createMutationHandler(refundOrder, "")}
          actionLoading={actionLoading}
        />
      </div>

      <CreateOrderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <UpdateOrderDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        order={selectedOrder}
      />
      <MarkAsPaidDialog
        open={markAsPaidDialogOpen}
        onOpenChange={setMarkAsPaidDialogOpen}
        order={selectedOrder}
      />
      <DeleteOrderDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        order={selectedOrder}
      />
      <OrderDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        order={selectedOrder}
        isLoading={false}
      />
    </div>
  );
}
