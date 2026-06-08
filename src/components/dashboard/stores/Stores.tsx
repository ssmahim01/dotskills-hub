/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useGetAllStoresQuery,
  useGetStoreAnalyticsQuery,
  useActivateStoreMutation,
  useSuspendStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
  useCreateStoreMutation,
  IStore,
} from "@/redux/features/Store/store.api";
import { useGetAllPlansQuery, IPlan } from "@/redux/features/Plan/plan.api";
import { useGetAllUsersQuery } from "@/redux/features/user/user.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Store,
  CheckCircle2,
  Clock,
  PauseCircle,
  XCircle,
  Pencil,
  Trash2,
  Eye,
  Play,
  Pause,
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Globe,
  CreditCard,
  CalendarDays,
  ExternalLink,
  LayoutGrid,
  List,
  Plus,
  BadgeCheck,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { IUser, Role } from "@/types/user.types";

interface IPopulatedSubscription {
  _id: string;
  plan?: {
    _id: string;
    displayName: string;
    monthlyPrice: number;
  };
  status?: string;
  currentPeriodEnd: string;
  expiresAt: string;
}

type IStoreWithSub = IStore & {
  currentSubscription?: IPopulatedSubscription | string | null;
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getSubscriptionExpiry(store: any): string | null {
  const sub = store.currentSubscription;
  if (!sub || typeof sub === "string") return null;
  return sub?.currentPeriodEnd ?? sub?.expiresAt ?? null;
}

function getSubscriptionPlanName(store: any): string | null {
  const sub = store.currentSubscription;
  if (!sub || typeof sub === "string") return null;
  return sub?.plan?.displayName ?? null;
}

function isSubscriptionPopulated(
  sub: IStoreWithSub["currentSubscription"],
): sub is any {
  return !!sub && typeof sub === "object";
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: PauseCircle,
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  },
  INACTIVE: {
    label: "Inactive",
    icon: XCircle,
    className:
      "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.INACTIVE;
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn("text-xs gap-1 font-medium", cfg.className)}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  isLoading,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm bg-card">
      <div className={cn("absolute inset-0 opacity-5", accent)} />
      <CardContent className="pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold tabular-nums">{value}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", accent)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const businessTypes = [
  "ECOMMERCE",
  "FASHION",
  "ELECTRONICS",
  "GROCERY",
  "PHARMACY",
  "RESTAURANT",
  "CUSTOM",
] as const;

const createStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  owner: z.string().min(1, "Store owner is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  subdomain: z
    .string()
    .min(1, "Subdomain is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain must be lowercase letters, numbers, and hyphens only",
    ),
  customDomain: z.string().optional(),
  address: z.string().optional(),
  businessType: z.enum(businessTypes).default("ECOMMERCE"),
  description: z.string().optional(),
  planId: z.string().optional(),
  status: z
    .enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE"])
    .default("PENDING"),
  isVerified: z.boolean().default(false),
});

type CreateStoreValues = z.infer<typeof createStoreSchema>;

function CreateStoreDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [createStore, { isLoading }] = useCreateStoreMutation();
  const { data: plansData } = useGetAllPlansQuery({});
  const { data: usersData } = useGetAllUsersQuery({});

  const plans: IPlan[] = plansData?.data ?? [];
  const users: IUser[] = usersData?.data ?? [];
  const storeOwners = users.filter((user) => user.role === Role.OWNER);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStoreValues>({
    resolver: zodResolver(createStoreSchema as any),
    defaultValues: {
      storeName: "",
      owner: "",
      email: "",
      phone: "",
      subdomain: "",
      customDomain: "",
      address: "",
      businessType: "ECOMMERCE",
      description: "",
      planId: "",
      status: "PENDING",
      isVerified: false,
    },
  });

  const statusValue = watch("status");
  const businessTypeValue = watch("businessType");
  const ownerValue = watch("owner");
  const planIdValue = watch("planId");
  const isVerifiedValue = watch("isVerified");
  const storeNameValue = watch("storeName");

  // Auto-generate subdomain from store name
  useEffect(() => {
    if (storeNameValue) {
      const slug = storeNameValue
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("subdomain", slug, { shouldValidate: false });
    }
  }, [storeNameValue, setValue]);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = async (values: CreateStoreValues) => {
    try {
      const payload = new FormData();
      payload.append("storeName", String(values.storeName));
      payload.append("owner", String(values.owner));
      if (values.subdomain) payload.append("subdomain", String(values.subdomain));
      if (values.businessType) payload.append("businessType", String(values.businessType));
      if (typeof values.status !== "undefined") payload.append("status", String(values.status));
      if (typeof values.isVerified !== "undefined") payload.append("isVerified", String(values.isVerified));
      if (values.email) payload.append("email", String(values.email));
      if (values.phone) payload.append("phone", String(values.phone));
      if (values.customDomain) payload.append("customDomain", String(values.customDomain));
      if (values.address) payload.append("address", String(values.address));
      if (values.description) payload.append("description", String(values.description));
      if (values.planId) payload.append("planId", String(values.planId));

      await createStore(payload).unwrap();
      toast.success(`Store "${values.storeName}" created`);
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to create store",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Manually create a store and optionally assign a subscription plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Store Name + Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-storeName">Store Name</Label>
              <Input
                id="cs-storeName"
                placeholder="My Store"
                {...register("storeName")}
                className={errors.storeName ? "border-destructive" : ""}
              />
              {errors.storeName && (
                <p className="text-sm text-destructive">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Store Owner</Label>
              <Select
                value={ownerValue}
                onValueChange={(v: any) =>
                  setValue("owner", v, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  className={errors.owner ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select owner..." />
                </SelectTrigger>
                <SelectContent>
                  {storeOwners.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.name ?? u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.owner && (
                <p className="text-sm text-destructive">
                  {errors.owner.message}
                </p>
              )}
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-email">Email</Label>
              <Input
                id="cs-email"
                type="email"
                placeholder="store@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-phone">Phone</Label>
              <Input
                id="cs-phone"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Subdomain + Custom Domain */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-subdomain">
                Subdomain{" "}
                <span className="text-muted-foreground font-normal">
                  (.domain.shop)
                </span>
              </Label>
              <Input
                id="cs-subdomain"
                placeholder="my-store"
                {...register("subdomain")}
                className={errors.subdomain ? "border-destructive" : ""}
              />
              {errors.subdomain && (
                <p className="text-sm text-destructive">
                  {errors.subdomain.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-customDomain">
                Custom Domain{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="cs-customDomain"
                placeholder="www.example.com"
                {...register("customDomain")}
                className={errors.customDomain ? "border-destructive" : ""}
              />
              {errors.customDomain && (
                <p className="text-sm text-destructive">
                  {errors.customDomain.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label htmlFor="cs-address">Address</Label>
            <Input
              id="cs-address"
              placeholder="123 Main St, City, Country"
              {...register("address")}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Business Type + Pricing Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Business Type</Label>
              <Select
                value={businessTypeValue}
                onValueChange={(v) =>
                  setValue(
                    "businessType",
                    v as CreateStoreValues["businessType"],
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger
                  className={errors.businessType ? "border-destructive" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((bt) => (
                    <SelectItem key={bt} value={bt}>
                      {bt.charAt(0) + bt.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-sm text-destructive">
                  {errors.businessType.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Pricing Plan{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Select
                value={planIdValue ?? ""}
                onValueChange={(v: any) =>
                  setValue("planId", v === "none" ? "" : v, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={errors.planId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="No plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No plan</SelectItem>
                  {plans
                    .filter((p) => p.status === "ACTIVE")
                    .map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.displayName} — ${p.monthlyPrice}/mo
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.planId && (
                <p className="text-sm text-destructive">
                  {errors.planId.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cs-description">Description</Label>
            <Input
              id="cs-description"
              placeholder="Brief store description..."
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status + Is Verified */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Store Status</Label>
              <Select
                value={statusValue}
                onValueChange={(v) =>
                  setValue("status", v as CreateStoreValues["status"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={errors.status ? "border-destructive" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1 space-y-1.5">
              <Label>Is Verified</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch
                  checked={isVerifiedValue}
                  onCheckedChange={(v) =>
                    setValue("isVerified", v, { shouldValidate: true })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {isVerifiedValue ? "Verified" : "Not verified"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="active:scale-95 transition-transform"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="active:scale-95 transition-transform"
            >
              {isLoading ? "Creating..." : "Create Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const editStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  customDomain: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

type EditStoreValues = z.infer<typeof editStoreSchema>;

function EditStoreDialog({
  store,
  onClose,
}: {
  store: IStore | null;
  onClose: () => void;
}) {
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditStoreValues>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      storeName: "",
      phone: "",
      email: "",
      customDomain: "",
      address: "",
      description: "",
    },
  });

  useEffect(() => {
    if (store) {
      reset({
        storeName: store.storeName,
        phone: store.phone ?? "",
        email: store.email ?? "",
        customDomain: store.customDomain ?? "",
        address: store.address ?? "",
        description: store.description ?? "",
      });
    }
  }, [store, reset]);

  const onSubmit = async (values: EditStoreValues) => {
    if (!store) return;
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      await updateStore({ id: store._id, data: fd }).unwrap();
      toast.success(`"${values.storeName}" updated`);
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Update failed",
      );
    }
  };

  return (
    <Dialog open={!!store} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Update store details and contact information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-storeName">Store Name</Label>
              <Input
                id="edit-storeName"
                {...register("storeName")}
                className={errors.storeName ? "border-destructive" : ""}
              />
              {errors.storeName && (
                <p className="text-sm text-destructive">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-customDomain">
                Custom Domain (optional)
              </Label>
              <Input
                id="edit-customDomain"
                placeholder="www.example.com"
                {...register("customDomain")}
                className={errors.customDomain ? "border-destructive" : ""}
              />
              {errors.customDomain && (
                <p className="text-sm text-destructive">
                  {errors.customDomain.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="active:scale-95 transition-transform"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="active:scale-95 transition-transform"
            >
              {isLoading ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StoreDetailSheet({
  store,
  onClose,
}: {
  store: IStoreWithSub | null;
  onClose: () => void;
}) {
  if (!store) return null;

  type PopulatedOwner = { name?: string; email?: string; phone?: string };
  const owner =
    typeof store.owner === "object"
      ? (store.owner as unknown as PopulatedOwner)
      : null;

  const sub: any = isSubscriptionPopulated(store.currentSubscription)
    ? store.currentSubscription
    : null;

  const expiry = getSubscriptionExpiry(store);

  return (
    <Sheet open={!!store} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-120 overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={store.logo} alt={store.storeName} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {store.storeName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-lg">{store.storeName}</SheetTitle>
              <SheetDescription className="flex items-center gap-1 text-xs">
                <Globe className="w-3 h-3" />
                {store.subdomain}.domain.shop
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-5 space-y-6">
          {/* Status + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={store.status} />
            {store.isVerified && (
              <Badge
                variant="outline"
                className="text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {store.businessType}
            </Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Package, label: "Products", value: store.totalProducts },
              {
                icon: ShoppingCart,
                label: "Orders",
                value: store.totalOrders,
              },
              { icon: Users, label: "Customers", value: store.totalCustomers },
              {
                icon: DollarSign,
                label: "Revenue",
                value: formatCurrency(store.totalRevenue),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <p className="font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Owner info */}
          {owner && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Owner
              </h4>
              <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
                {owner.name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{owner.name}</span>
                  </div>
                )}
                {owner.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{owner.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Contact & Domain
            </h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
              {store.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{store.email}</span>
                </div>
              )}
              {store.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{store.phone}</span>
                </div>
              )}
              {store.address && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">
                    Address
                  </span>
                  <span className="text-right">{store.address}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subdomain</span>
                <a
                  href={`https://${store.subdomain}.domain.shop`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline text-xs"
                >
                  {store.subdomain}.domain.shop{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {store.customDomain && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Custom Domain</span>
                  <span>{store.customDomain}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Subscription
            </h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
              {sub ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-medium">Active subscription</span>
                  </div>
                  {sub.plan?.displayName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium">
                        {sub.plan.displayName}
                      </span>
                    </div>
                  )}
                  {sub.plan?.monthlyPrice !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span>{formatCurrency(sub.plan.monthlyPrice)}/mo</span>
                    </div>
                  )}
                  {sub.status && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sub. Status</span>
                      <Badge variant="outline" className="text-[10px] py-0 h-5">
                        {sub.status}
                      </Badge>
                    </div>
                  )}
                  {expiry && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires</span>
                      <span
                        className={cn(
                          new Date(expiry) < new Date()
                            ? "text-destructive"
                            : "",
                        )}
                      >
                        {formatDate(expiry)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>No active subscription</span>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Timeline
            </h4>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Created
                </span>
                <span>{formatDate(store.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Updated
                </span>
                <span>{formatDate(store.updatedAt)}</span>
              </div>
              {store.lastActivityAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Last Active
                  </span>
                  <span>{formatDate(store.lastActivityAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StoreCard({
  store,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onSuspend,
}: {
  store: IStoreWithSub;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onSuspend: () => void;
}) {
  const planName = getSubscriptionPlanName(store);

  return (
    <Card className="group relative border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-16 bg-linear-to-br from-primary/10 to-primary/5 relative">
        {store.banner && (
          <Image
            width={600}
            height={400}
            src={store.banner}
            priority
            quality={90}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 right-0 left-0 flex justify-end p-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-6 w-6 active:scale-95 transition-transform"
            onClick={onView}
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-6 w-6 active:scale-95 transition-transform"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3" />
          </Button>
          {store.status === "SUSPENDED" || store.status === "PENDING" ? (
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 active:scale-95 transition-transform"
              onClick={onActivate}
            >
              <Play className="w-3 h-3 text-emerald-600" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 active:scale-95 transition-transform"
              onClick={onSuspend}
            >
              <Pause className="w-3 h-3 text-amber-600" />
            </Button>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="h-6 w-6 active:scale-95 transition-transform hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <CardContent className="pt-3 pb-4">
        <div className="flex items-center gap-2.5 mb-3 -mt-1">
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarImage src={store.logo} />
            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
              {store.storeName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{store.storeName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {store.subdomain}.domain.shop
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={store.status} />
          <span className="text-xs text-muted-foreground">
            {store.businessType}
          </span>
        </div>

        {planName && (
          <div className="mb-2">
            <Badge
              variant="outline"
              className="text-[10px] gap-1 bg-blue-50 text-blue-700 border-blue-200"
            >
              <CreditCard className="w-2.5 h-2.5" />
              {planName}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Products", value: store.totalProducts },
            { label: "Orders", value: store.totalOrders },
            { label: "Revenue", value: formatCurrency(store.totalRevenue) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/40 rounded px-2 py-1.5">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-xs font-semibold truncate">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StoreTableRow({
  store,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onSuspend,
}: {
  store: IStoreWithSub;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onSuspend: () => void;
}) {
  type PopulatedOwner = { name?: string; email?: string };
  const owner =
    typeof store.owner === "object"
      ? (store.owner as unknown as PopulatedOwner)
      : null;

  const planName = getSubscriptionPlanName(store);
  const expiry = getSubscriptionExpiry(store);
  const isExpired = expiry ? new Date(expiry) < new Date() : false;

  return (
    <tr className="border-b border-border/60 hover:bg-muted/30 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={store.logo} />
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {store.storeName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{store.storeName}</p>
            <p className="text-xs text-muted-foreground">
              {store.subdomain}.domain.shop
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-muted-foreground">
        {owner?.name ??
          (typeof store.owner === "string" ? store.owner.slice(-6) : "—")}
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge status={store.status} />
      </td>
      <td className="px-5 py-3.5">
        {planName ? (
          <Badge
            variant="outline"
            className="text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            <CreditCard className="w-3 h-3" />
            {planName}
          </Badge>
        ) : store.currentSubscription ? (
          <Badge
            variant="outline"
            className="text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200"
          >
            <CreditCard className="w-3 h-3" /> Subscribed
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            No Plan
          </Badge>
        )}
      </td>
      <td className="px-5 py-3.5 text-xs text-muted-foreground">
        {expiry ? (
          <span className={cn(isExpired ? "text-destructive font-medium" : "")}>
            {isExpired ? "Expired " : ""}
            {formatDate(expiry)}
          </span>
        ) : (
          <span>—</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-sm text-right font-medium">
        {formatCurrency(store.totalRevenue)}
      </td>
      <td className="px-5 py-3.5 text-sm text-muted-foreground">
        {formatDate(store.createdAt)}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 active:scale-95 transition-transform"
            onClick={onView}
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 active:scale-95 transition-transform"
            onClick={onEdit}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          {store.status === "SUSPENDED" || store.status === "PENDING" ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 active:scale-95 transition-transform"
              title="Activate"
              onClick={onActivate}
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 active:scale-95 transition-transform"
              title="Suspend"
              onClick={onSuspend}
            >
              <Pause className="w-3.5 h-3.5 text-amber-600" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 active:scale-95 transition-transform hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function Stores() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewStore, setViewStore] = useState<IStoreWithSub | null>(null);
  const [editStore, setEditStore] = useState<IStore | null>(null);
  const [deleteStore, setDeleteStore] = useState<IStore | null>(null);

  const { data, isLoading, isError } = useGetAllStoresQuery({ limit: 100 });
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetStoreAnalyticsQuery();
  const [activateStore] = useActivateStoreMutation();
  const [suspendStore] = useSuspendStoreMutation();
  const [deleteStoreMutation, { isLoading: deleting }] =
    useDeleteStoreMutation();

  const stores = useMemo(() => (data?.data ?? []) as IStoreWithSub[], [data]);
  const analytics = analyticsData?.data;

  const filtered = useMemo(() => {
    return stores.filter((s) => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchSearch =
        !search ||
        s.storeName.toLowerCase().includes(search.toLowerCase()) ||
        s.subdomain.toLowerCase().includes(search.toLowerCase()) ||
        (s.email ?? "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [stores, search, statusFilter]);

  // Creation & subscription stats
  const creationStats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return {
      lastThirtyDays: stores.filter(
        (s) => new Date(s.createdAt) >= thirtyDaysAgo,
      ).length,
      lastSevenDays: stores.filter((s) => new Date(s.createdAt) >= sevenDaysAgo)
        .length,
      withSubscription: stores.filter((s) => !!s.currentSubscription).length,
      verified: stores.filter((s) => s.isVerified).length,
    };
  }, [stores]);

  const handleActivate = async (store: IStore) => {
    try {
      await activateStore(store._id).unwrap();
      toast.success(`"${store.storeName}" activated`);
    } catch {
      toast.error("Failed to activate store");
    }
  };

  const handleSuspend = async (store: IStore) => {
    try {
      await suspendStore(store._id).unwrap();
      toast.success(`"${store.storeName}" suspended`);
    } catch {
      toast.error("Failed to suspend store");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStore) return;
    try {
      await deleteStoreMutation(deleteStore._id).unwrap();
      toast.success(`"${deleteStore.storeName}" deleted`);
      setDeleteStore(null);
    } catch {
      toast.error("Failed to delete store");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage all tenant stores and subscriptions
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="active:scale-95 transition-transform gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Store
        </Button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Stores"
          value={analytics?.totalStores ?? stores.length}
          icon={Store}
          accent="bg-indigo-500"
          isLoading={analyticsLoading}
        />
        <StatCard
          label="Active"
          value={analytics?.activeStores ?? 0}
          icon={CheckCircle2}
          accent="bg-emerald-500"
          isLoading={analyticsLoading}
        />
        <StatCard
          label="Pending"
          value={analytics?.pendingStores ?? 0}
          icon={Clock}
          accent="bg-amber-500"
          isLoading={analyticsLoading}
        />
        <StatCard
          label="Total Revenue"
          value={analytics ? formatCurrency(analytics.totalRevenue) : "—"}
          icon={TrendingUp}
          accent="bg-violet-500"
          isLoading={analyticsLoading}
        />
      </div>

      {/* Creation & Subscription Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Last 7 Days"
          value={creationStats.lastSevenDays}
          icon={CalendarDays}
          accent="bg-sky-500"
        />
        <StatCard
          label="Last 30 Days"
          value={creationStats.lastThirtyDays}
          icon={Layers}
          accent="bg-teal-500"
        />
        <StatCard
          label="Subscribed"
          value={creationStats.withSubscription}
          icon={CreditCard}
          accent="bg-blue-500"
        />
        <StatCard
          label="Verified"
          value={creationStats.verified}
          icon={BadgeCheck}
          accent="bg-rose-500"
        />
      </div>

      {/* Filters + view toggle */}
      <Card className="border shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value ?? "all")}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9 active:scale-95 transition-transform"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9 active:scale-95 transition-transform"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {isError ? (
        <Card className="border shadow-sm">
          <CardContent className="py-16 text-center text-muted-foreground">
            <p className="text-sm">
              Failed to load stores. Please refresh and try again.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Showing {filtered.length} of {stores.length} stores
          </p>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center text-muted-foreground">
                <Store className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No stores found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((store) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  onView={() => setViewStore(store)}
                  onEdit={() => setEditStore(store)}
                  onDelete={() => setDeleteStore(store)}
                  onActivate={() => handleActivate(store)}
                  onSuspend={() => handleSuspend(store)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              All Stores{" "}
              <span className="text-muted-foreground font-normal text-sm">
                ({filtered.length})
              </span>
            </CardTitle>
            <CardDescription>Hover a row to see actions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-5 py-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Store className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No stores found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      {[
                        { label: "Store", align: "left" },
                        { label: "Owner", align: "left" },
                        { label: "Status", align: "left" },
                        { label: "Plan", align: "left" },
                        { label: "Expiry", align: "left" },
                        { label: "Revenue", align: "right" },
                        { label: "Created", align: "left" },
                        { label: "Actions", align: "left" },
                      ].map(({ label, align }) => (
                        <th
                          key={label}
                          className={cn(
                            "px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                            align === "right" ? "text-right" : "text-left",
                          )}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((store) => (
                      <StoreTableRow
                        key={store._id}
                        store={store}
                        onView={() => setViewStore(store)}
                        onEdit={() => setEditStore(store)}
                        onDelete={() => setDeleteStore(store)}
                        onActivate={() => handleActivate(store)}
                        onSuspend={() => handleSuspend(store)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Store dialog */}
      <CreateStoreDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Detail sheet */}
      <StoreDetailSheet store={viewStore} onClose={() => setViewStore(null)} />

      {/* Edit dialog */}
      <EditStoreDialog store={editStore} onClose={() => setEditStore(null)} />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteStore}
        onOpenChange={(v: boolean) => !v && setDeleteStore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteStore?.storeName}</strong>? This action is
              irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="active:scale-95 transition-transform">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 active:scale-95 transition-transform"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
