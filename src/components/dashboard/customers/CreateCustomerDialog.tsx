/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCustomerSchema,
  type CreateCustomerFormData,
} from "@/lib/schemas/customer.schema";
import { CUSTOMER_STATUS_OPTIONS } from "@/lib/constants/customer.constants";
import { useCreateCustomerMutation } from "@/redux/features/Customer/customer.api";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCustomerDialog({
  open,
  onOpenChange,
}: CreateCustomerDialogProps) {
  const [createCustomer, { isLoading, isError, error }] =
    useCreateCustomerMutation();
  const { data: myStore } = useGetMyStoreQuery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema as any),
    defaultValues: {
      status: "ACTIVE",
      isVIP: false,
    },
  });

  const status = watch("status");
  const isVIP = watch("isVIP");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      await createCustomer({
        ...data,
        store: myStore?.data?._id,
        email: data.email || undefined,
        address: data.address || undefined,
      }).unwrap();
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error("Failed to create customer:", err);
    }
  };

  const errorMessage = (() => {
    if (!error) return null;
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    if (typeof (error as any)?.message === "string")
      return (error as any).message;
    return "Failed to create customer";
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to your store
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Customer Name *
            </label>
            <Input
              placeholder="Enter customer name"
              {...register("name")}
              disabled={isSubmitting || isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="customer@example.com"
              {...register("email")}
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Phone Number *
            </label>
            <Input
              placeholder="+1234567890"
              {...register("phone")}
              disabled={isSubmitting || isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              Address
            </label>
            <Input
              placeholder="123 Main Street, City"
              {...register("address")}
              disabled={isSubmitting || isLoading}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger disabled={isSubmitting || isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={isVIP}
                  onCheckedChange={(checked) =>
                    setValue("isVIP", checked as boolean)
                  }
                  disabled={isSubmitting || isLoading}
                />
                <span className="text-sm font-medium">VIP Customer</span>
              </label>
            </div>
          </div>

          {isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
