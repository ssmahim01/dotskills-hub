/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { Category } from "@/types/category.types";
import {
  UpdateCategorySchema,
  type UpdateCategoryInput,
} from "@/lib/schemas/category.schema";
import { useUpdateCategoryMutation } from "@/redux/features/Category/category.api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_STATUS_OPTIONS } from "@/lib/constants/category.constants";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

interface EditCategoryDialogProps {
  open: boolean;
  category?: Category;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditCategoryDialog({
  open,
  category,
  onOpenChange,
  onSuccess,
}: EditCategoryDialogProps) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const { data: myStore } = useGetMyStoreQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(UpdateCategorySchema as any),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      parentId: null,
      status: "ACTIVE",
      position: 0,
    },
  });

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId,
        status: category.status,
        position: category.position,
      });
    }
  }, [category, open, reset]);

  const onSubmit = async (data: UpdateCategoryInput) => {
    if (!category) return;
    try {
      const formData = new FormData();
      formData.append("name", data.name ?? "");
      formData.append("slug", data.slug ?? "");
      formData.append("description", data.description ?? "");
      formData.append("image", data.image ?? "");
      if (data.parentId !== null && data.parentId !== undefined) {
        formData.append("parentId", String(data.parentId));
      }
      formData.append("status", data.status as string);
      formData.append("position", String(data.position ?? 0));
      formData.append("store", myStore?.data?._id ?? "");

      await updateCategory({ id: category.id, data: formData }).unwrap();
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ec-name">Category Name</Label>
            <Input
              id="ec-name"
              placeholder="Enter category name"
              disabled={isLoading}
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ec-slug">Slug</Label>
            <Input
              id="ec-slug"
              placeholder="category-slug"
              disabled={isLoading}
              {...register("slug")}
              className={errors.slug ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly unique identifier
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ec-description">Description</Label>
            <Input
              id="ec-description"
              placeholder="Category description"
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
            <Label htmlFor="ec-image">Image URL</Label>
            <Input
              id="ec-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
              {...register("image")}
              className={errors.image ? "border-destructive" : ""}
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ec-position">Position</Label>
            <Input
              id="ec-position"
              type="number"
              min="0"
              disabled={isLoading}
              {...register("position", { valueAsNumber: true })}
              className={errors.position ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Display order in category list
            </p>
            {errors.position && (
              <p className="text-sm text-destructive">
                {errors.position.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ec-status">Status</Label>
            <Select
              defaultValue={category.status}
              onValueChange={(value) =>
                setValue("status", value as UpdateCategoryInput["status"], {
                  shouldValidate: true,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger
                id="ec-status"
                className={errors.status ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_STATUS_OPTIONS.map((option) => (
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
              Update Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
