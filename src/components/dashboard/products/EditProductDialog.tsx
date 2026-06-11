/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types/product.types";
import {
  UpdateProductSchema,
  type UpdateProductInput,
} from "@/lib/schemas/product.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_STATUS_OPTIONS } from "@/lib/constants/product.constants";
import { useUpdateProductMutation } from "@/redux/features/Product/product.api";
import { useGetAllCategoriesQuery } from "@/redux/features/Category/category.api";
import { Category } from "@/types/category.types";

interface EditProductDialogProps {
  open: boolean;
  product?: Product;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditProductDialog({
  open,
  product,
  onOpenChange,
  onSuccess,
}: EditProductDialogProps) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ limit: 100 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(UpdateProductSchema as any),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      sku: "",
      images: [],
      costPrice: 0,
      sellingPrice: 0,
      discountPrice: null,
      stock: 0,
      lowStockThreshold: 10,
      isFeatured: false,
      status: "DRAFT",
    },
  });

  const isFeatured = watch("isFeatured");

  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        sku: product.sku,
        images: product.images,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        discountPrice: product.discountPrice,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isFeatured: product.isFeatured,
        status: product.status,
      });
    }
  }, [product, open, reset]);

  const onSubmit = async (data: UpdateProductInput) => {
    if (!product) return;

    try {
      const formData = new FormData();

      formData.append("name", data?.name ?? "");
      formData.append("slug", data.slug ?? "");
      formData.append("description", data.description ?? "");
      formData.append("category", data.categoryId ?? "");
      formData.append("sku", data.sku ?? "");

      formData.append("price", String(data.sellingPrice));

      formData.append("costPrice", String(data.costPrice));

      formData.append("stock", String(data.stock));

      formData.append("lowStockThreshold", String(data.lowStockThreshold));

      formData.append("isFeatured", String(data.isFeatured));

      formData.append("status", data.status ?? "");

      if (data.discountPrice !== null) {
        formData.append("discountPrice", String(data.discountPrice));
      }

      await updateProduct({
        id: product.id,
        data: formData,
      }).unwrap();

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 border-b border-border pb-6">
            <h3 className="font-semibold">Basic Information</h3>

            <div className="space-y-1.5">
              <Label htmlFor="ep-name">Product Name</Label>
              <Input
                id="ep-name"
                placeholder="Enter product name"
                disabled={isLoading}
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-slug">Slug</Label>
              <Input
                id="ep-slug"
                placeholder="product-slug"
                disabled={isLoading}
                {...register("slug")}
                className={errors.slug ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly unique identifier
              </p>
              {errors.slug && (
                <p className="text-sm text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-description">Description</Label>
              <Input
                id="ep-description"
                placeholder="Product description"
                disabled={isLoading}
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-category">Category</Label>
              <Select
                defaultValue={product.categoryId}
                onValueChange={(value: any) =>
                  setValue("categoryId", value, { shouldValidate: true })
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  id="ep-category"
                  className={errors.categoryId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-sku">SKU</Label>
              <Input
                id="ep-sku"
                placeholder="SKU-001"
                disabled={isLoading}
                {...register("sku")}
                className={errors.sku ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Stock Keeping Unit — must be unique
              </p>
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* ── Pricing & Inventory ────────────────────────────────────── */}
          <div className="space-y-4 border-b border-border pb-6">
            <h3 className="font-semibold">Pricing & Inventory</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ep-costPrice">Cost Price</Label>
                <Input
                  id="ep-costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  disabled={isLoading}
                  {...register("costPrice", { valueAsNumber: true })}
                  className={errors.costPrice ? "border-destructive" : ""}
                />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">
                    {errors.costPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ep-sellingPrice">Selling Price</Label>
                <Input
                  id="ep-sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  disabled={isLoading}
                  {...register("sellingPrice", { valueAsNumber: true })}
                  className={errors.sellingPrice ? "border-destructive" : ""}
                />
                {errors.sellingPrice && (
                  <p className="text-sm text-destructive">
                    {errors.sellingPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-discountPrice">
                Discount Price (Optional)
              </Label>
              <Input
                id="ep-discountPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                disabled={isLoading}
                {...register("discountPrice", {
                  setValueAs: (v) =>
                    v === "" || v === null ? null : parseFloat(v),
                })}
                className={errors.discountPrice ? "border-destructive" : ""}
              />
              {errors.discountPrice && (
                <p className="text-sm text-destructive">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ep-stock">Stock Quantity</Label>
                <Input
                  id="ep-stock"
                  type="number"
                  min="0"
                  disabled={isLoading}
                  {...register("stock", { valueAsNumber: true })}
                  className={errors.stock ? "border-destructive" : ""}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ep-lowStockThreshold">
                  Low Stock Threshold
                </Label>
                <Input
                  id="ep-lowStockThreshold"
                  type="number"
                  min="1"
                  disabled={isLoading}
                  {...register("lowStockThreshold", { valueAsNumber: true })}
                  className={
                    errors.lowStockThreshold ? "border-destructive" : ""
                  }
                />
                {errors.lowStockThreshold && (
                  <p className="text-sm text-destructive">
                    {errors.lowStockThreshold.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Settings ───────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h3 className="font-semibold">Settings</h3>

            {/* isFeatured checkbox */}
            <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="ep-isFeatured" className="cursor-pointer">
                  Featured Product
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display this product prominently in your store
                </p>
              </div>
              <Checkbox
                id="ep-isFeatured"
                checked={!!isFeatured}
                onCheckedChange={(checked) =>
                  setValue("isFeatured", !!checked, { shouldValidate: true })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ep-status">Status</Label>
              <Select
                defaultValue={product.status}
                onValueChange={(value) =>
                  setValue("status", value as UpdateProductInput["status"], {
                    shouldValidate: true,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger
                  id="ep-status"
                  className={errors.status ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
