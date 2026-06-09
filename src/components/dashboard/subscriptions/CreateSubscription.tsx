/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateSubscriptionMutation } from "@/redux/features/Subscription/subscription.api";
import { useGetPublicPlansQuery } from "@/redux/features/Plan/plan.api";
import { toast } from "sonner";

const createSubscriptionSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerEmail: z.string().email("Enter a valid email address"),
  ownerPhone: z
    .string()
    .min(11, "Phone must be at least 11 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be at most 30 characters")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only")
    .refine((v) => !v.startsWith("-") && !v.endsWith("-"), {
      message: "Cannot start or end with a hyphen",
    }),
  customDomain: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
          v,
        ),
      { message: "Enter a valid domain (e.g. mystore.com)" },
    ),
  plan: z.string().min(1, "Select a plan"),
  amount: z.coerce.number().min(1, "Amount is required"),
  durationInMonths: z.coerce
    .number()
    .int()
    .min(1, "At least 1 month")
    .max(24, "Maximum 24 months"),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK", "MANUAL"], {
    error: "Select a payment method",
  }),
  transactionId: z.string().min(4, "Transaction ID is required"),
});

type CreateSubscriptionValues = z.infer<typeof createSubscriptionSchema>;

const PAYMENT_METHODS = [
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "MANUAL", label: "Manual" },
] as const;

const DURATION_OPTIONS = [1, 3, 6, 12, 24];

