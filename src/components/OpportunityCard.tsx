import { TrendingUp, Sparkles, Target, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfidenceZones } from "./ConfidenceZones";
import { VisualMeter } from "./VisualMeter";

interface OpportunityCardProps {
  symbol: string;
  name: string;
  category: "growth" | "dividends" | "rare";
  confidence: number;
  price: number;
  change: number;
  story: string;
  targetPrice: number;
  stopLoss: number;
  confidenceZones: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

export function OpportunityCard({
  symbol,
  name,
  category,
  confidence,
  price,
  change,
  story,
  targetPrice,
  stopLoss,
  confidenceZones,
}: OpportunityCardProps) {
  const categoryConfig = {
    growth: {
      label: "Crescimento",
      color: "success",
      icon: TrendingUp,
      gradient: "bg-gradient-success",
      badge: "🟢",
    },
    dividends: {
      label: "Dividendos",
      color: "primary",
      icon: TrendingUp,
      gradient: "bg-gradient-primary",
      badge: "🔵",
    },
    rare: {
      label: "Oportunidade Rara",
      color: "gold",
      icon: Sparkles,
      gradient: "bg-gradient-gold",
      badge: "⭐",
    },
  };

  const config = categoryConfig[category];
  const CategoryIcon = config.icon;
  const targetGain = ((targetPrice - price) / price) * 100;
  const stopLossPercent = ((stopLoss - price) / price) * 100;

  return (
    <div className={cn("glass-card p-6 hover-scale border-l-4", `border-${config.color}`)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{config.badge}</span>
            <h3 className="font-display text-2xl font-bold">{symbol}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{name}</p>
          <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold", `bg-${config.color}/10 text-${config.color}`)}>
            <CategoryIcon className="w-3 h-3" />
            {config.label}
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-display font-bold">R$ {price.toFixed(2)}</p>
          <p className={cn("text-sm font-semibold", change > 0 ? "text-success" : "text-danger")}>
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-gold/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-gold mb-2">A HISTÓRIA POR TRÁS DA OPORTUNIDADE</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{story}</p>
          </div>
        </div>
      </div>

      {/* Confidence Zones */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-gold/20">
        <ConfidenceZones
          conservative={confidenceZones.conservative}
          moderate={confidenceZones.moderate}
          aggressive={confidenceZones.aggressive}
        />
      </div>

      {/* Target and Stop Loss */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-secondary/50 rounded-lg border border-gold/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gold" />
            <p className="text-xs text-muted-foreground">PREÇO ALVO</p>
          </div>
          <p className="text-xl font-bold text-gold mb-1">R$ {targetPrice.toFixed(2)}</p>
          <p className={cn("text-xs font-semibold", targetGain > 0 ? "text-success" : "text-danger")}>
            {targetGain > 0 ? "+" : ""}{targetGain.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-secondary/50 rounded-lg border border-gold/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-danger" />
            <p className="text-xs text-muted-foreground">PROTEÇÃO</p>
          </div>
          <p className="text-xl font-bold text-danger mb-1">R$ {stopLoss.toFixed(2)}</p>
          <p className={cn("text-xs font-semibold", stopLossPercent < 0 ? "text-danger" : "text-success")}>
            {stopLossPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Visual Meter */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-gold/20 flex justify-center">
        <VisualMeter confidence={confidence} type="thermometer" />
      </div>

      {/* Action Button */}
      <Button variant={config.color as any} className="w-full">
        Aplicar à Carteira
      </Button>
    </div>
  );
}
