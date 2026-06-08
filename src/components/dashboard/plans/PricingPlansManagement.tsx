/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  IPlan,
} from "@/redux/features/Plan/plan.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ToggleLeft,
  ToggleRight,
  PackageCheck,
  PackageX,
  TrendingUp,
  Layers,
  X,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const featureSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
});

const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().min(1, "Description is required"),
  monthlyPrice: z.coerce.number().min(0, "Price must be >= 0"),
  yearlyPrice: z.coerce.number().min(0).optional(),
  billingCycle: z.string().min(1),
  maxProducts: z.coerce.number().min(0),
  storageGB: z.coerce.number().min(0),
  monthlyRequests: z.coerce.number().min(0),
  maxUsers: z.coerce.number().min(1),
  sortOrder: z.coerce.number().min(1),
  isPopular: z.boolean().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  features: z.array(featureSchema).default([]),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
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
            <p className="text-3xl font-bold tabular-nums">{value}</p>
          </div>
          <div className={cn("p-3 rounded-xl", accent)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlanRow({
  plan,
  onEdit,
  onDelete,
  onToggleStatus,
  onTogglePopular,
}: {
  plan: IPlan;
  onEdit: (plan: IPlan) => void;
  onDelete: (plan: IPlan) => void;
  onToggleStatus: (plan: IPlan) => void;
  onTogglePopular: (plan: IPlan) => void;
}) {
  const isActive = plan.status === "ACTIVE";
  return (
    <tr className="border-b border-border/60 hover:bg-muted/30 transition-colors group">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm">{plan.displayName}</span>
          {plan.isPopular && (
            <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
              Popular
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">/{plan.slug}</p>
      </td>
      <td className="px-5 py-3.5">
        <div className="text-sm font-semibold">
          ${plan.monthlyPrice}
          <span className="text-xs font-normal text-muted-foreground">/mo</span>
        </div>
        {plan.yearlyPrice ? (
          <div className="text-xs text-muted-foreground">
            ${plan.yearlyPrice}/yr
          </div>
        ) : null}
      </td>
      <td className="px-5 py-3.5 text-sm text-muted-foreground">
        <div className="flex flex-col gap-0.5 text-xs">
          <span>
            {plan.maxProducts === 0 ? "Unlimited" : plan.maxProducts} products
          </span>
          <span>{plan.storageGB}GB storage</span>
          <span>
            {plan.maxUsers} user{plan.maxUsers !== 1 ? "s" : ""}
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1 max-w-55">
          {plan.features.slice(0, 3).map((f, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="text-[10px] font-normal"
            >
              {f.title}
            </Badge>
          ))}
          {plan.features.length > 3 && (
            <Badge variant="outline" className="text-[10px]">
              +{plan.features.length - 3}
            </Badge>
          )}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <Badge
          className={cn(
            "text-xs font-medium",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400",
          )}
          variant="outline"
        >
          {plan.status}
        </Badge>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 active:scale-95 transition-transform"
            title="Edit"
            onClick={() => onEdit(plan)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 active:scale-95 transition-transform"
            title={isActive ? "Deactivate" : "Activate"}
            onClick={() => onToggleStatus(plan)}
          >
            {isActive ? (
              <ToggleRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-zinc-400" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 active:scale-95 transition-transform"
            title={plan.isPopular ? "Remove popular" : "Mark popular"}
            onClick={() => onTogglePopular(plan)}
          >
            <Star
              className={cn(
                "w-3.5 h-3.5",
                plan.isPopular
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground",
              )}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 active:scale-95 transition-transform hover:text-destructive"
            title="Delete"
            onClick={() => onDelete(plan)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function PlanFormDialog({
  open,
  onClose,
  editPlan,
}: {
  open: boolean;
  onClose: () => void;
  editPlan: IPlan | null;
}) {
  const [createPlan, { isLoading: creating }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updating }] = useUpdatePlanMutation();
  const isEditing = !!editPlan;
  const isSubmitting = creating || updating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema as any),
    defaultValues: {
      name: "",
      slug: "",
      displayName: "",
      description: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      billingCycle: "MONTHLY",
      maxProducts: 0,
      storageGB: 0,
      monthlyRequests: 0,
      maxUsers: 1,
      sortOrder: 1,
      isPopular: false,
      status: "ACTIVE",
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const isPopularValue = watch("isPopular");
  const billingCycleValue = watch("billingCycle");
  const statusValue = watch("status");

  React.useEffect(() => {
    if (open) {
      if (editPlan) {
        reset({
          name: editPlan.name,
          slug: editPlan.slug,
          displayName: editPlan.displayName,
          description: editPlan.description,
          monthlyPrice: editPlan.monthlyPrice,
          yearlyPrice: editPlan.yearlyPrice ?? 0,
          billingCycle: editPlan.billingCycle,
          maxProducts: editPlan.maxProducts,
          storageGB: editPlan.storageGB,
          monthlyRequests: editPlan.monthlyRequests,
          maxUsers: editPlan.maxUsers,
          sortOrder: editPlan.sortOrder,
          isPopular: editPlan.isPopular,
          status: editPlan.status as "ACTIVE" | "INACTIVE",
          features: editPlan.features,
        });
      } else {
        reset();
      }
    }
  }, [open, editPlan, reset]);

  const onSubmit = async (values: PlanFormValues) => {
    try {
      if (isEditing && editPlan) {
        await updatePlan({ id: editPlan._id, data: values }).unwrap();
        toast.success(`Plan "${values.displayName}" updated`);
      } else {
        await createPlan(values).unwrap();
        toast.success(`Plan "${values.displayName}" created`);
      }
      onClose();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Something went wrong",
      );
    }
  };

  const autoSlug = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Plan" : "Create New Plan"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update plan details and limits."
              : "Fill in the details to create a new subscription plan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row: name + displayName */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-name">Internal Name</Label>
              <Input
                id="plan-name"
                placeholder="starter"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  if (!isEditing) {
                    setValue("slug", autoSlug(e.target.value), {
                      shouldValidate: true,
                    });
                  }
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-displayName">Display Name</Label>
              <Input
                id="plan-displayName"
                placeholder="Starter Plan"
                {...register("displayName")}
                className={errors.displayName ? "border-destructive" : ""}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive">
                  {errors.displayName.message}
                </p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="plan-slug">Slug</Label>
            <Input
              id="plan-slug"
              placeholder="starter-plan"
              {...register("slug")}
              className={errors.slug ? "border-destructive" : ""}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="plan-description">Description</Label>
            <Textarea
              id="plan-description"
              rows={2}
              placeholder="Plan description..."
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-monthlyPrice">Monthly Price ($)</Label>
              <Input
                id="plan-monthlyPrice"
                type="number"
                min={0}
                step={0.01}
                {...register("monthlyPrice")}
                className={errors.monthlyPrice ? "border-destructive" : ""}
              />
              {errors.monthlyPrice && (
                <p className="text-sm text-destructive">
                  {errors.monthlyPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-yearlyPrice">Yearly Price ($)</Label>
              <Input
                id="plan-yearlyPrice"
                type="number"
                min={0}
                step={0.01}
                {...register("yearlyPrice")}
                className={errors.yearlyPrice ? "border-destructive" : ""}
              />
              {errors.yearlyPrice && (
                <p className="text-sm text-destructive">
                  {errors.yearlyPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Billing Cycle</Label>
              <Select
                value={billingCycleValue}
                onValueChange={(v) =>
                  setValue("billingCycle", v as string, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  className={errors.billingCycle ? "border-destructive" : ""}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.billingCycle && (
                <p className="text-sm text-destructive">
                  {errors.billingCycle.message}
                </p>
              )}
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-4 gap-4">
            {(
              [
                { name: "maxProducts", label: "Max Products" },
                { name: "storageGB", label: "Storage (GB)" },
                { name: "monthlyRequests", label: "Monthly Requests" },
                { name: "maxUsers", label: "Max Users" },
              ] as const
            ).map(({ name, label }) => (
              <div key={name} className="space-y-1.5">
                <Label htmlFor={`plan-${name}`}>{label}</Label>
                <Input
                  id={`plan-${name}`}
                  type="number"
                  min={0}
                  {...register(name)}
                  className={errors[name] ? "border-destructive" : ""}
                />
                {errors[name] && (
                  <p className="text-sm text-destructive">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Sort + Status + isPopular */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="plan-sortOrder">Sort Order</Label>
              <Input
                id="plan-sortOrder"
                type="number"
                min={1}
                {...register("sortOrder")}
                className={errors.sortOrder ? "border-destructive" : ""}
              />
              {errors.sortOrder && (
                <p className="text-sm text-destructive">
                  {errors.sortOrder.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(v) =>
                  setValue("status", v as "ACTIVE" | "INACTIVE", {
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
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
              <Label>Mark as Popular</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch
                  checked={isPopularValue}
                  onCheckedChange={(v) =>
                    setValue("isPopular", v, { shouldValidate: true })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {isPopularValue ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs active:scale-95 transition-transform"
                onClick={() => append({ title: "" })}
              >
                <PlusCircle className="w-3 h-3 mr-1" />
                Add feature
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded-md">
                  No features yet. Click &quot;Add feature&quot; to add.
                </p>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      {...register(`features.${index}.title`)}
                      className={cn(
                        "h-8 text-sm",
                        errors.features?.[index]?.title
                          ? "border-destructive"
                          : "",
                      )}
                    />
                    {errors.features?.[index]?.title && (
                      <p className="text-xs text-destructive mt-0.5">
                        {errors.features[index]?.title?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 active:scale-95 transition-transform text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="active:scale-95 transition-transform"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="active:scale-95 transition-transform"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function PlansManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<IPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<IPlan | null>(null);

  const { data, isLoading, isError } = useGetAllPlansQuery({ limit: 100 });
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlanMutation, { isLoading: deleting }] = useDeletePlanMutation();

  const plans = useMemo(() => data?.data ?? [], [data]);

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchSearch =
        !search ||
        p.displayName.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [plans, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: plans.length,
      active: plans.filter((p) => p.status === "ACTIVE").length,
      inactive: plans.filter((p) => p.status === "INACTIVE").length,
      popular: plans.filter((p) => p.isPopular).length,
    }),
    [plans],
  );

  const handleToggleStatus = async (plan: IPlan) => {
    const newStatus = plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updatePlan({ id: plan._id, data: { status: newStatus } }).unwrap();
      toast.success(
        `Plan ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`,
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleTogglePopular = async (plan: IPlan) => {
    try {
      await updatePlan({
        id: plan._id,
        data: { isPopular: !plan.isPopular },
      }).unwrap();
      toast.success(
        plan.isPopular ? "Popular badge removed" : "Marked as popular",
      );
    } catch {
      toast.error("Failed to update plan");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletePlan) return;
    try {
      await deletePlanMutation(deletePlan._id).unwrap();
      toast.success(`Plan "${deletePlan.displayName}" deleted`);
      setDeletePlan(null);
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing Plans</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage subscription plans and pricing tiers
          </p>
        </div>
        <Button
          onClick={() => {
            setEditPlan(null);
            setFormOpen(true);
          }}
          className="active:scale-95 transition-transform gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Plans"
          value={stats.total}
          icon={Layers}
          accent="bg-indigo-500"
        />
        <StatCard
          label="Active Plans"
          value={stats.active}
          icon={PackageCheck}
          accent="bg-emerald-500"
        />
        <StatCard
          label="Inactive Plans"
          value={stats.inactive}
          icon={PackageX}
          accent="bg-zinc-500"
        />
        <StatCard
          label="Popular Plans"
          value={stats.popular}
          icon={TrendingUp}
          accent="bg-amber-500"
        />
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
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
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All Plans{" "}
            <span className="text-muted-foreground font-normal text-sm">
              ({filtered.length})
            </span>
          </CardTitle>
          <CardDescription>
            Click row actions to manage each plan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isError ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm">Failed to load plans. Please try again.</p>
            </div>
          ) : isLoading ? (
            <div className="px-5 py-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No plans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Plan
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pricing
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Limits
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Features
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((plan) => (
                    <PlanRow
                      key={plan._id}
                      plan={plan}
                      onEdit={(p) => {
                        setEditPlan(p);
                        setFormOpen(true);
                      }}
                      onDelete={(p) => setDeletePlan(p)}
                      onToggleStatus={handleToggleStatus}
                      onTogglePopular={handleTogglePopular}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit dialog */}
      <PlanFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editPlan={editPlan}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deletePlan}
        onOpenChange={(v) => !v && setDeletePlan(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletePlan?.displayName}</strong>? This action cannot be
              undone.
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
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
