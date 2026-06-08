import { cache } from "react";

export const getPublicPlans = cache(async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plans/public`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  const data = await res.json();

  return data.data;
});