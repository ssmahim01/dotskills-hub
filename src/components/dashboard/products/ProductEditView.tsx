"use client";

import Link from "next/link";
import { Package, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import ProductForm, {
  type ProductFormInitialData,
} from "@/components/dashboard/products/ProductForm";
import { useGetSingleProductQuery } from "@/redux/features/Product/product.api";

export default function EditProductView({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  const product = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading product…</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-100 gap-3 text-red-500">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">
          {isError ? "Failed to load product." : "Product not found."}
        </span>
      </div>
    );
  }

  const initialData: ProductFormInitialData = {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    images: product.images ?? [],
    price: product.price,
    costPrice: product.costPrice,
    discountPrice: product.discountPrice ?? null,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold ?? 5,
    isFeatured: product.isFeatured ?? false,
    status: (product?.status as ProductFormInitialData["status"]) ?? "DRAFT",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page header ── */}
      <div className="border-b border-border bg-card sticky top-0 z-30">
        <div className="px-4 md:px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link
              href="/dashboard/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href={`/dashboard/products/${product.slug}`}
              className="hover:text-foreground transition-colors truncate max-w-50"
            >
              {product.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Edit</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Edit Product</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {product.name}
                <span className="ml-2 font-mono text-xs opacity-60">
                  {product.sku}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-350 mx-auto">
        <ProductForm
          mode="edit"
          initialData={initialData}
          redirectTo="/dashboard/products"
        />
      </div>
    </div>
  );
}
