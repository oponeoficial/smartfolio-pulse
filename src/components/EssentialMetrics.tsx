import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface EssentialMetricsProps {
  return1M: number;
  return12M: number;
  cdiComparison: number;
  monthlyDividends: number;
  stocksAllocation: number;
}

export function EssentialMetrics({ return1M, return12M, cdiComparison, monthlyDividends, stocksAllocation }: EssentialMetricsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
      {/* Rentabilidade Card - Compact Side-by-Side Layout */}
      <div
        className="glass-card p-5 border border-success/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(142 91% 43% / 0.08), hsl(142 91% 43% / 0.03))',
          boxShadow: '0 4px 24px hsl(142 91% 43% / 0.15), 0 2px 8px hsl(142 91% 43% / 0.1)',
          animationDelay: '0.1s'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-success/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-success/30">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Rentabilidade</p>
          </div>
          
          {/* Side by Side Layout */}
          <div className="flex items-center justify-between gap-3 flex-1">
            <div className="transition-all duration-300 hover:translate-x-1">
              <p className={cn(
                "text-xl font-display font-semibold tracking-tight",
                return1M >= 0 ? "text-success" : "text-danger"
              )}>
                {formatPercentage(return1M)}
              </p>
              <p className="text-xs text-muted-foreground font-light tracking-wide">1M</p>
            </div>
            
            <div className="w-px h-12 bg-border/50"></div>
            
            <div className="transition-all duration-300 hover:translate-x-1">
              <p className="text-xl font-display font-bold text-success tracking-tight">
                {formatPercentage(return12M)}
              </p>
              <p className="text-xs text-muted-foreground font-light tracking-wide">12M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proventos Card */}
      <div 
        className="glass-card p-5 border border-primary/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(207 90% 54% / 0.08), hsl(207 90% 54% / 0.03))',
          boxShadow: '0 4px 24px hsl(207 90% 54% / 0.15), 0 2px 8px hsl(207 90% 54% / 0.1)',
          animationDelay: '0.2s'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-primary/30">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Proventos</p>
          </div>
          <div className="transition-all duration-300 hover:translate-x-1 flex-1 flex flex-col justify-center">
            <p className="text-2xl font-display font-bold text-primary mb-1 tracking-tight">
              {formatCurrency(monthlyDividends)}
            </p>
            <p className="text-xs text-muted-foreground font-light tracking-wide">este mês</p>
          </div>
        </div>
      </div>

      {/* CDI Card */}
      <div 
        className="glass-card p-5 border border-gold/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, hsl(45 80% 52% / 0.08), hsl(45 80% 52% / 0.03))',
          boxShadow: '0 4px 24px hsl(45 80% 52% / 0.15), 0 2px 8px hsl(45 80% 52% / 0.1)',
          animationDelay: '0.3s'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-gold/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-gold/30">
              <span className="text-base">⚡</span>
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Desempenho</p>
          </div>
          <div className="transition-all duration-300 hover:translate-x-1 flex-1 flex flex-col justify-center">
            <p className="text-2xl font-display font-bold text-gold mb-1 tracking-tight">
              {formatPercentage(cdiComparison)}
            </p>
            <p className="text-xs text-muted-foreground font-light tracking-wide">vs CDI</p>
          </div>
        </div>
      </div>

      {/* Divisão da Carteira Card - NEW */}
      <div 
        className="glass-card p-5 border border-accent/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, hsl(280 65% 60% / 0.08), hsl(280 65% 60% / 0.03))',
          boxShadow: '0 4px 24px hsl(280 65% 60% / 0.15), 0 2px 8px hsl(280 65% 60% / 0.1)',
          animationDelay: '0.4s'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-accent/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-accent/30">
              <span className="text-base">🎯</span>
            </div>
            <p className="text-xs font-light text-muted-foreground tracking-wider uppercase">Alocação</p>
          </div>
          <div className="transition-all duration-300 hover:translate-x-1 flex-1 flex flex-col justify-center">
            <p className="text-2xl font-display font-bold text-accent mb-1 tracking-tight">
              Ações: {stocksAllocation.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground font-light tracking-wide">ver distribuição</p>
          </div>
        </div>
      </div>
    </div>
  );
}
