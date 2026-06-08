"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const DEFAULT_REDIRECT = "/dashboard";

export function buildPlanAuthUrl(planId: string): string {
  const destination = `/subscription/apply?planId=${planId}`;
  return `/login?redirect=${encodeURIComponent(destination)}`;
}

export function useAuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getRedirectUrl = useCallback((): string => {
    return searchParams.get("redirect") ?? DEFAULT_REDIRECT;
  }, [searchParams]);

  const redirectAfterAuth = useCallback(() => {
    const url = getRedirectUrl();
    router.push(url);
  }, [router, getRedirectUrl]);

  return {
    getRedirectUrl,
    redirectAfterAuth,
  };
}