/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * ProductForm — single reusable component for both Create and Edit.
 *
 * Architecture:
 *  - mode="create" → no initialData, calls createProduct mutation
 *  - mode="edit"   → receives initialData + productId, calls updateProduct mutation
 *
 * Field alignment with backend product.model.ts:
 *   name, slug, sku, shortDescription, description, category,
 *   images (string[]), price, costPrice, discountPrice,
 *   stock, lowStockThreshold, isFeatured, status
 *
 * Image flow:
 *   1. User picks files → local blob previews shown immediately
 *   2. On submit → upload to Cloudinary → receive URL array
 *   3. URL array sent as JSON stringified "data" field in FormData
 *
 * Status enum matches backend exactly: DRAFT | ACTIVE | OUT_OF_STOCK | ARCHIVED
 */

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  Loader2,
  RefreshCw,
  ImageIcon,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Star,
  Package,
  DollarSign,
  Layers,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { uploadMultipleToCloudinary } from "@/utils/cloudinary";
import { useGetAllCategoriesQuery } from "@/redux/features/Category/category.api";
import { useCreateProductMutation, useUpdateProductMutation } from "@/redux/features/Product/product.api";
import { useGetMeQuery } from "@/redux/features/user/user.api";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

const ProductEditor = dynamic(
  () => import("@/components/dashboard/products/ProductEditor"),
  { ssr: false },
);

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", description: "Not visible to customers" },
  { value: "ACTIVE", label: "Active", description: "Live and purchasable" },
  { value: "OUT_OF_STOCK", label: "Out of Stock", description: "Visible but not purchasable" },
  { value: "ARCHIVED", label: "Archived", description: "Hidden from all listings" },
] as const;

export type ProductStatusValue = (typeof STATUS_OPTIONS)[number]["value"];

function generateSku(name = "") {
  const prefix = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const suffix = Date.now().toString(36).toUpperCase().slice(-5);
  return `${prefix}-${suffix}`;
}

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  shortDescription: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  costPrice: z.coerce.number().min(0).optional(),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock must be ≥ 0"),
  lowStockThreshold: z.coerce.number().int().min(1).default(5),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE", "OUT_OF_STOCK", "ARCHIVED"]),
  newImages: z.array(z.instanceof(File)).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export interface ProductFormInitialData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string | { _id: string; title?: string; name?: string };
  shortDescription?: string;
  description: string;
  images: string[];
  price: number;
  costPrice?: number;
  discountPrice?: number | null;
  stock: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  status: ProductStatusValue;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initialData?: ProductFormInitialData;
  redirectTo?: string;
}

