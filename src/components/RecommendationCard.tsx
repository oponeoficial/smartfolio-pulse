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
  targetPrice: number;
  stopLoss: number;
  entryPrices?: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

export function RecommendationCard({
  symbol,
  name,
  action,
  confidence,
  price,
  change,
  reason,
  targetPrice,
  stopLoss,
  entryPrices,
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
  
  const targetGain = ((targetPrice - price) / price) * 100;
  const stopLossPercent = ((stopLoss - price) / price) * 100;

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

      {entryPrices && (
        <div className="mb-4 p-4 bg-secondary/30 rounded-lg border border-gold/20">
          <p className="text-sm font-semibold mb-3 text-gold">Preços de Entrada Sugeridos</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">• Entrada 1 (conservador)</span>
              <span className="font-semibold text-success/70">R$ {entryPrices.conservative.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">• Entrada 2 (moderado)</span>
              <span className="font-semibold text-success">R$ {entryPrices.moderate.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">• Entrada 3 (agressivo)</span>
              <span className="font-semibold text-success/90">R$ {entryPrices.aggressive.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-secondary/50 rounded-lg border border-gold/20">
          <p className="text-xs text-muted-foreground mb-1">Preço Alvo</p>
          <p className="text-lg font-bold text-gold">R$ {targetPrice.toFixed(2)}</p>
          <p className={cn("text-xs font-semibold", targetGain > 0 ? "text-success" : "text-danger")}>
            {targetGain > 0 ? "+" : ""}{targetGain.toFixed(1)}%
          </p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg border border-gold/20">
          <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
          <p className="text-lg font-bold text-danger">R$ {stopLoss.toFixed(2)}</p>
          <p className={cn("text-xs font-semibold", stopLossPercent < 0 ? "text-danger" : "text-success")}>
            {stopLossPercent.toFixed(1)}%
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

      <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-gold/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>

      <Button variant={config.color as any} className="w-full">
        Aplicar à Carteira
      </Button>
    </div>
  );
}
