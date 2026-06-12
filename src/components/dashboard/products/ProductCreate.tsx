"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import ProductForm from "./ProductForm";

export default function CreateProductView() {
  return (
    <div className="min-h-screen bg-background">
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
            <span className="text-foreground font-medium">Create Product</span>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Create Product
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add a new product to your store catalog
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6 max-w-350 mx-auto">
        <ProductForm mode="create" redirectTo="/dashboard/products" />
      </div>
    </div>
  );
}
