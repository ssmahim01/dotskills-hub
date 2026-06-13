"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/redux/features/Order/order.api";
import { useCreateCustomerMutation } from "@/redux/features/Customer/customer.api";
import type { POSCartItem, CheckoutPayload } from "@/types/pos.types";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

export function usePOSCheckout(onSuccess: () => void) {
  const router = useRouter();
  const { data: myStore } = useGetMyStoreQuery();
  const myStoreId = myStore?.data?._id;
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [createCustomer, { isLoading: isCreatingCustomer }] =
    useCreateCustomerMutation();

  const isLoading = isCreatingOrder || isCreatingCustomer;

  const placeOrder = useCallback(
    async (items: POSCartItem[], payload: CheckoutPayload) => {
      try {
        // 1. Validate cart
        if (items.length === 0) {
          toast.error("Cart is empty");
          return;
        }

        // 2. Validate schedule
        // if (
        //   payload.schedule.type === "SCHEDULED" &&
        //   !payload.schedule.scheduledAt
        // ) {
        //   toast.error("Please select a scheduled date & time");
        //   return;
        // }

        // 3. Create customer if guest (no selectedCustomer)
        let customerId: string | undefined = payload.selectedCustomer?._id;

        if (!customerId) {
          try {
            const res = await createCustomer({
              name: payload.customer.name,
              phone: payload.customer.phone,
              email: payload.customer.email || undefined,
              address: payload.customer.address || undefined,
            }).unwrap();
            customerId = res.data?._id;
          } catch {
            // Customer creation optional — continue without it
          }
        }

        // 4. Build order payload matching backend contract
        const orderPayload = {
          store: myStoreId,

          customerName: payload.customer.name,
          customerPhone: payload.customer.phone,
          customerEmail: payload.customer.email || "",
          customerAddress: payload.customer.address || "",
          notes: payload.notes || "",

          paymentMethod:
            payload.paymentMethod === "CASH" ? "COD" : payload.paymentMethod,
          advanceAmount: payload.advance.amount,

          deliveryCharge: payload.summary.deliveryCharge,
          discountAmount: payload.summary.discountAmount,

          paidAmount: payload.advance.amount,

          items: items.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        };

        // if (customerId) orderPayload.customer = customerId;

        await createOrder(orderPayload).unwrap();

        // if (payload.schedule.type === "SCHEDULED") {
        //   toast.success(
        //     `Order scheduled for ${new Date(payload.schedule.scheduledAt ?? "").toLocaleString()}`,
        //   );
        // } else {
        //   toast.success("Order placed successfully!");
        //   router.push("/dashboard/orders");
        // }

        toast.success("Order placed successfully!");
        router.push("/dashboard/orders");

        onSuccess();
      } catch (err: unknown) {
        toast.error(
          (err as { data?: { message?: string } })?.data?.message ??
            "Failed to place order",
        );
      }
    },
    [createOrder, createCustomer, router, onSuccess, myStoreId],
  );

  return { placeOrder, isLoading };
}
