import { TrendingUp, Wallet, Target, Zap, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface KPIProps {
  totalValue: number;
  totalValueChange: number;
  totalReturn: number;
  diversificationScore: number;
  cdiComparison: number;
  rebalanceStatus: 'good' | 'warning' | 'critical';
  daysUntilRebalance: number;
}

export function PortfolioKPIs({
  totalValue,
  totalValueChange,
  totalReturn,
  diversificationScore,
  cdiComparison,
  rebalanceStatus,
  daysUntilRebalance,
}: KPIProps) {
  const getRebalanceColor = () => {
    if (rebalanceStatus === 'good') return 'text-success';
    if (rebalanceStatus === 'warning') return 'text-warning';
    return 'text-danger';
  };

  const getRebalanceIcon = () => {
    if (rebalanceStatus === 'good') return '✅';
    if (rebalanceStatus === 'warning') return '⚠️';
    return '❌';
  };

  const getRebalanceMessage = () => {
    if (rebalanceStatus === 'good') return 'Tudo certo';
    if (rebalanceStatus === 'warning') return 'Atenção';
    return 'Necessário';
  };

  const getDiversificationMessage = () => {
    if (diversificationScore >= 70) return 'Bem diversificado';
    if (diversificationScore >= 50) return 'Moderadamente diversificado';
    return 'Pouco diversificado';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {/* KPI 1: Patrimônio Total */}
      <div className="glass-card p-6 hover-glow animate-fade-in">
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Patrimônio Total</p>
          <p className="text-3xl font-display font-bold">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${totalValueChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalValueChange >= 0 ? '+' : ''}{totalValueChange.toFixed(1)}% hoje
          </p>
        </div>
      </div>

      {/* KPI 2: Retorno Total */}
      <div className="glass-card p-6 hover-glow animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Wallet className="w-6 h-6 text-primary" />
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
          <p className="text-3xl font-display font-bold">{diversificationScore}%</p>
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
          <p className="text-3xl font-display font-bold text-accent">
            {cdiComparison.toFixed(0)}% do CDI
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
