/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { subscriptionService } from "@/lib/services/subscription.service";
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
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";
import { Subscription } from "@/types/subscription.types";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [approvalForm, setApprovalForm] = useState({
    storeName: "",
    subdomain: "",
    package: "starter",
  });
  const [approvalErrors, setApprovalErrors] = useState<Record<string, string>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    subscriptionService.initialize();
    storeService.initialize();
    setTimeout(() => {
      setSubscriptions(subscriptionService.getAll());
      setIsLoading(false);
    }, 100);
  }, []);

  const handleApproveClick = (sub: Subscription) => {
    setSelectedSub(sub);
    setApprovalForm({
      storeName: sub.name,
      subdomain: sub.name.toLowerCase().replace(/\s+/g, "-"),
      package: sub.plan,
    });
    setApprovalErrors({});
    setApprovalDialogOpen(true);
  };

  const handleApproveSubmit = async () => {
    setApprovalErrors({});
    const newErrors: Record<string, string> = {};

    if (!approvalForm.storeName.trim())
      newErrors.storeName = "Store name is required";
    if (!approvalForm.subdomain.trim())
      newErrors.subdomain = "Subdomain is required";
    if (!/^[a-z0-9-]+$/.test(approvalForm.subdomain)) {
      newErrors.subdomain =
        "Subdomain can only contain lowercase letters, numbers, and hyphens";
    }
    if (!storeService.isSubdomainAvailable(approvalForm.subdomain)) {
      newErrors.subdomain = "This subdomain is already taken";
    }

    if (Object.keys(newErrors).length > 0) {
      setApprovalErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedSub) {
        const storeResult = storeService.create({
          storeName: approvalForm.storeName,
          subdomain: approvalForm.subdomain,
          ownerName: selectedSub.name,
          ownerEmail: selectedSub.email,
          phone: "+880000000000",
          package: approvalForm.package as
            | "starter"
            | "business"
            | "enterprise",
        });

        if (storeResult.success && storeResult.store) {
          const approved = subscriptionService.approve(selectedSub.id, "admin");
          if (approved) {
            const updateResult = storeService.update(storeResult.store.id, {
              subscriptionId: approved.id,
            });

            if (updateResult.success) {
              setSubscriptions(subscriptionService.getAll());
              setApprovalDialogOpen(false);
              toast.success(
                `Subscription approved for ${approvalForm.storeName}`,
              );
            } else {
              toast.error(
                updateResult.error || "Failed to link store with subscription",
              );
            }
          } else {
            toast.error("Failed to approve subscription");
          }
        } else {
          toast.error(storeResult.error || "Failed to create store");
        }
      }
    } catch (error) {
      toast.error("Failed to approve subscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = (sub: Subscription) => {
    subscriptionService.reject(sub.id, "admin");
    setSubscriptions(subscriptionService.getAll());
    toast.error(`Subscription rejected for ${sub.name}`);
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: Column<Subscription>[] = [
    {
      key: "name",
      label: "Subscriber Name",
      render: (sub) => <span className="font-medium">{sub.name}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (sub) => (
        <span className="text-muted-foreground">{sub.email}</span>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (sub) => (
        <Badge variant="outline" className="capitalize">
          {sub.plan}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (sub) => (
        <span className="font-semibold">{formatCurrency(sub.amount)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (sub) => (
        <Badge
          variant={
            sub.status === "pending"
              ? "outline"
              : sub.status === "approved"
                ? "default"
                : "destructive"
          }
          className="capitalize"
        >
          {sub.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (sub) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(sub.createdAt)}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (sub) => (
        <div className="flex gap-2">
          {sub?.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleApproveClick(sub)}
                className="transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(sub)}
                className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}
          {sub?.status !== "pending" && (
            <Badge
              variant={sub?.status === "approved" ? "default" : "destructive"}
            >
              {sub?.status === "approved" ? "Approved" : "Rejected"}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage and approve customer subscriptions
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Subscription
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search by name or email..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Subscription Requests ({filteredSubscriptions.length})
          </CardTitle>
          <CardDescription>
            {filterStatus === "pending" &&
              "Pending subscriptions awaiting approval"}
            {filterStatus === "approved" && "Approved subscriptions"}
            {filterStatus === "rejected" && "Rejected subscriptions"}
            {filterStatus === "all" && "All subscription requests"}
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
            <DataTable<Subscription>
              data={filteredSubscriptions}
              columns={columns}
            />
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Subscription</DialogTitle>
            <DialogDescription>
              Create a store for {selectedSub?.name}. Fill in the store details
              below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Store Name
              </label>
              <Input
                value={approvalForm.storeName}
                onChange={(e) =>
                  setApprovalForm({
                    ...approvalForm,
                    storeName: e.target.value,
                  })
                }
                className={approvalErrors.storeName ? "border-destructive" : ""}
              />
              {approvalErrors.storeName && (
                <p className="text-xs text-destructive mt-1">
                  {approvalErrors.storeName}
                </p>
              )}
            </div>

            {/* Subdomain */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Subdomain
              </label>
              <div className="flex gap-2">
                <Input
                  value={approvalForm.subdomain}
                  onChange={(e) =>
                    setApprovalForm({
                      ...approvalForm,
                      subdomain: e.target.value,
                    })
                  }
                  className={
                    approvalErrors.subdomain ? "border-destructive" : ""
                  }
                  placeholder="store-name"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap flex items-center">
                  .dotskills.shop
                </span>
              </div>
              {approvalErrors.subdomain && (
                <p className="text-xs text-destructive mt-1">
                  {approvalErrors.subdomain}
                </p>
              )}
            </div>

            {/* Package */}
            <div>
              <label className="text-sm font-medium text-foreground">
                Package
              </label>
              <select
                value={approvalForm.package}
                onChange={(e) =>
                  setApprovalForm({ ...approvalForm, package: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="starter">Starter - $29/month</option>
                <option value="business">Business - $99/month</option>
                <option value="enterprise">Enterprise - $299/month</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveSubmit}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Creating...
                </>
              ) : (
                "Approve & Create Store"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
