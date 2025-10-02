import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceStoryProps {
  return1M: number;
  return12M: number;
  cdiComparison: number;
}

export function PerformanceStory({ return1M, return12M, cdiComparison }: PerformanceStoryProps) {
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const getPerformanceNarrative = (value: number) => {
    if (value > 5) return "Crescimento extraordinário";
    if (value > 2) return "Crescimento consistente";
    if (value > 0) return "Progresso positivo";
    if (value > -2) return "Momento de cautela";
    return "Desafio a superar";
  };

  const getCDINarrative = (comparison: number) => {
    if (comparison > 120) return "Dominando o mercado";
    if (comparison > 100) return "Superando o CDI";
    if (comparison > 80) return "Competindo bem";
    return "Espaço para crescer";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: 1 Month Performance */}
      <div className="glass-card p-6 space-y-4 hover-glow animate-slide-up" style={{ animationDelay: "1s" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-semibold">Rentabilidade 1M</span>
          {return1M >= 0 ? (
            <TrendingUp className="w-5 h-5 text-epic-green" />
          ) : (
            <TrendingDown className="w-5 h-5 text-epic-red" />
          )}
        </div>

        {/* Thermometer visual */}
        <div className="relative h-32 w-12 mx-auto bg-muted/30 rounded-full overflow-hidden border border-border">
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out rounded-full",
              return1M >= 0 ? "bg-gradient-to-t from-epic-green to-epic-green/50" : "bg-gradient-to-t from-epic-red to-epic-red/50"
            )}
            style={{ height: `${Math.min(Math.abs(return1M) * 10, 100)}%` }}
          />
          {/* Bulb at bottom */}
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4",
            return1M >= 0 ? "bg-epic-green border-epic-green/50" : "bg-epic-red border-epic-red/50"
          )} />
        </div>

        <div className="text-center space-y-1">
          <p className={cn("text-2xl font-bold", return1M >= 0 ? "text-epic-green" : "text-epic-red")}>
            {formatPercentage(return1M)}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {getPerformanceNarrative(return1M)}
          </p>
        </div>
      </div>

      {/* Card 2: 12 Month Performance */}
      <div className="glass-card p-6 space-y-4 hover-glow animate-slide-up" style={{ animationDelay: "1.1s" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-semibold">Conquista Anual</span>
          {return12M >= 0 ? (
            <TrendingUp className="w-5 h-5 text-epic-green" />
          ) : (
            <TrendingDown className="w-5 h-5 text-epic-red" />
          )}
        </div>

        {/* Ascending line visual */}
        <div className="relative h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--epic-green))" />
                <stop offset="100%" stopColor="hsl(var(--conquest-gold))" />
              </linearGradient>
            </defs>
            <polyline
              points="0,90 20,80 40,60 60,50 80,30 100,10"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-fade-in"
            />
            <circle cx="100" cy="10" r="4" fill="hsl(var(--conquest-gold))" className="animate-pulse-icon" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <p className={cn("text-2xl font-bold", return12M >= 0 ? "text-epic-green" : "text-epic-red")}>
            {formatPercentage(return12M)}
          </p>
          <p className="text-xs text-muted-foreground italic">
            Ano de conquistas épicas
          </p>
        </div>
      </div>

      {/* Card 3: CDI Comparison */}
      <div className="glass-card p-6 space-y-4 hover-glow animate-slide-up" style={{ animationDelay: "1.2s" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-semibold">vs CDI</span>
          <span className="text-xs text-muted-foreground">{cdiComparison.toFixed(0)}%</span>
        </div>

        {/* Racing arrows */}
        <div className="relative h-32 flex flex-col justify-center gap-4">
          {/* Your return */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Você</p>
            <div className="relative h-8 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-epic-green to-epic-gold transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                style={{ width: `${Math.min(cdiComparison, 150)}%` }}
              >
                <span className="text-xs font-bold">🚀</span>
              </div>
            </div>
          </div>

          {/* CDI baseline */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">CDI</p>
            <div className="relative h-8 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-muted transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                style={{ width: "100%" }}
              >
                <span className="text-xs">📊</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className={cn("text-2xl font-bold", cdiComparison > 100 ? "text-epic-green" : "text-epic-red")}>
            {formatPercentage((cdiComparison - 100))}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {getCDINarrative(cdiComparison)}
          </p>
        </div>
      </div>
    </div>
  );
}
