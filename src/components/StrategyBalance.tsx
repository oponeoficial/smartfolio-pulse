import { Shield, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StrategyBalanceProps {
  status: "balanced" | "rebalance" | "alert";
  stocksAllocation: number;
  reitsAllocation: number;
  fixedIncomeAllocation: number;
}

export function StrategyBalance({
  status,
  stocksAllocation,
  reitsAllocation,
  fixedIncomeAllocation,
}: StrategyBalanceProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "balanced":
        return {
          text: "Estratégia Equilibrada",
          color: "text-epic-green",
          bgColor: "bg-epic-green/10",
          borderColor: "border-epic-green/20",
          light: "🟢",
        };
      case "rebalance":
        return {
          text: "Ajuste Sugerido",
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/20",
          light: "🟡",
        };
      default:
        return {
          text: "Atenção Necessária",
          color: "text-epic-red",
          bgColor: "bg-epic-red/10",
          borderColor: "border-epic-red/20",
          light: "🔴",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const allocations = [
    { name: "Ações", value: stocksAllocation, color: "from-epic-blue to-epic-blue/70", emoji: "📈" },
    { name: "FIIs", value: reitsAllocation, color: "from-epic-gold to-conquest-gold", emoji: "🏢" },
    { name: "Renda Fixa", value: fixedIncomeAllocation, color: "from-epic-green to-epic-green/70", emoji: "🔒" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Balance Status */}
      <div className="glass-card p-6 space-y-6 hover-glow animate-slide-up" style={{ animationDelay: "1.4s" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-semibold">Balanceamento</span>
          </div>
        </div>

        {/* Traffic light semaphore */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative w-20 h-32 bg-card border-2 border-border rounded-full flex flex-col items-center justify-around p-2">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl", status === "alert" && "animate-pulse-icon")}>
              {status === "alert" ? "🔴" : "⚫"}
            </div>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl", status === "rebalance" && "animate-pulse-icon")}>
              {status === "rebalance" ? "🟡" : "⚫"}
            </div>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl", status === "balanced" && "animate-pulse-icon")}>
              {status === "balanced" ? "🟢" : "⚫"}
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className={cn("text-center space-y-2 p-3 rounded-lg border", statusConfig.bgColor, statusConfig.borderColor)}>
          <p className={cn("font-bold", statusConfig.color)}>
            {statusConfig.text}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {status === "balanced" && "Seu plano contra a volatilidade"}
            {status === "rebalance" && "Pequenos ajustes trazem grandes ganhos"}
            {status === "alert" && "Hora de revisar sua estratégia"}
          </p>
        </div>
      </div>

      {/* Card 2: Allocation */}
      <div className="glass-card p-6 space-y-6 hover-glow animate-slide-up" style={{ animationDelay: "1.5s" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-semibold">Alocação</span>
          </div>
        </div>

        {/* Allocation bars */}
        <div className="space-y-4">
          {allocations.map((allocation, index) => (
            <div key={allocation.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span>{allocation.emoji}</span>
                  <span>{allocation.name}</span>
                </span>
                <span className="font-bold">{allocation.value}%</span>
              </div>
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={cn("absolute left-0 top-0 h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out", allocation.color)}
                  style={{
                    width: `${allocation.value}%`,
                    animationDelay: `${1.5 + index * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Narrative */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground italic">
            "Diversificação sábia protege sua jornada"
          </p>
        </div>
      </div>
    </div>
  );
}
