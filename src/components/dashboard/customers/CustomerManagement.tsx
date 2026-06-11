"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/shared/PageHeader";
import { ErrorState } from "@/components/dashboard/shared/ErrorState";
import {
  useGetAllCustomersQuery,
  useGetCustomerAnalyticsQuery,
  useActivateCustomerMutation,
  useBlockCustomerMutation,
  useMarkCustomerAsVIPMutation,
} from "@/redux/features/Customer/customer.api";
import { CustomerOverviewCards } from "./CustomerOverviewCards";
import { CustomerFilters } from "./CustomerFilters";
import { CustomerTable } from "./CustomerTable";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
// import { CUSTOMER_PAGINATION_LIMIT } from "@/lib/constants/customer.constants";
import type { ICustomer, CustomerStatus } from "@/types/customer.types";

export function CustomerManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "">("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // RTK Query hooks
  const {
    data: customersData,
    isLoading: customersLoading,
    isError: customersError,
    error: customersErrorObj,
  } = useGetAllCustomersQuery({
    // page: currentPage,
    // limit: CUSTOMER_PAGINATION_LIMIT,
    // search,
    // status: status || undefined,
    // sort: sortBy,
  });

  const { data: analyticsData, isLoading: analyticsLoading } =
    useGetCustomerAnalyticsQuery();

  const [activateCustomer] = useActivateCustomerMutation();
  const [blockCustomer] = useBlockCustomerMutation();
  const [markAsVIP] = useMarkCustomerAsVIPMutation();

  const customers = useMemo(() => {
    return customersData?.data || [];
  }, [customersData]);

  console.log(customersData);

  const totalPages = useMemo(() => {
    return customersData?.pagination?.pages || 1;
  }, [customersData]);

  const handleView = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDelete = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleActivate = async (customer: ICustomer) => {
    if (customer.status === "ACTIVE") return;
    setActionLoading((prev) => ({ ...prev, [customer._id]: true }));
    try {
      await activateCustomer(customer._id).unwrap();
    } catch (err) {
      console.error("Failed to activate customer:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [customer._id]: false }));
    }
  };

  const handleBlock = async (customer: ICustomer) => {
    setActionLoading((prev) => ({ ...prev, [customer._id]: true }));
    try {
      await blockCustomer(customer._id).unwrap();
    } catch (err) {
      console.error("Failed to block customer:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [customer._id]: false }));
    }
  };

  const handleToggleVIP = async (customer: ICustomer) => {
    setActionLoading((prev) => ({ ...prev, [customer._id]: true }));
    try {
      await markAsVIP(customer._id).unwrap();
    } catch (err) {
      console.error("Failed to update VIP status:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [customer._id]: false }));
    }
  };

  if (customersError) {
    return (
      <ErrorState
        title="Failed to load customers"
        description={
          customersErrorObj instanceof Error
            ? customersErrorObj.message
            : "An error occurred while loading customers. Please try again."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Customers"
          description="Manage your store customers, view their details, and track their order history"
          breadcrumbs={[{ label: "Customers", href: "/customers" }]}
        />
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <CustomerOverviewCards
        analytics={analyticsData?.data || null}
        isLoading={analyticsLoading}
      />

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6">
          <CustomerFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isLoading={customersLoading}
          />
        </div>

        <CustomerTable
          customers={customers}
          isLoading={customersLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onBlock={handleBlock}
          onToggleVIP={handleToggleVIP}
          actionLoading={actionLoading}
        />
      </div>

      <CreateCustomerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <EditCustomerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        customer={selectedCustomer}
      />
      <DeleteCustomerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customer={selectedCustomer}
      />
      <CustomerDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        customer={selectedCustomer}
        isLoading={false}
      />
    </div>
  );
}
