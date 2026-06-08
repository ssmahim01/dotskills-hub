/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useGetSinglePlanQuery } from "@/redux/features/Plan/plan.api";
import { useCreateSubscriptionMutation } from "@/redux/features/Subscription/subscription.api";

const subscriptionSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerEmail: z.string().email("Enter a valid email address"),
  ownerPhone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be at most 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens",
    )
    .refine((v) => !v.startsWith("-") && !v.endsWith("-"), {
      message: "Subdomain cannot start or end with a hyphen",
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
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "BANK", "MANUAL"], {
    message: "Select a payment method",
  }),
  transactionId: z.string().min(4, "Transaction ID is required"),
  durationInMonths: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 month")
    .max(24, "Duration cannot exceed 24 months"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

const PAYMENT_METHODS = [
  { value: "BKASH", label: "bKash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "BANK", label: "Bank Transfer" },
  { value: "MANUAL", label: "Manual" },
] as const;

export default function SubscriptionApply() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: planData,
    isLoading: planLoading,
    isError: planError,
  } = useGetSinglePlanQuery(planId ?? "", { skip: !planId });

  const [createSubscription, { isLoading: submitting }] =
    useCreateSubscriptionMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema as any),
    defaultValues: {
      durationInMonths: 1,
    },
  });

  // Redirect if no planId
  useEffect(() => {
    if (!planId) {
      router.replace("/pricing");
    }
  }, [planId, router]);

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

  const onSubmit = async (values: SubscriptionFormValues) => {
    if (!paymentProof) {
      setProofError("Payment proof screenshot is required");
      return;
    }

    const plan = planData?.data;
    if (!plan) return;

    const amount =
      values.durationInMonths >= 12 && plan.yearlyPrice
        ? plan.yearlyPrice
        : plan.monthlyPrice * values.durationInMonths;

    const formData = new FormData();
    formData.append("paymentProof", paymentProof);
    formData.append("plan", plan._id);
    formData.append("amount", String(amount));

    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        formData.append(key, String(val));
      }
    });

    try {
      await createSubscription(formData).unwrap();
      setIsSuccess(true);
    } catch {
      // error rendered below
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            Subscription Submitted!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your subscription request has been received. Our team will review
            your payment and approve your account within 24 hours. You&apos;ll
            receive an email notification once approved.
          </p>
          <Button className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!planId) return null;

  const plan = planData?.data;
  const durationInMonths = watch("durationInMonths") ?? 1;
  const estimatedAmount = plan
    ? durationInMonths >= 12 && plan.yearlyPrice
      ? plan.yearlyPrice
      : plan.monthlyPrice * durationInMonths
    : 0;

  // {submitError && (
  //         <Alert variant="destructive">
  //           <AlertDescription>
  //             {(submitError as { data?: { message?: string } })?.data
  //               ?.message ?? "Something went wrong. Please try again."}
  //           </AlertDescription>
  //         </Alert>
  //       )}

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/pricing"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm font-medium text-foreground">
            Apply for Subscription
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Information */}
            <fieldset className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <legend className="text-base font-semibold text-foreground px-1">
                Business Information
              </legend>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="Owner Name"
                  error={errors.ownerName?.message}
                  required
                >
                  <Input placeholder="John Doe" {...register("ownerName")} />
                </Field>

                <Field
                  label="Owner Email"
                  error={errors.ownerEmail?.message}
                  required
                >
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...register("ownerEmail")}
                  />
                </Field>

                <Field
                  label="Phone Number"
                  error={errors.ownerPhone?.message}
                  required
                >
                  <Input
                    placeholder="01XXXXXXXXX"
                    {...register("ownerPhone")}
                  />
                </Field>

                <Field
                  label="Store Name"
                  error={errors.storeName?.message}
                  required
                >
                  <Input
                    placeholder="My Awesome Store"
                    {...register("storeName")}
                  />
                </Field>

                <Field
                  label="Subdomain"
                  error={errors.subdomain?.message}
                  hint="yourstore.dotskillshub.com"
                  required
                >
                  <div className="flex rounded-md overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring">
                    <Input
                      placeholder="yourstore"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                      {...register("subdomain")}
                    />
                    <span className="flex items-center px-3 bg-muted text-muted-foreground text-sm border-l border-input whitespace-nowrap">
                      .dotskillshub.com
                    </span>
                  </div>
                </Field>

                <Field
                  label="Custom Domain"
                  error={errors.customDomain?.message}
                  hint="Optional — e.g. mystore.com"
                >
                  <Input
                    placeholder="mystore.com"
                    {...register("customDomain")}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Payment Information */}
            <fieldset className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <legend className="text-base font-semibold text-foreground px-1">
                Payment Information
              </legend>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  label="Payment Method"
                  error={errors.paymentMethod?.message}
                  required
                >
                  <Select
                    onValueChange={(v) =>
                      setValue(
                        "paymentMethod",
                        v as SubscriptionFormValues["paymentMethod"],
                        { shouldValidate: true },
                      )
                    }
                  >
                    <SelectTrigger>
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
                </Field>

                <Field
                  label="Transaction ID"
                  error={errors.transactionId?.message}
                  required
                >
                  <Input
                    placeholder="TXN-XXXXXXXXXXXX"
                    {...register("transactionId")}
                  />
                </Field>

                <Field
                  label="Duration (months)"
                  error={errors.durationInMonths?.message}
                  required
                >
                  <Select
                    defaultValue="1"
                    onValueChange={(v) =>
                      setValue("durationInMonths", Number(v), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 3, 6, 12, 24].map((m) => (
                        <SelectItem key={m} value={String(m)}>
                          {m} {m === 1 ? "month" : "months"}
                          {m === 12 && plan?.yearlyPrice
                            ? " (annual — save!)"
                            : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Payment proof upload */}
              <Field
                label="Payment Proof Screenshot"
                error={proofError ?? undefined}
                required
              >
                {previewUrl ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-border">
                    <Image
                      src={previewUrl}
                      alt="Payment proof"
                      width={600}
                      height={300}
                      className="w-full object-cover max-h-48"
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
                    className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Upload className="w-8 h-8" />
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
              </Field>
            </fieldset>

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold text-base"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Subscription Request"
              )}
            </Button>
          </form>

          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground text-base">
                Order Summary
              </h2>

              {planLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              )}

              {planError && (
                <p className="text-sm text-destructive">
                  Failed to load plan details.{" "}
                  <Link href="/pricing" className="underline">
                    Go back
                  </Link>
                </p>
              )}

              {plan && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-lg">
                      {plan.displayName}
                    </span>
                    {plan.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <SummaryRow
                      label="Monthly Price"
                      value={formatCurrency(plan.monthlyPrice)}
                    />
                    <SummaryRow
                      label="Duration"
                      value={`${durationInMonths} month${durationInMonths !== 1 ? "s" : ""}`}
                    />
                    <Separator />
                    <SummaryRow
                      label="Total Due"
                      value={formatCurrency(estimatedAmount)}
                      highlight
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Plan includes
                    </p>
                    {plan.features.slice(0, 5).map((f, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-foreground"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        {f.title}
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{plan.features.length - 5} more features
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center px-2">
              Your subscription will be reviewed by our team within 24 hours
              after payment verification.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={
          highlight ? "font-semibold text-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          highlight
            ? "font-bold text-foreground text-base"
            : "text-foreground font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
