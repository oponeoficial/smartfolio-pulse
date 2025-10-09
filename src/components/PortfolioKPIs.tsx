// src/components/PortfolioKPIs.tsx
import { TrendingUp, Target, Zap, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PortfolioKPIsProps {
  totalValue: number;
  totalValueChange: number;
  totalReturn: number;
  diversificationScore: number;
  cdiComparison: number;
  rebalanceStatus: 'good' | 'warning' | 'critical';
  daysUntilRebalance: number;
  currencySymbol?: string; // NOVO: Moeda da carteira
}

export function PortfolioKPIs({
  totalValue,
  totalValueChange,
  totalReturn,
  diversificationScore,
  cdiComparison,
  rebalanceStatus,
  daysUntilRebalance,
  currencySymbol = "R$", // Default: Real brasileiro
}: PortfolioKPIsProps) {
  
  const getDiversificationMessage = () => {
    if (diversificationScore >= 70) return "Bem diversificado";
    if (diversificationScore >= 40) return "Diversificação moderada";
    if (diversificationScore >= 10) return "Pouco diversificado";
    return "Sem diversificação";
  };

  const getRebalanceColor = () => {
    if (rebalanceStatus === 'good') return 'text-success';
    if (rebalanceStatus === 'warning') return 'text-warning';
    return 'text-danger';
  };

  const getRebalanceIcon = () => {
    if (rebalanceStatus === 'good') return '✓';
    if (rebalanceStatus === 'warning') return '⚠';
    return '✕';
  };

  const getRebalanceMessage = () => {
    if (rebalanceStatus === 'good') return 'Balanceado';
    if (rebalanceStatus === 'warning') return 'Atenção';
    return 'Necessário';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* KPI 1: Patrimônio Total */}
      <div className="glass-card p-6 hover-glow animate-fade-in">
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Patrimônio Total</p>
          <p className="text-3xl font-display font-bold">
            {currencySymbol} {totalValue.toFixed(2)}
          </p>
          <p className={`text-sm ${totalValueChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalValueChange >= 0 ? '+' : ''}{totalValueChange.toFixed(2)}% hoje
          </p>
        </div>
      </div>

      {/* KPI 2: Retorno Total */}
      <div className="glass-card p-6 hover-glow animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg ${totalReturn >= 0 ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'} border`}>
            <TrendingUp className={`w-6 h-6 ${totalReturn >= 0 ? 'text-success' : 'text-danger'}`} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Retorno Total</p>
          <p className={`text-3xl font-display font-bold ${totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Desde o início</p>
        </div>
      </div>

      {/* KPI 3: Diversificação */}
      <div className="glass-card p-6 hover-glow animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
            <Target className="w-6 h-6 text-gold" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Diversificação</p>
          <p className="text-3xl font-display font-bold">{diversificationScore.toFixed(0)}%</p>
          <div className="space-y-1">
            <Progress value={diversificationScore} className="h-2" />
            <p className="text-xs text-muted-foreground">{getDiversificationMessage()}</p>
          </div>
        </div>
      </div>

      {/* KPI 4: Retorno vs CDI */}
      <div className="glass-card p-6 hover-glow animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <Zap className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Retorno vs CDI</p>
          <p className={`text-3xl font-display font-bold ${cdiComparison >= 0 ? 'text-accent' : 'text-danger'}`}>
            {cdiComparison >= 0 ? '+' : ''}{cdiComparison.toFixed(0)}% do CDI
          </p>
          <p className="text-xs text-muted-foreground">
            CDI: 12.5% vs Seu: {totalReturn.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* KPI 5: Rebalanceamento */}
      <div className="glass-card p-6 hover-glow animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-lg bg-${rebalanceStatus === 'good' ? 'success' : rebalanceStatus === 'warning' ? 'warning' : 'danger'}/10 border border-${rebalanceStatus === 'good' ? 'success' : rebalanceStatus === 'warning' ? 'warning' : 'danger'}/20`}>
            <RefreshCw className={`w-6 h-6 ${getRebalanceColor()}`} />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Rebalanceamento</p>
          <p className={`text-2xl font-display font-bold ${getRebalanceColor()}`}>
            {getRebalanceIcon()} {getRebalanceMessage()}
          </p>
          <p className="text-xs text-muted-foreground">
            {rebalanceStatus === 'good' 
              ? `Próximo em ${daysUntilRebalance} dias`
              : rebalanceStatus === 'warning'
              ? 'Rebalanceamento recomendado'
              : 'Rebalanceamento urgente'}
          </p>
        </div>
      </div>
    </div>
  );
}