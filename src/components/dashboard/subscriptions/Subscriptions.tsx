"use client";

import React, { useState, useCallback } from "react";
import {
  useGetAllSubscriptionsQuery,
  useApproveSubscriptionMutation,
  useRejectSubscriptionMutation,
  useGetSingleSubscriptionQuery,
  ISubscription,
} from "@/redux/features/Subscription/subscription.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Clock,
  Ban,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Store,
  CreditCard,
  User,
  Calendar,
  Globe,
  Hash,
  Phone,
  Mail,
  Package,
  TrendingUp,
  Plus,
} from "lucide-react";

import { toast } from "sonner";
import Image from "next/image";
import { CreateSubscriptionDialog } from "./CreateSubscription";

type SubscriptionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

const STATUS_CONFIG: Record<
  SubscriptionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    icon: <Clock className="w-3 h-3" />,
    className:
      "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:bg-amber-950/40",
  },
  APPROVED: {
    label: "Approved",
    variant: "default",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className:
      "border-green-300 text-green-700 bg-green-50 dark:border-green-600 dark:text-green-400 dark:bg-green-950/40",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="w-3 h-3" />,
    className:
      "border-red-300 text-red-700 bg-red-50 dark:border-red-600 dark:text-red-400 dark:bg-red-950/40",
  },
  EXPIRED: {
    label: "Expired",
    variant: "secondary",
    icon: <AlertCircle className="w-3 h-3" />,
    className:
      "border-slate-300 text-slate-600 bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-900/40",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "secondary",
    icon: <Ban className="w-3 h-3" />,
    className:
      "border-slate-300 text-slate-500 bg-slate-50 dark:border-slate-600 dark:text-slate-500 dark:bg-slate-900/40",
  },
};

function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK: "Bank Transfer",
  MANUAL: "Manual",
};

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-5 pb-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface AnalyticsBarProps {
  data: ISubscription[];
  total: number;
}

