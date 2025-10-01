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
        className="glass-card p-6 border border-success/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(142 91% 43% / 0.08), hsl(142 91% 43% / 0.03))',
          boxShadow: '0 4px 24px hsl(142 91% 43% / 0.15), 0 2px 8px hsl(142 91% 43% / 0.1)',
          animationDelay: '0.1s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-success/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-success/30">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Rentabilidade</p>
          </div>
          <div className="space-y-3">
            <div className="transition-all duration-300 hover:translate-x-1">
              <p className={cn(
                "text-2xl font-display font-semibold tracking-tight",
                return1M >= 0 ? "text-success" : "text-danger"
              )}>
                {formatPercentage(return1M)}
              </p>
              <p className="text-xs text-muted-foreground font-light tracking-wide">1M</p>
            </div>
            <div className="transition-all duration-300 hover:translate-x-1">
              <p className="text-3xl font-display font-bold text-success tracking-tight">
                {formatPercentage(return12M)}
              </p>
              <p className="text-xs text-muted-foreground font-light tracking-wide">12M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proventos Card */}
      <div 
        className="glass-card p-6 border border-primary/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(207 90% 54% / 0.08), hsl(207 90% 54% / 0.03))',
          boxShadow: '0 4px 24px hsl(207 90% 54% / 0.15), 0 2px 8px hsl(207 90% 54% / 0.1)',
          animationDelay: '0.2s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-primary/30">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Proventos</p>
          </div>
          <div className="transition-all duration-300 hover:translate-x-1">
            <p className="text-3xl font-display font-bold text-primary mb-2 tracking-tight">
              {formatCurrency(monthlyDividends)}
            </p>
            <p className="text-xs text-muted-foreground font-light tracking-wide">este mês</p>
          </div>
        </div>
      </div>

      {/* CDI Card */}
      <div 
        className="glass-card p-6 border border-gold/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(45 80% 52% / 0.08), hsl(45 80% 52% / 0.03))',
          boxShadow: '0 4px 24px hsl(45 80% 52% / 0.15), 0 2px 8px hsl(45 80% 52% / 0.1)',
          animationDelay: '0.3s'
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gold/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-gold/30">
              <span className="text-lg">⚡</span>
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Desempenho</p>
          </div>
          <div className="transition-all duration-300 hover:translate-x-1">
            <p className="text-3xl font-display font-bold text-gold mb-2 tracking-tight">
              {formatPercentage(cdiComparison)}
            </p>
            <p className="text-xs text-muted-foreground font-light tracking-wide">vs CDI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