function Section({
  title,
  description,
  icon: Icon,
  children,
  accent,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl", accent ?? "bg-primary/10")}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
        <span className="text-xs text-muted-foreground">
          Uploading images… {progress}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ImageThumb({
  src,
  index,
  badge,
  disabled,
  onRemove,
}: {
  src: string;
  index: number;
  badge: string;
  disabled?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden border border-border/60 hover:border-primary/40 bg-muted transition-all duration-200">
      <Image
        src={src}
        alt={`product-${badge}-${index + 1}`}
        fill
        sizes="120px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Index badge */}
      <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
        {badge}{index + 1}
      </div>
      {/* Remove overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 active:scale-90 disabled:pointer-events-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ProductForm({
  mode,
  initialData,
  redirectTo,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const { data: user } = useGetMeQuery(undefined);
  const { data: myStore } = useGetMyStoreQuery();
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const isSubmitting = creating || updating;
  const role = user?.data?.role;
  const categories = categoriesData?.data ?? [];

  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema as any),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      sku: initialData?.sku ?? "",
      category:
        typeof initialData?.category === "object"
          ? (initialData.category as any)._id ?? ""
          : initialData?.category ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      costPrice: initialData?.costPrice ?? 0,
      discountPrice: initialData?.discountPrice ?? null,
      stock: initialData?.stock ?? 0,
      lowStockThreshold: initialData?.lowStockThreshold ?? 5,
      isFeatured: initialData?.isFeatured ?? false,
      status: initialData?.status ?? "DRAFT",
    },
  });

  const nameValue = watch("name");
  const slugValue = watch("slug");
  const isFeatured = watch("isFeatured");
  const statusValue = watch("status");

  useEffect(() => {
    if (!isEdit && nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: false });
    }
  }, [nameValue, isEdit, setValue]);

  useEffect(() => {
    if (initialData?.images) {
      setExistingImages(initialData.images);
    }
  }, [initialData]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const total = existingImages.length + newFiles.length + files.length;
    if (total > 10) {
      toast.error("Maximum 10 images total");
      return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExisting = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalImages = existingImages.length + newFiles.length;

  const onSubmit = async (values: ProductFormValues) => {
    if (totalImages === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadMultipleToCloudinary(newFiles);
      }
      setUploadProgress(60);

      const allImages = [...existingImages, ...uploadedUrls];

      const payload: Record<string, any> = {
        name: values.name,
        slug: values.slug,
        sku: values.sku,
        category: values.category,
        shortDescription: values.shortDescription ?? "",
        description: values.description,
        images: allImages,
        price: values.price,
        costPrice: values.costPrice ?? 0,
        discountPrice: values.discountPrice ?? 0,
        stock: values.stock,
        lowStockThreshold: values.lowStockThreshold,
        isFeatured: values.isFeatured,
        status: values.status,
      };

      if (myStore?.data?._id) {
        payload.store = myStore.data._id;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      setUploadProgress(80);

      if (isEdit && initialData?._id) {
        await updateProduct({ id: initialData._id, data: formData }).unwrap();
        toast.success(`"${values.name}" updated successfully`);
      } else {
        await createProduct(formData).unwrap();
        toast.success(`"${values.name}" created successfully`);
      }

      setUploadProgress(100);
      router.push(redirectTo ?? "/dashboard/products");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Something went wrong");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <Section
            title="Basic Information"
            description="Core product identity visible to customers"
            icon={Package}
            accent="bg-indigo-50 dark:bg-indigo-900/20"
          >
            <Field label="Product Name" error={errors.name?.message} required>
              <Input
                {...register("name")}
                placeholder="e.g. Premium Wireless Headphones"
                className={errors.name ? "border-destructive" : ""}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Slug"
                error={errors.slug?.message}
                hint="Auto-generated from name"
                required
              >
                <div className="flex gap-2">
                  <Input
                    {...register("slug")}
                    placeholder="product-slug"
                    className={cn(
                      "font-mono text-sm",
                      errors.slug ? "border-destructive" : "",
                    )}
                  />
                </div>
              </Field>

              <Field label="SKU" error={errors.sku?.message} required>
                <div className="flex gap-2">
                  <Input
                    {...register("sku")}
                    placeholder="SKU-XXXXX"
                    className={cn(
                      "font-mono text-sm",
                      errors.sku ? "border-destructive" : "",
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0 active:scale-95 transition-transform"
                    title="Generate SKU"
                    onClick={() =>
                      setValue("sku", generateSku(nameValue), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Field>
            </div>

            <Field
              label="Category"
              error={errors.category?.message}
              required
            >
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={errors.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c: any) => (
                        <SelectItem
                          key={c._id ?? c.id}
                          value={c._id ?? c.id}
                        >
                          {c.title ?? c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Short Description"
              hint="One-liner shown in product cards (optional)"
            >
              <Textarea
                {...register("shortDescription")}
                rows={2}
                placeholder="Brief summary of the product"
                className="resize-none"
              />
            </Field>
          </Section>

          {/* Description */}
          <Section
            title="Product Description"
            description="Detailed rich-text description rendered on the product page"
            icon={Layers}
            accent="bg-violet-50 dark:bg-violet-900/20"
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <ProductEditor
                  content={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </Section>

          {/* Images */}
          <Section
            title="Product Images"
            description={`${totalImages} / 10 images · First image is the cover`}
            icon={ImageIcon}
            accent="bg-sky-50 dark:bg-sky-900/20"
          >
            {/* Drop zone */}
            <label
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
                totalImages >= 10
                  ? "border-muted-foreground/20 opacity-50 pointer-events-none"
                  : "border-primary/25 hover:border-primary/60 hover:bg-primary/3",
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {totalImages >= 10
                    ? "Maximum images reached"
                    : "Drop images or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PNG, JPG, WebP · up to 10 images · max 10 MB each
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploading || totalImages >= 10}
                onChange={handleFilePick}
              />
            </label>

            {/* Upload progress */}
            {uploading && newFiles.length > 0 && (
              <UploadProgress progress={uploadProgress} />
            )}

            {/* Existing images grid */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Existing images ({existingImages.length})
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                  {existingImages.map((src, idx) => (
                    <ImageThumb
                      key={`existing-${idx}`}
                      src={src}
                      index={idx}
                      badge="E"
                      disabled={uploading}
                      onRemove={() => removeExisting(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* New images grid */}
            {newPreviews.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  New images ({newPreviews.length})
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                  {newPreviews.map((src, idx) => (
                    <ImageThumb
                      key={`new-${idx}`}
                      src={src}
                      index={idx}
                      badge="N"
                      disabled={uploading}
                      onRemove={() => removeNew(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalImages === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                No images added yet
              </p>
            )}
          </Section>
        </div>

        {/* ── RIGHT COLUMN (sidebar) ── 1/3 width on xl */}
        <div className="space-y-6">
          {/* Pricing */}
          <Section
            title="Pricing"
            description="Prices are stored in the base currency"
            icon={DollarSign}
            accent="bg-emerald-50 dark:bg-emerald-900/20"
          >
            <Field label="Selling Price" error={errors.price?.message} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  min={0}
                  className={cn("pl-7", errors.price ? "border-destructive" : "")}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </Field>

            <Field
              label="Discount Price"
              error={errors.discountPrice?.message}
              hint="Leave empty or 0 for no discount"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  {...register("discountPrice")}
                  type="number"
                  step="0.01"
                  min={0}
                  className="pl-7"
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>
            </Field>

            {/* Cost price only shown for ADMIN */}
            {role === "ADMIN" && (
              <Field
                label="Cost Price"
                error={errors.costPrice?.message}
                hint="Internal cost — not shown to customers"
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    {...register("costPrice")}
                    type="number"
                    step="0.01"
                    min={0}
                    className="pl-7"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>
              </Field>
            )}
          </Section>

          {/* Inventory */}
          <Section
            title="Inventory"
            description="Stock levels and alerts"
            icon={Layers}
            accent="bg-amber-50 dark:bg-amber-900/20"
          >
            <Field
              label="Stock Quantity"
              error={errors.stock?.message}
              required
            >
              <Input
                {...register("stock")}
                type="number"
                min={0}
                className={errors.stock ? "border-destructive" : ""}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </Field>

            <Field
              label="Low Stock Threshold"
              error={errors.lowStockThreshold?.message}
              hint="Alert triggers when stock falls to this level"
            >
              <Input
                {...register("lowStockThreshold")}
                type="number"
                min={1}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </Field>

            {/* Live stock preview */}
            {(() => {
              const s = Number(watch("stock") ?? 0);
              const t = Number(watch("lowStockThreshold") ?? 5);
              if (s === 0)
                return (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800 px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="text-xs text-red-600 dark:text-red-400">
                      Out of stock
                    </span>
                  </div>
                );
              if (s <= t)
                return (
                  <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-800 px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Low stock warning
                    </span>
                  </div>
                );
              return (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800 px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    In stock
                  </span>
                </div>
              );
            })()}
          </Section>

          {/* Status & Visibility */}
          <Section
            title="Status & Visibility"
            icon={Tag}
            accent="bg-rose-50 dark:bg-rose-900/20"
          >
            <Field label="Status" error={errors.status?.message} required>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={errors.status ? "border-destructive" : ""}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div>
                            <p className="text-sm font-medium">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {opt.description}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {/* Current status pill */}
              <div className="mt-2">
                {statusValue === "ACTIVE" && (
                  <Badge className="text-xs gap-1 bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">
                    <CheckCircle2 className="w-3 h-3" /> Live
                  </Badge>
                )}
                {statusValue === "DRAFT" && (
                  <Badge className="text-xs gap-1 bg-zinc-100 text-zinc-600 border-zinc-200" variant="outline">
                    Draft
                  </Badge>
                )}
                {statusValue === "OUT_OF_STOCK" && (
                  <Badge className="text-xs gap-1 bg-amber-50 text-amber-700 border-amber-200" variant="outline">
                    <AlertCircle className="w-3 h-3" /> Out of stock
                  </Badge>
                )}
                {statusValue === "ARCHIVED" && (
                  <Badge className="text-xs gap-1 bg-red-50 text-red-700 border-red-200" variant="outline">
                    Archived
                  </Badge>
                )}
              </div>
            </Field>

            <Separator />

            {/* Featured toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Featured product
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Shown in featured sections
                </p>
              </div>
              <Controller
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </Section>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 mx-0 bg-background/80 backdrop-blur border-t border-border px-0 py-4 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting || uploading}
          className="active:scale-95 transition-transform gap-1.5"
        >
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          {/* Summary */}
          <p className="text-xs text-muted-foreground hidden sm:block">
            {totalImages} image{totalImages !== 1 ? "s" : ""} ·{" "}
            {isFeatured ? "Featured · " : ""}
            {statusValue}
          </p>

          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="gap-2 active:scale-95 transition-transform min-w-32"
          >
            {isSubmitting || uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? `Uploading… ${uploadProgress}%` : "Saving…"}
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                {isEdit ? "Save Changes" : "Create Product"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}