interface CreateSubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateSubscriptionDialog({
  open,
  onClose,
}: CreateSubscriptionDialogProps) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const { data: plansData, isLoading: plansLoading } = useGetPublicPlansQuery();
  const plans = plansData?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CreateSubscriptionValues>({
    resolver: zodResolver(createSubscriptionSchema as any),
    defaultValues: { durationInMonths: 1 },
  });

  const selectedPlanId = watch("plan");
  const selectedPlan = plans.find((p) => p._id === selectedPlanId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProofError("Only image files are accepted");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProofError("Image must be smaller than 5 MB");
      return;
    }
    setProofError(null);
    setPaymentProof(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    setPaymentProof(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    removeFile();
    setProofError(null);
    onClose();
  };

  const onSubmit = async (values: CreateSubscriptionValues) => {
    if (!paymentProof) {
      setProofError("Payment proof screenshot is required");
      return;
    }

    const formData = new FormData();

    formData.append("paymentProof", paymentProof);

    // Append all other fields as strings
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        formData.append(key, String(val));
      }
    });

    try {
      await createSubscription(formData).unwrap();
      toast.success("Subscription created successfully");
      handleClose();
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to create subscription",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Subscription
          </DialogTitle>
          <DialogDescription>
            Manually create a subscription on behalf of a user. All fields are
            required unless marked optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Owner Information */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-2 w-full">
              Owner Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cs-ownerName">
                  Owner Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-ownerName"
                  placeholder="John Doe"
                  {...register("ownerName")}
                  className={errors.ownerName ? "border-destructive" : ""}
                />
                {errors.ownerName && (
                  <p className="text-xs text-destructive">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cs-ownerEmail">
                  Owner Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-ownerEmail"
                  type="email"
                  placeholder="john@example.com"
                  {...register("ownerEmail")}
                  className={errors.ownerEmail ? "border-destructive" : ""}
                />
                {errors.ownerEmail && (
                  <p className="text-xs text-destructive">
                    {errors.ownerEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cs-ownerPhone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-ownerPhone"
                  placeholder="01XXXXXXXXX"
                  {...register("ownerPhone")}
                  type="number"
                  className={errors.ownerPhone ? "border-destructive" : ""}
                />
                {errors.ownerPhone && (
                  <p className="text-xs text-destructive">
                    {errors.ownerPhone.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Store Information */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-2 w-full">
              Store Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cs-storeName">
                  Store Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-storeName"
                  placeholder="My Awesome Store"
                  {...register("storeName")}
                  className={errors.storeName ? "border-destructive" : ""}
                />
                {errors.storeName && (
                  <p className="text-xs text-destructive">
                    {errors.storeName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cs-subdomain">
                  Subdomain <span className="text-destructive">*</span>
                </Label>
                <div className="flex rounded-md overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0">
                  <Input
                    id="cs-subdomain"
                    placeholder="yourstore"
                    {...register("subdomain")}
                    className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none ${errors.subdomain ? "border-destructive" : ""}`}
                  />
                  <span className="flex items-center px-2.5 bg-muted text-muted-foreground text-xs border-l border-input whitespace-nowrap">
                    .dotskillshub.com
                  </span>
                </div>
                {errors.subdomain && (
                  <p className="text-xs text-destructive">
                    {errors.subdomain.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cs-customDomain">
                  Custom Domain (optional)
                </Label>
                <Input
                  id="cs-customDomain"
                  placeholder="mystore.com"
                  {...register("customDomain")}
                  className={errors.customDomain ? "border-destructive" : ""}
                />
                {errors.customDomain && (
                  <p className="text-xs text-destructive">
                    {errors.customDomain.message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Plan & Payment */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-2 w-full">
              Plan & Payment
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Plan */}
              <div className="space-y-1.5">
                <Label htmlFor="cs-plan">
                  Plan <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(v: any) => {
                    setValue("plan", v, { shouldValidate: true });
                    // Auto-fill amount from plan's monthly price
                    const plan = plans.find((p) => p._id === v);
                    if (plan)
                      setValue("amount", plan.monthlyPrice, {
                        shouldValidate: true,
                      });
                  }}
                  disabled={plansLoading}
                >
                  <SelectTrigger
                    id="cs-plan"
                    className={errors.plan ? "border-destructive" : ""}
                  >
                    <SelectValue
                      placeholder={plansLoading ? "Loading…" : "Select plan"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.plan && (
                  <p className="text-xs text-destructive">
                    {errors.plan.message}
                  </p>
                )}
                {selectedPlan && (
                  <p className="text-xs text-muted-foreground">
                    Monthly: ৳{selectedPlan.monthlyPrice.toLocaleString()}
                    {selectedPlan.yearlyPrice
                      ? ` · Yearly: ৳${selectedPlan.yearlyPrice.toLocaleString()}`
                      : ""}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <Label htmlFor="cs-duration">
                  Duration <span className="text-destructive">*</span>
                </Label>
                <Select
                  defaultValue="1"
                  onValueChange={(v) =>
                    setValue("durationInMonths", Number(v), {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    id="cs-duration"
                    className={
                      errors.durationInMonths ? "border-destructive" : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {m} month{m !== 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.durationInMonths && (
                  <p className="text-xs text-destructive">
                    {errors.durationInMonths.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="cs-amount">
                  Amount (BDT) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-amount"
                  type="number"
                  min={1}
                  placeholder="0"
                  {...register("amount")}
                  className={errors.amount ? "border-destructive" : ""}
                />
                {errors.amount && (
                  <p className="text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <Label htmlFor="cs-paymentMethod">
                  Payment Method <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(v) =>
                    setValue(
                      "paymentMethod",
                      v as CreateSubscriptionValues["paymentMethod"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger
                    id="cs-paymentMethod"
                    className={errors.paymentMethod ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && (
                  <p className="text-xs text-destructive">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              {/* Transaction ID */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cs-transactionId">
                  Transaction ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cs-transactionId"
                  placeholder="TXN-XXXXXXXXXXXX"
                  {...register("transactionId")}
                  className={errors.transactionId ? "border-destructive" : ""}
                />
                {errors.transactionId && (
                  <p className="text-xs text-destructive">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>

              {/* Payment Proof upload */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>
                  Payment Proof Screenshot{" "}
                  <span className="text-destructive">*</span>
                </Label>

                {previewUrl ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-border">
                    <Image
                      src={previewUrl}
                      alt="Payment proof"
                      width={600}
                      height={200}
                      className="w-full object-cover max-h-40"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm font-medium">
                      Click to upload screenshot
                    </span>
                    <span className="text-xs">PNG, JPG up to 5 MB</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {proofError && (
                  <p className="text-xs text-destructive">{proofError}</p>
                )}
              </div>
            </div>
          </fieldset>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 min-w-32"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Subscription
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
