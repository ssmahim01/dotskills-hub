import { cache } from "react";

export const getPublicPlans = cache(async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/public`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error("Failed to load plans", error);
    return [];
  }
});