function AnalyticsBar({ data, total }: AnalyticsBarProps) {
  const counts = data.reduce(
    (acc, s) => {
      const st = s.status as SubscriptionStatus;
      acc[st] = (acc[st] ?? 0) + 1;
      return acc;
    },
    {} as Record<SubscriptionStatus, number>,
  );

  const cards = [
    {
      label: "Total",
      value: total,
      icon: <Package className="w-4 h-4 text-muted-foreground" />,
    },
    {
      label: "Pending",
      value: counts.PENDING ?? 0,
      icon: <Clock className="w-4 h-4 text-amber-500" />,
    },
    {
      label: "Approved",
      value: counts.APPROVED ?? 0,
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    },
    {
      label: "Rejected",
      value: counts.REJECTED ?? 0,
      icon: <XCircle className="w-4 h-4 text-destructive" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-border/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {c.label}
              </p>
              {c.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SubscriptionDetailSheet({
  id,
  open,
  onClose,
  onApprove,
  onReject,
}: {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onApprove: (sub: ISubscription) => void;
  onReject: (sub: ISubscription) => void;
}) {
  const { data, isLoading } = useGetSingleSubscriptionQuery(id ?? "", {
    skip: !id,
  });

  const sub = data?.data;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg p-4 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-bold">
            Subscription Details
          </SheetTitle>
          <SheetDescription>
            Full information about this subscription request
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {sub && (
          <div className="space-y-6 pt-2">
            {/* Status */}
            <div className="flex items-center justify-between">
              <StatusBadge status={sub.status as SubscriptionStatus} />
              <span className="text-xs text-muted-foreground">
                {formatDate(sub.createdAt)}
              </span>
            </div>

            <Separator />

            {/* Owner Info */}
            <Section
              title="Owner Information"
              icon={<User className="w-4 h-4" />}
            >
              <DetailRow
                icon={<User className="w-3.5 h-3.5" />}
                label="Name"
                value={sub.ownerName}
              />
              <DetailRow
                icon={<Mail className="w-3.5 h-3.5" />}
                label="Email"
                value={sub.ownerEmail}
              />
              <DetailRow
                icon={<Phone className="w-3.5 h-3.5" />}
                label="Phone"
                value={sub.ownerPhone}
              />
            </Section>

            <Separator />

            {/* Store Info */}
            <Section
              title="Store Information"
              icon={<Store className="w-4 h-4" />}
            >
              <DetailRow
                icon={<Store className="w-3.5 h-3.5" />}
                label="Store Name"
                value={sub.storeName}
              />
              <DetailRow
                icon={<Globe className="w-3.5 h-3.5" />}
                label="Subdomain"
                value={`${sub.subdomain}.dotskillshub.com`}
              />
              {sub.customDomain && (
                <DetailRow
                  icon={<Globe className="w-3.5 h-3.5" />}
                  label="Custom Domain"
                  value={sub.customDomain}
                />
              )}
            </Section>

            <Separator />

            {/* Payment Info */}
            <Section
              title="Payment Information"
              icon={<CreditCard className="w-4 h-4" />}
            >
              <DetailRow
                icon={<Package className="w-3.5 h-3.5" />}
                label="Duration"
                value={`${sub.durationInMonths} month${sub.durationInMonths !== 1 ? "s" : ""}`}
              />
              <DetailRow
                icon={<CreditCard className="w-3.5 h-3.5" />}
                label="Method"
                value={
                  PAYMENT_METHOD_LABELS[sub.paymentMethod] ?? sub.paymentMethod
                }
              />
              <DetailRow
                icon={<Hash className="w-3.5 h-3.5" />}
                label="Transaction ID"
                value={sub.transactionId}
                mono
              />
              <DetailRow
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="Amount"
                value={formatCurrency(sub.amount)}
                highlight
              />
            </Section>

            {/* Payment Proof */}
            {sub.paymentProof && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Payment Proof
                  </p>
                  <a
                    href={sub.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border border-border hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={sub.paymentProof}
                      alt="Payment proof"
                      width={480}
                      height={300}
                      className="w-full object-cover max-h-52"
                    />
                  </a>
                </div>
              </>
            )}

            {/* Subscription dates (if approved) */}
            {(sub.startDate || sub.endDate) && (
              <>
                <Separator />
                <Section
                  title="Subscription Period"
                  icon={<Calendar className="w-4 h-4" />}
                >
                  {sub.startDate && (
                    <DetailRow
                      icon={<Calendar className="w-3.5 h-3.5" />}
                      label="Start Date"
                      value={formatDate(sub.startDate)}
                    />
                  )}
                  {sub.endDate && (
                    <DetailRow
                      icon={<Calendar className="w-3.5 h-3.5" />}
                      label="End Date"
                      value={formatDate(sub.endDate)}
                    />
                  )}
                </Section>
              </>
            )}

            {/* Rejection reason */}
            {sub.rejectionReason && (
              <>
                <Separator />
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    <span className="font-semibold">Rejection reason: </span>
                    {sub.rejectionReason}
                  </AlertDescription>
                </Alert>
              </>
            )}

            {/* Actions for PENDING */}
            {sub.status === "PENDING" && (
              <>
                <Separator />
                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      onClose();
                      onApprove(sub);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      onClose();
                      onReject(sub);
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="space-y-2 pl-1">{children}</div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className={`text-right break-all ${
          highlight
            ? "font-bold text-foreground"
            : mono
              ? "font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground"
              : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ApproveDialog({
  sub,
  open,
  onClose,
}: {
  sub: ISubscription | null;
  open: boolean;
  onClose: () => void;
}) {
  const [approve, { isLoading }] = useApproveSubscriptionMutation();

  const handleConfirm = async () => {
    if (!sub) return;
    try {
      await approve(sub._id).unwrap();
      toast.success(`Subscription approved for ${sub.ownerName}`);
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to approve subscription";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Approve Subscription
          </DialogTitle>
          <DialogDescription>
            You are about to approve the subscription for{" "}
            <span className="font-semibold text-foreground">
              {sub?.ownerName}
            </span>
            . Their role will be promoted to{" "}
            <span className="font-semibold text-foreground">Owner</span> and
            their store will be set up by the admin team.
          </DialogDescription>
        </DialogHeader>

        {sub && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm border border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Store Name</span>
              <span className="font-medium text-foreground">
                {sub.storeName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subdomain</span>
              <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded border border-border text-foreground">
                {sub.subdomain}.dotskillshub.com
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">
                {formatCurrency(sub.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="text-foreground">
                {sub.durationInMonths} month
                {sub.durationInMonths !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Approving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Approval
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TableSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-28" />
      </div>
    ))}
  </div>
);

function RejectDialog({
  sub,
  open,
  onClose,
}: {
  sub: ISubscription | null;
  open: boolean;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [reject, { isLoading }] = useRejectSubscriptionMutation();

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("A rejection reason is required");
      return;
    }
    if (!sub) return;
    try {
      await reject({ id: sub._id, rejectionReason: reason.trim() }).unwrap();
      toast.error(`Subscription rejected for ${sub.ownerName}`);
      handleClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to reject subscription";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            Reject Subscription
          </DialogTitle>
          <DialogDescription>
            Rejecting the subscription for{" "}
            <span className="font-semibold text-foreground">
              {sub?.ownerName}
            </span>
            . This action cannot be undone. Please provide a clear reason that
            will be shown to the user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">
            Rejection Reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="rejection-reason"
            placeholder="e.g. Payment proof is unclear. Please resubmit with a higher quality screenshot."
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            className={
              error ? "border-destructive focus-visible:ring-destructive" : ""
            }
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Rejecting…
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Confirm Rejection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAGE_SIZE = 10;

export default function Subscriptions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [approveSub, setApproveSub] = useState<ISubscription | null>(null);
  const [rejectSub, setRejectSub] = useState<ISubscription | null>(null);

  const queryParams: Record<string, string | number> = {
    page,
    limit: PAGE_SIZE,
  };
  if (search) queryParams.searchTerm = search;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllSubscriptionsQuery(queryParams);

  const subscriptions = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage ?? 1;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-6 p-1">
      {/* Page header */}
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Subscriptions
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Review, approve, and manage all subscription requests
          </p>

        </div>
         <div className="flex justify-between items-center gap-4">
           <Button
            onClick={() => setCreateOpen(true)}
            className="active:scale-95 hover:cursor-pointer transition-transform gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Subscription
          </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
         </div>
      </div>

      {/* Analytics */}
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <AnalyticsBar data={subscriptions} total={meta?.total ?? 0} />
      )}

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, email, phone, store, subdomain, transaction ID…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
              />
            </div>
            {STATUS_OPTIONS.map((o) => (
              <div key={o.label}>
                <Select
                  value={statusFilter}
                  onValueChange={() => handleStatusChange(o.value)}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button onClick={handleSearch} className="gap-2 shrink-0">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Subscription Requests
                {meta && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({meta.total} total)
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {statusFilter === "all"
                  ? "All subscription requests"
                  : `Filtered by: ${STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <AlertCircle className="w-10 h-10 text-destructive/70" />
              <p className="font-semibold text-foreground">
                Failed to load subscriptions
              </p>
              <p className="text-sm text-muted-foreground">
                Something went wrong. Try refreshing.
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="p-6">
              <TableSkeleton />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <Package className="w-10 h-10 text-muted-foreground/50" />
              <p className="font-semibold text-foreground">
                No subscriptions found
              </p>
              <p className="text-sm text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters or search term."
                  : "No subscription requests yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Owner",
                        "Store",
                        "Plan / Duration",
                        "Amount",
                        "Payment",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {subscriptions.map((sub) => (
                      <SubscriptionRow
                        key={sub._id}
                        sub={sub}
                        onView={() => setDetailId(sub._id)}
                        onApprove={() => setApproveSub(sub)}
                        onReject={() => setRejectSub(sub)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-border/60">
                {subscriptions.map((sub) => (
                  <MobileCard
                    key={sub._id}
                    sub={sub}
                    onView={() => setDetailId(sub._id)}
                    onApprove={() => setApproveSub(sub)}
                    onReject={() => setRejectSub(sub)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Page {page} of {totalPages} &nbsp;·&nbsp; {meta?.total}{" "}
                    total
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1 || isFetching}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages || isFetching}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <SubscriptionDetailSheet
        id={detailId}
        open={!!detailId}
        onClose={() => setDetailId(null)}
        onApprove={(sub) => setApproveSub(sub)}
        onReject={(sub) => setRejectSub(sub)}
      />

      <CreateSubscriptionDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ApproveDialog
        sub={approveSub}
        open={!!approveSub}
        onClose={() => setApproveSub(null)}
      />

      <RejectDialog
        sub={rejectSub}
        open={!!rejectSub}
        onClose={() => setRejectSub(null)}
      />
    </div>
  );
}

function SubscriptionRow({
  sub,
  onView,
  onApprove,
  onReject,
}: {
  sub: ISubscription;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <tr className="hover:bg-muted/20 transition-colors group">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-foreground leading-snug">
            {sub.ownerName}
          </p>
          <p className="text-xs text-muted-foreground">{sub.ownerEmail}</p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-foreground leading-snug">{sub.storeName}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {sub.subdomain}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-muted-foreground">
          {sub.durationInMonths}mo
        </div>
      </td>
      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
        {formatCurrency(sub.amount)}
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium text-foreground">
          {PAYMENT_METHOD_LABELS[sub.paymentMethod] ?? sub.paymentMethod}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={sub.status as SubscriptionStatus} />
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(sub.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onView}
            className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {sub.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={onApprove}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                title="Approve"
              >
                <CheckCircle2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onReject}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function MobileCard({
  sub,
  onView,
  onApprove,
  onReject,
}: {
  sub: ISubscription;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{sub.ownerName}</p>
          <p className="text-xs text-muted-foreground">{sub.ownerEmail}</p>
        </div>
        <StatusBadge status={sub.status as SubscriptionStatus} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <span className="text-muted-foreground">Store</span>
        <span className="text-foreground font-medium">{sub.storeName}</span>
        <span className="text-muted-foreground">Amount</span>
        <span className="text-foreground font-semibold">
          {formatCurrency(sub.amount)}
        </span>
        <span className="text-muted-foreground">Method</span>
        <span className="text-foreground">
          {PAYMENT_METHOD_LABELS[sub.paymentMethod] ?? sub.paymentMethod}
        </span>
        <span className="text-muted-foreground">Date</span>
        <span className="text-foreground">{formatDate(sub.createdAt)}</span>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onView}
          className="flex-1 gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </Button>
        {sub.status === "PENDING" && (
          <>
            <Button
              size="sm"
              onClick={onApprove}
              className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onReject}
              className="flex-1 gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
