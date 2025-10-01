import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface EssentialMetricsProps {
  yearlyReturn: number;
  cdiComparison: string;
  monthlyDividends: number;
}

export function EssentialMetrics({ yearlyReturn, cdiComparison, monthlyDividends }: EssentialMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      {/* Rentabilidade Card */}
      <div
        className={cn(
          "glass-card p-6 border-2 transition-all duration-300 hover:scale-105",
          yearlyReturn >= 0 ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className={cn("w-6 h-6", yearlyReturn >= 0 ? "text-success" : "text-danger")} />
              <p className="text-sm font-medium text-muted-foreground">Rentabilidade</p>
            </div>
            <p className={cn(
              "text-4xl font-display font-semibold mb-2",
              yearlyReturn >= 0 ? "text-success" : "text-danger"
            )}>
              {formatPercentage(yearlyReturn)}
            </p>
            <p className="text-sm text-muted-foreground">{cdiComparison}</p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            yearlyReturn >= 0 ? "bg-success/20" : "bg-danger/20"
          )}>
            <TrendingUp className={cn("w-6 h-6", yearlyReturn >= 0 ? "text-success" : "text-danger")} />
          </div>
        </div>
      </div>

      {/* Dividendos Card */}
      <div className="glass-card p-6 border-2 border-primary/30 bg-primary/5 transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-6 h-6 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Dividendos do Mês</p>
            </div>
            <p className="text-4xl font-display font-semibold text-primary mb-2">
              {formatCurrency(monthlyDividends)}
            </p>
            <p className="text-sm text-muted-foreground">Recebidos este mês</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
