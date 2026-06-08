import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PlanCardSkeleton({
  highlight = false,
}: {
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-8 flex flex-col gap-4",
        highlight
          ? "border-primary/30 bg-primary/5 md:scale-105"
          : "border-border bg-card",
      )}
    >
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-1/2 mt-2" />
      <Skeleton className="h-11 w-full mt-2" />
      <div className="space-y-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
