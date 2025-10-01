import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, change, icon: Icon, trend = "neutral" }: MetricCardProps) {
  const isPositive = trend === "up" || change > 0;
  const isNegative = trend === "down" || change < 0;

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div
          className={cn(
            "text-sm font-semibold px-2 py-1 rounded-md",
            isPositive && "bg-success/10 text-success",
            isNegative && "bg-danger/10 text-danger",
            !isPositive && !isNegative && "bg-muted text-muted-foreground"
          )}
        >
          {change > 0 ? "+" : ""}{change.toFixed(2)}%
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-display font-bold">{value}</p>
      </div>
    </div>
  );
}
