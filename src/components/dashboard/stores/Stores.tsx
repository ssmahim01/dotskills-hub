/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { storeService } from "@/lib/services/store.service";
import { DataTable, Column } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";
import { Store } from "@/types/store.types";
import { Plus, Edit2, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editForm, setEditForm] = useState({
    storeName: "",
    customDomain: "",
    phone: "",
    status: "active" as "active" | "suspended" | "inactive" | "pending",
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    storeService.initialize();
    setTimeout(() => {
      setStores(storeService.getAll());
      setIsLoading(false);
    }, 100);
  }, []);

  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setEditForm({
      storeName: store.storeName,
      customDomain: store.customDomain || "",
      phone: store.phone,
      status: store.status,
    });
    setEditErrors({});
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    setEditErrors({});
    const newErrors: Record<string, string> = {};

    if (!editForm.storeName.trim())
      newErrors.storeName = "Store name is required";
    if (!editForm.phone.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setEditErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedStore) {
        const result = storeService.update(selectedStore.id, editForm);
        if (result.success) {
          setStores(storeService.getAll());
          setEditDialogOpen(false);
          toast.success(`Store "${editForm.storeName}" updated successfully`);
        } else {
          toast.error(result.error || "Failed to update store");
        }
      }
    } catch (error) {
      toast.error("Failed to update store");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = (store: Store) => {
    const newStatus = store.status === "active" ? "suspended" : "active";
    const result = storeService.update(store.id, { status: newStatus });
    if (result.success) {
      setStores(storeService.getAll());
      toast.success(
        `Store ${newStatus === "active" ? "activated" : "suspended"}`,
      );
    } else {
      toast.error(result.error || "Failed to update store status");
    }
  };

  const handleDeleteStore = (store: Store) => {
    if (confirm(`Are you sure you want to delete "${store.storeName}"?`)) {
      storeService.delete(store.id);
      setStores(storeService.getAll());
      toast.success("Store deleted");
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesStatus =
      filterStatus === "all" || store.status === filterStatus;
    const matchesSearch =
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: Column<Store>[] = [
    {
      key: "storeName",
      label: "Store Name",
      render: (store) => (
        <span className="font-semibold">{store.storeName}</span>
      ),
    },
    {
      key: "subdomain",
      label: "Domain",
      render: (store) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {store.subdomain}.dotskills.shop
        </code>
      ),
    },
    {
      key: "ownerName",
      label: "Owner",
      render: (store) => (
        <span className="text-muted-foreground">{store.ownerName}</span>
      ),
    },
    {
      key: "package",
      label: "Package",
      render: (store) => (
        <Badge variant="outline" className="capitalize">
          {store.package}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (store) => (
        <Badge
          variant={
            store.status === "active"
              ? "default"
              : store.status === "suspended"
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {store.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (store) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(store.createdAt)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (store) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(store)}
            className="transition-all duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleToggleStatus(store)}
            className="transition-all duration-200"
          >
            {store?.status === "active" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteStore(store)}
            className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stores</h1>
          <p className="text-muted-foreground">
            Manage all your e-commerce stores
          </p>
        </div>
        <Button className="transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          New Store
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by store name or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Stores</p>
              <p className="text-3xl font-bold">{stores.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Stores</p>
              <p className="text-3xl font-bold">
                {stores.filter((s) => s.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-3xl font-bold">
                {formatCurrency(
                  stores
                    .filter((s) => s.status === "active")
                    .reduce((sum, s) => {
                      const prices: Record<string, number> = {
                        starter: 29,
                        business: 99,
                        enterprise: 299,
                      };
                      return sum + (prices[s.package] || 0);
                    }, 0),
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Stores ({filteredStores.length})</CardTitle>
          <CardDescription>
            Manage your e-commerce stores and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <DataTable<Store> data={filteredStores} columns={columns} />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store details and settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Store Name
              </label>
              <Input
                value={editForm.storeName}
                onChange={(e) =>
                  setEditForm({ ...editForm, storeName: e.target.value })
                }
                className={editErrors.storeName ? "border-destructive" : ""}
              />
              {editErrors.storeName && (
                <p className="text-xs text-destructive mt-1">
                  {editErrors.storeName}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className={editErrors.phone ? "border-destructive" : ""}
              />
              {editErrors.phone && (
                <p className="text-xs text-destructive mt-1">
                  {editErrors.phone}
                </p>
              )}
            </div>

            {/* Custom Domain */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Custom Domain (Optional)
              </label>
              <Input
                value={editForm.customDomain}
                onChange={(e) =>
                  setEditForm({ ...editForm, customDomain: e.target.value })
                }
                placeholder="www.example.com"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
