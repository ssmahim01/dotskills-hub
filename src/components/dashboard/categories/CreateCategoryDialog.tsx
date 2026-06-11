/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCreateCategoryMutation } from "@/redux/features/Category/category.api";
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
import {
  CreateCategoryInput,
  CreateCategorySchema,
} from "@/lib/schemas/category.schema";
import { useGetMyStoreQuery } from "@/redux/features/Store/store.api";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const { data: myStore } = useGetMyStoreQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema as any),
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

  const onSubmit = async (data: CreateCategoryInput) => {
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

      await createCategory(formData).unwrap();
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new product category to your store
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cc-name">Category Name</Label>
            <Input
              id="cc-name"
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
            <Label htmlFor="cc-slug">Slug</Label>
            <Input
              id="cc-slug"
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
            <Label htmlFor="cc-description">Description</Label>
            <Input
              id="cc-description"
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
            <Label htmlFor="cc-image">Image URL</Label>
            <Input
              id="cc-image"
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
            <Label htmlFor="cc-position">Position</Label>
            <Input
              id="cc-position"
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
            <Label htmlFor="cc-status">Status</Label>
            <Select
              defaultValue="active"
              onValueChange={(value) =>
                setValue("status", value as CreateCategoryInput["status"], {
                  shouldValidate: true,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger
                id="cc-status"
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
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
