import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  symbol: string;
  name: string;
  action: "buy" | "sell" | "hold";
  confidence: number;
  price: number;
  change: number;
  reason: string;
}

export function RecommendationCard({
  symbol,
  name,
  action,
  confidence,
  price,
  change,
  reason,
}: RecommendationCardProps) {
  const actionConfig = {
    buy: {
      label: "COMPRAR",
      color: "success",
      icon: TrendingUp,
      gradient: "bg-gradient-success",
    },
    sell: {
      label: "VENDER",
      color: "danger",
      icon: TrendingDown,
      gradient: "bg-gradient-danger",
    },
    hold: {
      label: "MANTER",
      color: "warning",
      icon: Minus,
      gradient: "bg-gradient-primary",
    },
  };

  const config = actionConfig[action];
  const ActionIcon = config.icon;

  return (
    <div className="glass-card p-6 hover-scale">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-xl font-bold">{symbol}</h3>
            <div className={cn("p-1 rounded-md", `bg-${config.color}/10`)}>
              <ActionIcon className={cn("w-4 h-4", `text-${config.color}`)} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-display font-bold">${price.toFixed(2)}</p>
          <p
            className={cn(
              "text-sm font-semibold",
              change > 0 ? "text-success" : "text-danger"
            )}
          >
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Confiança IA</span>
          <span className="text-sm font-semibold">{confidence}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", config.gradient)}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>

      <Button variant={config.color as any} className="w-full">
        {config.label}
      </Button>
    </div>
  );
}
