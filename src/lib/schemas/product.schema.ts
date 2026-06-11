import { z } from "zod";
import {
  PRODUCT_MAX_NAME_LENGTH,
  PRODUCT_MAX_DESCRIPTION_LENGTH,
  PRODUCT_MAX_SKU_LENGTH,
  LOW_STOCK_THRESHOLD_MIN,
  LOW_STOCK_THRESHOLD_MAX,
} from "@/lib/constants/product.constants";

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(
      PRODUCT_MAX_NAME_LENGTH,
      `Name must be at most ${PRODUCT_MAX_NAME_LENGTH} characters`,
    )
    .trim(),
  store: z.string({
    message: "Store is required",
  }),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .trim(),
  description: z
    .string()
    .max(
      PRODUCT_MAX_DESCRIPTION_LENGTH,
      `Description must be at most ${PRODUCT_MAX_DESCRIPTION_LENGTH} characters`,
    )
    .trim()
    .optional()
    .default(""),
  categoryId: z.string().min(1, "Category is required"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(
      PRODUCT_MAX_SKU_LENGTH,
      `SKU must be at most ${PRODUCT_MAX_SKU_LENGTH} characters`,
    )
    .trim()
    .toUpperCase(),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required")
    .default([]),
  costPrice: z
    .number()
    .min(0, "Cost price must be non-negative")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Cost price must have at most 2 decimal places",
    ),
  sellingPrice: z
    .number()
    .min(0, "Selling price must be non-negative")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Selling price must have at most 2 decimal places",
    ),
  discountPrice: z
    .number()
    .min(0, "Discount price must be non-negative")
    .refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val.toString()),
      "Discount price must have at most 2 decimal places",
    )
    .nullable()
    .optional()
    .default(null),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must be non-negative")
    .default(0),
  lowStockThreshold: z
    .number()
    .int("Low stock threshold must be an integer")
    .min(
      LOW_STOCK_THRESHOLD_MIN,
      `Low stock threshold must be at least ${LOW_STOCK_THRESHOLD_MIN}`,
    )
    .max(
      LOW_STOCK_THRESHOLD_MAX,
      `Low stock threshold must be at most ${LOW_STOCK_THRESHOLD_MAX}`,
    )
    .default(10),
  isFeatured: z.boolean().default(false),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
