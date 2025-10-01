import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface EssentialMetricsProps {
  return1M: number;
  return12M: number;
  cdiComparison: number;
  monthlyDividends: number;
}

export function EssentialMetrics({ return1M, return12M, cdiComparison, monthlyDividends }: EssentialMetricsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
      {/* Rentabilidade Card */}
      <div
        className="glass-card p-6 border-2 border-success/40 bg-success/5 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 animate-slide-up"
        style={{
          boxShadow: '0 8px 32px hsl(142 91% 43% / 0.2)',
          animationDelay: '0.1s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Rentabilidade</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className={cn(
                "text-2xl font-display font-bold tracking-tight",
                return1M >= 0 ? "text-success" : "text-danger"
              )}>
                {formatPercentage(return1M)}
              </p>
              <p className="text-xs text-muted-foreground font-light">1M</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-success tracking-tight">
                {formatPercentage(return12M)}
              </p>
              <p className="text-xs text-muted-foreground font-light">12M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proventos Card */}
      <div 
        className="glass-card p-6 border-2 border-primary/40 bg-primary/5 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 animate-slide-up"
        style={{
          boxShadow: '0 8px 32px hsl(207 90% 54% / 0.2)',
          animationDelay: '0.2s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Proventos</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-primary mb-2 tracking-tight">
              {formatCurrency(monthlyDividends)}
            </p>
            <p className="text-xs text-muted-foreground font-light">este mês</p>
          </div>
        </div>
      </div>

      {/* CDI Card */}
      <div 
        className="glass-card p-6 border-2 border-gold/40 bg-gold/5 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 animate-slide-up"
        style={{
          boxShadow: '0 8px 32px hsl(45 80% 52% / 0.2)',
          animationDelay: '0.3s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Desempenho</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-gold mb-2 tracking-tight">
              {formatPercentage(cdiComparison)}
            </p>
            <p className="text-xs text-muted-foreground font-light">vs CDI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
