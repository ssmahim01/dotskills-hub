/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  useGetAllStoresQuery,
  useGetStoreAnalyticsQuery,
  useActivateStoreMutation,
  useSuspendStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
  useCreateStoreMutation,
  IStore,
  IPopulatedSubscription,
} from "@/redux/features/Store/store.api";
import {
  useGetApprovedOwnersQuery,
  ISubscription,
} from "@/redux/features/Subscription/subscription.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
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
  Info,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

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

function getSubscriptionExpiry(store: IStoreWithSub): string | null {
  const sub = store.currentSubscription;
  if (!sub || typeof sub === "string") return null;
  return (sub as IPopulatedSubscription & { endDate?: string }).endDate ?? null;
}

function getSubscriptionPlanName(store: IStoreWithSub): string | null {
  const sub = store.currentSubscription;
  if (!sub || typeof sub === "string") return null;
  return (sub as IPopulatedSubscription).plan?.displayName ?? null;
}

function isSubscriptionPopulated(
  sub: IStoreWithSub["currentSubscription"],
): sub is IPopulatedSubscription {
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
      <div className={cn("absolute inset-0 opacity-5")} />
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

const BUSINESS_TYPES = [
  "ECOMMERCE",
  "FASHION",
  "ELECTRONICS",
  "GROCERY",
  "PHARMACY",
  "RESTAURANT",
  "CUSTOM",
] as const;

export const createStoreSchema = z.object({
  currentSubscription: z
    .string()
    .min(1, "Please select an approved subscription"),

  // Required fields
  storeName: z
    .string()
    .min(1, "Store name is required")
    .min(3, "Store name must be at least 3 characters")
    .max(100, "Store name must not exceed 100 characters"),

  owner: z.string().min(1, "Owner is required"),

  subdomain: z
    .string()
    .min(1, "Subdomain is required")
    .min(3, "Subdomain must be at least 3 characters")
    .max(50, "Subdomain must not exceed 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can contain only lowercase letters, numbers and hyphens",
    ),

  // Optional fields
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  customDomain: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  businessType: z.enum(BUSINESS_TYPES).default("ECOMMERCE"),
  description: z.string().optional().or(z.literal("")),
});

type CreateStoreValues = z.infer<typeof createStoreSchema>;

// Edit store schema - excludes subscription and owner
const editStoreSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store name is required")
    .min(3, "Store name must be at least 3 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  customDomain: z.string().optional().or(z.literal("")),
  subDomain: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  businessType: z.enum(BUSINESS_TYPES).default("ECOMMERCE"),
  description: z.string().optional().or(z.literal("")),
});

type EditStoreValues = z.infer<typeof editStoreSchema>;

