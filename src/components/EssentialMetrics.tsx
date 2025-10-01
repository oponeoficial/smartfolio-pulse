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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto px-4">
      {/* Rentabilidade Card */}
      <div
        className={cn(
          "glass-card p-8 border-2 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 animate-slide-up",
          yearlyReturn >= 0 ? "border-success/40 bg-success/5" : "border-danger/40 bg-danger/5"
        )}
        style={{
          boxShadow: yearlyReturn >= 0 
            ? '0 8px 32px hsl(142 91% 43% / 0.2)' 
            : '0 8px 32px hsl(0 84% 60% / 0.2)',
          animationDelay: '0.1s'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                yearlyReturn >= 0 ? "bg-success/20" : "bg-danger/20"
              )}>
                <TrendingUp className={cn("w-6 h-6", yearlyReturn >= 0 ? "text-success" : "text-danger")} />
              </div>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Rentabilidade</p>
            </div>
            <p className={cn(
              "text-5xl font-display font-bold mb-3 tracking-tight",
              yearlyReturn >= 0 ? "text-success" : "text-danger"
            )}>
              {formatPercentage(yearlyReturn)}
            </p>
            <p className="text-base text-muted-foreground font-medium">{cdiComparison}</p>
          </div>
        </div>
      </div>

      {/* Dividendos Card */}
      <div 
        className="glass-card p-8 border-2 border-primary/40 bg-primary/5 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 animate-slide-up"
        style={{
          boxShadow: '0 8px 32px hsl(207 90% 54% / 0.2)',
          animationDelay: '0.2s'
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Dividendos do Mês</p>
            </div>
            <p className="text-5xl font-display font-bold text-primary mb-3 tracking-tight">
              {formatCurrency(monthlyDividends)}
            </p>
            <p className="text-base text-muted-foreground font-medium">Recebidos este mês</p>
          </div>
        </div>
      </div>
    </div>
  );
}
