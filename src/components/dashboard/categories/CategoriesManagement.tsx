"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type {
  Category,
  CategoryStatus,
} from "@/types/category.types";
import {
 
  useActivateCategoryMutation,
 useGetMyCategoriesQuery,
  useInactivateCategoryMutation,
} from "@/redux/features/Category/category.api";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { CategoryFilters } from "./CategoryFilters";
import { CategoryTable } from "./CategoryTable";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ErrorState } from "@/components/dashboard/shared/ErrorState";

export function CategoriesManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | "all">(
    "all",
  );
  const [page, setPage] = useState(1);

  // Queries
  // const { data: stats } = useGetCategoryStatsQuery();
  // const queryParams: CategoryQueryParams = {
  //   page,
  //   limit: CATEGORY_DEFAULT_PAGE_SIZE,
  //   search: searchTerm || undefined,
  //   status: statusFilter,
  // };
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetMyCategoriesQuery({page, search: searchTerm || undefined});
  const [activateCategory] = useActivateCategoryMutation();
  const [inactivateCategory] = useInactivateCategoryMutation();

  // Handlers
  const handleCreateSuccess = () => {
    refetch();
    setPage(1);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleActivateCategory = async (category: Category) => {
    try {
      await activateCategory(category.id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to activate category:", err);
    }
  };

  const handleInactivateCategory = async (category: Category) => {
    try {
      await inactivateCategory(category.id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to inactivate category:", err);
    }
  };

  const handleDeleteSuccess = () => {
    refetch();
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPage(1);
  };

  if (error) {
    return (
      <ErrorState
        title="Failed to load categories"
        description="Please try again later"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage your product categories"
        breadcrumbs={[{ label: "Dashboard" }, { label: "Categories" }]}
        actions={
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        }
      />

      {/* Overview Cards */}
      {/* <div className="grid grid-cols-1 gap-4 px-8 sm:grid-cols-3">
        <OverviewCard
          label="Total Categories"
          value={stats?.totalCategories ?? 0}
          icon={Layers}
        />
        <OverviewCard
          label="Active Categories"
          value={stats?.activeCategories ?? 0}
          icon={Layers}
        />
        <OverviewCard
          label="Inactive Categories"
          value={stats?.inactiveCategories ?? 0}
          icon={Layers}
        />
      </div> */}

      {/* Filters */}
      <CategoryFilters
        searchTerm={searchTerm}
        status={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="rounded-lg border border-border bg-card px-8 py-6">
        <CategoryTable
          categories={categoriesData?.data ?? []}
          isLoading={isLoading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onActivate={handleActivateCategory}
          onInactivate={handleInactivateCategory}
        />
      </div>

      {/* Dialogs */}
      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <EditCategoryDialog
        open={editDialogOpen}
        category={selectedCategory}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        category={selectedCategory}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
