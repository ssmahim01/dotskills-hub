"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type {
  Product,
  ProductQueryParams,
  ProductStatus,
} from "@/types/product.types";
import { PRODUCT_DEFAULT_PAGE_SIZE } from "@/lib/constants/product.constants";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { CreateProductDialog } from "./CreateProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { ErrorState } from "@/components/dashboard/shared/ErrorState";
import {
  useActivateProductMutation,
  useArchiveProductMutation,
  useGetMyProductsQuery,
} from "@/redux/features/Product/product.api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProductManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const [featuredFilter, setFeaturedFilter] = useState<boolean | "all">("all");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const queryParams: ProductQueryParams = {
    page,
    limit: PRODUCT_DEFAULT_PAGE_SIZE,
    search: searchTerm || undefined,
    status: statusFilter,
    featured: featuredFilter,
  };
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetMyProductsQuery({});
  const [activateProduct] = useActivateProductMutation();
  const [archiveProduct] = useArchiveProductMutation();

  // Handlers
  const handleCreateSuccess = () => {
    refetch();
    setPage(1);
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/dashboard/products/edit/${product?._id ?? ""}`);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleActivateProduct = async (product: Product) => {
    try {
      await activateProduct(product?._id ?? "").unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to activate product:", err);
    }
  };

  const handleArchiveProduct = async (product: Product) => {
    try {
      await archiveProduct(product?._id ?? "").unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to archive product:", err);
    }
  };

  const handleDeleteSuccess = () => {
    refetch();
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setFeaturedFilter("all");
    setPage(1);
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load products"
        description="Please try again later"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your store's product catalog"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Products" }]}
        actions={
          <Link href={"/dashboard/products/create"}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </Link>
        }
      />

      {/* Overview Cards */}
      {/* <ProductOverviewCards stats={productsData} isLoading={isLoading} /> */}

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        status={statusFilter}
        featured={featuredFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onFeaturedChange={setFeaturedFilter}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="rounded-lg border border-border bg-card px-8 py-6">
        <ProductTable
          products={productsData?.data ?? []}
          isLoading={isLoading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onActivate={handleActivateProduct}
          onArchive={handleArchiveProduct}
        />
      </div>

      {/* Dialogs */}
      <CreateProductDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <EditProductDialog
        open={editDialogOpen}
        product={selectedProduct}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <DeleteProductDialog
        open={deleteDialogOpen}
        product={selectedProduct}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
