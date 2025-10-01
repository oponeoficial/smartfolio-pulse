import { TrendingUp, DollarSign, Zap, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EssentialMetricsProps {
  return1M: number;
  return12M: number;
  cdiComparison: number;
  monthlyDividends: number;
  stocksAllocation: number;
  reitsAllocation: number;
  fixedIncomeAllocation: number;
}

export function EssentialMetrics({ return1M, return12M, cdiComparison, monthlyDividends, stocksAllocation, reitsAllocation, fixedIncomeAllocation }: EssentialMetricsProps) {
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 w-full max-w-7xl mx-auto">
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
              <Zap className="w-4 h-4 text-gold" />
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
        className="glass-card p-5 border border-accent/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-slide-up rounded-3xl cursor-pointer active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, hsl(280 65% 60% / 0.08), hsl(280 65% 60% / 0.03))',
          boxShadow: '0 4px 24px hsl(280 65% 60% / 0.15), 0 2px 8px hsl(280 65% 60% / 0.1)',
          animationDelay: '0.4s'
        }}
        onClick={() => setIsDistributionOpen(true)}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-accent/20 flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:bg-accent/30">
              <PieChart className="w-4 h-4 text-accent" />
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

      {/* Distribution Modal */}
      <Dialog open={isDistributionOpen} onOpenChange={setIsDistributionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">Distribuição da Carteira</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Ações */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ações</p>
                  <p className="text-sm text-muted-foreground">Renda Variável</p>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-primary">{stocksAllocation.toFixed(1)}%</p>
            </div>

            {/* FIIs */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-success/20 bg-success/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3l-3-2.7zm-9 .7c0-1.1.9-2 2-2s2 .9 2 2h-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">FIIs</p>
                  <p className="text-sm text-muted-foreground">Fundos Imobiliários</p>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-success">{reitsAllocation.toFixed(1)}%</p>
            </div>

            {/* Renda Fixa */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gold/20 bg-gold/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Renda Fixa</p>
                  <p className="text-sm text-muted-foreground">Títulos e CDBs</p>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-gold">{fixedIncomeAllocation.toFixed(1)}%</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
