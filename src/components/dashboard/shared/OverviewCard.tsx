import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
  description?: string;
}

export function OverviewCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
  description,
}: OverviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.direction === "up"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
        <p className="mt-2 text-lg font-medium text-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