interface CreateStoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function CreateStoreDialog({
  open,
  onClose,
  onSuccess,
}: CreateStoreDialogProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const { data: approvedOwnersData, isLoading: ownersLoading } =
    useGetApprovedOwnersQuery();

  const approvedSubscriptions: ISubscription[] = useMemo(
    () => approvedOwnersData?.data ?? [],
    [approvedOwnersData],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStoreValues>({
    resolver: zodResolver(createStoreSchema as any),
    mode: "onBlur",
    defaultValues: {
      currentSubscription: "",
      storeName: "",
      owner: "",
      email: "",
      phone: "",
      subdomain: "",
      customDomain: "",
      address: "",
      businessType: "ECOMMERCE",
      description: "",
    },
  });

  const currentSubscriptionValue = watch("currentSubscription");
  const storeNameValue = watch("storeName");
  const selectedSubscription = useMemo(
    () =>
      approvedSubscriptions.find((s) => s._id === currentSubscriptionValue) ??
      null,
    [approvedSubscriptions, currentSubscriptionValue],
  );

  // Auto-populate form when subscription is selected
  useEffect(() => {
    if (!selectedSubscription) return;

    setValue("storeName", selectedSubscription.storeName, {
      shouldValidate: true,
    });
    setValue("subdomain", selectedSubscription.subdomain, {
      shouldValidate: true,
    });
    setValue(
      "owner",
      typeof selectedSubscription.user === "object"
        ? (selectedSubscription.user as any)._id
        : selectedSubscription.user,
      { shouldValidate: true },
    );
    setValue("phone", selectedSubscription.ownerPhone ?? "", {
      shouldValidate: false,
    });
    setValue("email", selectedSubscription.ownerEmail ?? "", {
      shouldValidate: false,
    });
    if (selectedSubscription.customDomain) {
      setValue("customDomain", selectedSubscription.customDomain, {
        shouldValidate: false,
      });
    }
  }, [selectedSubscription, setValue]);

  useEffect(() => {
    if (selectedSubscription) return;
    if (!storeNameValue) return;

    const slug = storeNameValue
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (slug) {
      setValue("subdomain", slug, { shouldValidate: false });
    }
  }, [storeNameValue, setValue, selectedSubscription]);

  useEffect(() => {
    if (open) {
      reset({
        currentSubscription: "",
        storeName: "",
        owner: "",
        email: "",
        phone: "",
        subdomain: "",
        customDomain: "",
        address: "",
        businessType: "ECOMMERCE",
        description: "",
      });
      setLogoFile(null);
      setBannerFile(null);
    }
  }, [open, reset]);

  const onSubmit = async (values: CreateStoreValues) => {
    try {
      setIsSubmitting(true);

      console.log(" Form validation passed, creating store with values:", {
        subscription: values.currentSubscription,
        storeName: values.storeName,
        owner: values.owner,
        subdomain: values.subdomain,
      });

      const formData = new FormData();

      formData.append("currentSubscription", values.currentSubscription);
      formData.append("storeName", values.storeName);
      formData.append("owner", values.owner);
      formData.append("subdomain", values.subdomain);
      formData.append("businessType", values.businessType);

      // Optional fields
      if (values.email?.trim()) formData.append("email", values.email);
      if (values.phone?.trim()) formData.append("phone", values.phone);
      if (values.customDomain?.trim())
        formData.append("customDomain", values.customDomain);
      if (values.address?.trim()) formData.append("address", values.address);
      if (values.description?.trim())
        formData.append("description", values.description);

      // File uploads (handled by multer on backend)
      if (logoFile) {
        console.log(" Adding logo file:", logoFile.name, logoFile.size);
        formData.append("logo", logoFile);
      }
      if (bannerFile) {
        console.log(" Adding banner file:", bannerFile.name, bannerFile.size);
        formData.append("banner", bannerFile);
      }

      console.log(" Submitting FormData to backend...");

      // Call Redux mutation
      const result = await createStore(formData).unwrap();

      console.log(" Store created successfully:", result);

      toast.success(`Store "${values.storeName}" created successfully!`);

      reset();
      setLogoFile(null);
      setBannerFile(null);
      onClose();

      onSuccess?.();
    } catch (err: unknown) {
      console.error(" Store creation error:", err);

      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ??
        (err as { message?: string })?.message ??
        "Failed to create store";

      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isCreating || isSubmitting;
  const canSubmit = currentSubscriptionValue && !isLoading;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Select an approved subscription — store details will be
            pre-populated automatically from the subscription data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Subscription Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="cs-subscription">
              Approved Subscription
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Controller
              control={control}
              name="currentSubscription"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={ownersLoading}
                >
                  <SelectTrigger
                    id="cs-subscription"
                    className={cn(
                      "w-full",
                      errors.currentSubscription && "border-destructive",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        ownersLoading
                          ? "Loading subscriptions..."
                          : "Select an approved subscription"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedSubscriptions.length > 0 ? (
                      approvedSubscriptions.map((sub) => (
                        <SelectItem key={sub._id} value={sub._id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{sub.ownerName}</span>
                            <span className="text-xs text-muted-foreground">
                              ({sub.ownerEmail})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-subscription" disabled>
                        No approved subscriptions available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currentSubscription && (
              <p className="text-xs text-destructive font-medium">
                {errors.currentSubscription.message}
              </p>
            )}
          </div>

          {/* Auto-populated Info Banner */}
          {selectedSubscription && (
            <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-3">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-0.5">
                  Auto-populated from subscription
                </p>
                <p className="text-xs opacity-80">
                  Owner: {selectedSubscription.ownerName} •{" "}
                  {selectedSubscription.ownerEmail}
                </p>
              </div>
            </div>
          )}

          {/* Store Name & Subdomain */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-storeName">
                Store Name
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="cs-storeName"
                placeholder="My Awesome Store"
                {...register("storeName")}
                className={cn(
                  "w-full",
                  errors.storeName && "border-destructive",
                )}
                readOnly={!!selectedSubscription}
                disabled={!!selectedSubscription}
              />
              {errors.storeName && (
                <p className="text-xs text-destructive font-medium">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-subdomain">
                Subdomain
                <span className="text-destructive ml-1">*</span>
              </Label>
              <div className="flex items-center">
                <Input
                  id="cs-subdomain"
                  placeholder="my-store"
                  {...register("subdomain")}
                  className={cn(
                    "rounded-r-none w-full",
                    errors.subdomain && "border-destructive",
                  )}
                  readOnly={!!selectedSubscription}
                  disabled={!!selectedSubscription}
                />
                <span className="inline-flex h-9 items-center rounded-r-md border border-l-0 bg-muted px-2.5 text-xs text-muted-foreground whitespace-nowrap font-medium">
                  .domain.shop
                </span>
              </div>
              {errors.subdomain && (
                <p className="text-xs text-destructive font-medium">
                  {errors.subdomain.message}
                </p>
              )}
            </div>
          </div>

          {/* Owner Info (read-only when subscription selected) */}
          {selectedSubscription && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cs-ownerName">Owner Name</Label>
                <Input
                  id="cs-ownerName"
                  value={selectedSubscription.ownerName}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cs-ownerEmail">Owner Email</Label>
                <Input
                  id="cs-ownerEmail"
                  value={selectedSubscription.ownerEmail}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-email">Contact Email</Label>
              <Input
                id="cs-email"
                type="email"
                placeholder="store@example.com"
                {...register("email")}
                className={cn("w-full", errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-phone">Phone Number</Label>
              <Input
                id="cs-phone"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                className={cn("w-full", errors.phone && "border-destructive")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Domain & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-customDomain">
                Custom Domain{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="cs-customDomain"
                placeholder="www.example.com"
                {...register("customDomain")}
                className={cn(
                  "w-full",
                  errors.customDomain && "border-destructive",
                )}
              />
              {errors.customDomain && (
                <p className="text-xs text-destructive font-medium">
                  {errors.customDomain.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-address">Address</Label>
              <Input
                id="cs-address"
                placeholder="123 Main Street, City, State"
                {...register("address")}
                className={cn("w-full", errors.address && "border-destructive")}
              />
              {errors.address && (
                <p className="text-xs text-destructive font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Business Type & Description */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-businessType">
                Business Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Controller
                control={control}
                name="businessType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="cs-businessType"
                      className={cn(
                        "w-full",
                        errors.businessType && "border-destructive",
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.businessType && (
                <p className="text-xs text-destructive font-medium">
                  {errors.businessType.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-description">Description</Label>
              <Input
                id="cs-description"
                placeholder="Brief store description..."
                {...register("description")}
                className={cn(
                  "w-full",
                  errors.description && "border-destructive",
                )}
              />
              {errors.description && (
                <p className="text-xs text-destructive font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cs-logo">
                Logo{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <div
                className="border-2 border-dashed rounded-lg px-3 py-6 text-center cursor-pointer transition-colors hover:bg-muted/40 hover:border-primary"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {logoFile.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setLogoFile(file);
                  if (file) {
                    console.log(" Logo selected:", file.name, file.size);
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cs-banner">
                Banner{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </Label>
              <div
                className="border-2 border-dashed rounded-lg px-3 py-6 text-center cursor-pointer transition-colors hover:bg-muted/40 hover:border-primary"
                onClick={() => bannerInputRef.current?.click()}
              >
                {bannerFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {bannerFile.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setBannerFile(file);
                  if (file) {
                    console.log(" Banner selected:", file.name, file.size);
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
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
              disabled={!canSubmit}
              className="active:scale-95 hover:cursor-pointer transition-transform"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating…
                </>
              ) : (
                "Create Store"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditStoreDialog({
  store,
  onClose,
  onSuccess,
}: {
  store: IStore | null;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [updateStore, { isLoading }] = useUpdateStoreMutation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<EditStoreValues>({
    resolver: zodResolver(editStoreSchema as any),
    mode: "onBlur",
    defaultValues: {
      storeName: "",
      email: "",
      phone: "",
      customDomain: "",
      subDomain: "",
      businessType: "ECOMMERCE",
      address: "",
      description: "",
    },
  });

  useEffect(() => {
    if (store) {
      reset({
        storeName: store.storeName ?? "",
        email: store.email ?? "",
        phone: store.phone ?? "",
        customDomain: store.customDomain ?? "",
        subDomain: store.subdomain ?? "",
        address: store.address ?? "",
        description: store.description ?? "",
      });
    }
  }, [store, reset]);

  const onSubmit = async (values: EditStoreValues) => {
    if (!store) return;

    try {
      console.log(" Updating store:", store._id, values);

      const formData = new FormData();

      // Only append non-empty values
      if (values.storeName?.trim())
        formData.append("storeName", values.storeName);
      if (values.businessType?.trim())
        formData.append("businessType", values.businessType);
      if (values.email?.trim()) formData.append("email", values.email);
      if (values.phone?.trim()) formData.append("phone", values.phone);
      if (values.subDomain?.trim())
        formData.append("subdomain", values.subDomain);
      if (values.customDomain?.trim())
        formData.append("customDomain", values.customDomain);

      if (values.address?.trim()) formData.append("address", values.address);
      if (values.description?.trim())
        formData.append("description", values.description);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const result = await updateStore({
        id: store._id,
        data: formData,
      }).unwrap();

      console.log(" Store updated successfully:", result);

      toast.success(`"${values.storeName}" updated successfully!`);

      reset();
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      console.error(" Store update error:", err);

      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ??
        (err as { message?: string })?.message ??
        "Update failed";

      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={!!store} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Update store details and contact information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-storeName">Store Name</Label>
              <Input
                id="edit-storeName"
                placeholder="Store name"
                {...register("storeName")}
                className={cn(
                  "w-full",
                  errors.storeName && "border-destructive",
                )}
              />
              {errors.storeName && (
                <p className="text-xs text-destructive font-medium">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="store@example.com"
                {...register("email")}
                className={cn("w-full", errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
                className={cn("w-full", errors.phone && "border-destructive")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-customDomain">
                Custom Domain{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="edit-customDomain"
                placeholder="www.example.com"
                {...register("customDomain")}
                className={cn(
                  "w-full",
                  errors.customDomain && "border-destructive",
                )}
              />
              {errors.customDomain && (
                <p className="text-xs text-destructive font-medium">
                  {errors.customDomain.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-subDomain">
                Sub Domain{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="edit-subDomain"
                placeholder="www.example.com"
                {...register("subDomain")}
                className={cn(
                  "w-full",
                  errors.subDomain && "border-destructive",
                )}
              />
              {errors.subDomain && (
                <p className="text-xs text-destructive font-medium">
                  {errors.subDomain.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                placeholder="123 Main Street, City, State"
                {...register("address")}
                className={cn("w-full", errors.address && "border-destructive")}
              />
              {errors.address && (
                <p className="text-xs text-destructive font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Brief store description..."
                {...register("description")}
                className={cn(
                  "w-full",
                  errors.description && "border-destructive",
                )}
              />
              {errors.description && (
                <p className="text-xs text-destructive font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cs-businessType">
              Business Type
              <span className="text-destructive ml-1">*</span>
            </Label>

            <Controller
              control={control}
              name="businessType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Store Logo</Label>

              {store?.logo && (
                <Image
                  width={500}
                  height={500}
                  priority
                  quality={90}
                  src={store.logo}
                  alt="Store Logo"
                  className="h-24 w-full object-cover rounded-md border"
                />
              )}

              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoFile ? (
                  <p className="text-sm font-medium">{logoFile.name}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click to upload new logo
                  </p>
                )}
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <Label>Store Banner</Label>

              {store?.banner && (
                <Image
                  width={500}
                  height={500}
                  priority
                  quality={90}
                  src={store.banner}
                  alt="Store Banner"
                  className="h-24 w-full object-cover rounded-md border"
                />
              )}

              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/40"
                onClick={() => bannerInputRef.current?.click()}
              >
                {bannerFile ? (
                  <p className="text-sm font-medium">{bannerFile.name}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click to upload new banner
                  </p>
                )}
              </div>

              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
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
              disabled={isLoading || !isValid}
              className="active:scale-95 transition-transform"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
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

  const sub = isSubscriptionPopulated(store.currentSubscription)
    ? store.currentSubscription
    : null;

  const expiry = getSubscriptionExpiry(store);

  return (
    <Sheet open={!!store} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
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
                  {store.subdomain}.domain.shop
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
    <Card className="group relative p-0 border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-16 bg-gradient-to-br from-primary/10 to-primary/5 relative">
        {store.banner && (
          <Image
            width={600}
            height={400}
            src={store.banner}
            alt={`${store.storeName} banner`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <CardContent className="pt-4 pb-4">
        <div className="flex gap-3 mb-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={store.logo} alt={store.storeName} />
            <AvatarFallback className="font-bold bg-primary/10 text-primary">
              {store.storeName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {store.storeName}
            </h3>
            <p className="text-xs text-muted-foreground">
              {store.subdomain}.domain.shop
            </p>
          </div>
          <StatusBadge status={store.status} />
        </div>

        {planName && (
          <div className="mb-2 text-xs">
            <Badge variant="secondary" className="text-xs">
              {planName}
            </Badge>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="w-3 h-3" />
            <span>{store.totalProducts} products</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShoppingCart className="w-3 h-3" />
            <span>{store.totalOrders} orders</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs"
            onClick={onView}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          {store.status === "ACTIVE" ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onSuspend}
            >
              <Pause className="w-3 h-3 mr-1" />
              Suspend
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={onActivate}
            >
              <Play className="w-3 h-3 mr-1" />
              Activate
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            className="h-8 w-8 p-0"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Stores() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<IStore | null>(null);
  const [detailStore, setDetailStore] = useState<IStoreWithSub | null>(null);
  const [deleteStore, setDeleteStore] = useState<IStore | null>(null);

  const {
    data: storesData,
    isLoading,
    refetch,
  } = useGetAllStoresQuery({ limit: 500 });
  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetStoreAnalyticsQuery();

  const [activateStoreMutation] = useActivateStoreMutation();
  const [suspendStoreMutation] = useSuspendStoreMutation();
  const [deleteStoreMutation] = useDeleteStoreMutation();

  const stores: IStoreWithSub[] = useMemo(
    () => storesData?.data ?? [],
    [storesData],
  );

  const filteredStores = useMemo(
    () =>
      stores.filter(
        (store) =>
          store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [stores, searchTerm],
  );

  const handleActivate = async (storeId: string) => {
    try {
      await activateStoreMutation(storeId).unwrap();
      toast.success("Store activated");
      refetch();
    } catch (err) {
      toast.error("Failed to activate store");
    }
  };

  const handleSuspend = async (storeId: string) => {
    try {
      await suspendStoreMutation(storeId).unwrap();
      toast.success("Store suspended");
      refetch();
    } catch (err) {
      toast.error("Failed to suspend store");
    }
  };

  const handleDelete = async () => {
    if (!deleteStore) return;
    try {
      await deleteStoreMutation(deleteStore._id).unwrap();
      toast.success("Store deleted");
      setDeleteStore(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete store");
    }
  };

  const totalStores = stores.length;
  const activeStores = stores.filter((s) => s.status === "ACTIVE").length;
  const totalRevenue = stores.reduce(
    (sum, s) => sum + (s.totalRevenue || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Store Management
          </h1>
          <p className="text-muted-foreground">
            Manage all stores and their subscriptions
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Store
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Stores"
          value={totalStores}
          icon={Store}
          accent="bg-blue-500"
          isLoading={isLoading}
        />
        <StatCard
          label="Active"
          value={activeStores}
          icon={CheckCircle2}
          accent="bg-emerald-500"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          accent="bg-orange-500"
          isLoading={isLoading}
        />
        <StatCard
          label="Products"
          value={stores.reduce((sum, s) => sum + (s.totalProducts || 0), 0)}
          icon={Package}
          accent="bg-purple-500"
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Stores</CardTitle>
              <CardDescription>
                {filteredStores.length} of {totalStores} stores
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-4 grid-cols-1 lg:grid-cols-2"
                  : "space-y-3"
              }
            >
              {filteredStores.map((store) => (
                <StoreCard
                  key={store._id}
                  store={store}
                  onView={() => setDetailStore(store)}
                  onEdit={() => setEditingStore(store)}
                  onDelete={() => setDeleteStore(store)}
                  onActivate={() => handleActivate(store._id)}
                  onSuspend={() => handleSuspend(store._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No stores found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateStoreDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      <EditStoreDialog
        store={editingStore}
        onClose={() => setEditingStore(null)}
        onSuccess={() => {
          refetch();
          setEditingStore(null);
        }}
      />

      <StoreDetailSheet
        store={detailStore}
        onClose={() => setDetailStore(null)}
      />

      <AlertDialog
        open={!!deleteStore}
        onOpenChange={(open) => !open && setDeleteStore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Store</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteStore?.storeName}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
