import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyHeroProps {
  currentValue: number;
  goalValue: number;
  status: "growing" | "stable" | "alert";
}

export function JourneyHero({ currentValue, goalValue, status }: JourneyHeroProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const progress = (currentValue / goalValue) * 100;

  // Animate value counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = currentValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= currentValue) {
        setAnimatedValue(currentValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusConfig = () => {
    switch (status) {
      case "growing":
        return {
          text: "Em Ascensão",
          color: "text-epic-green",
          gradient: "from-epic-green/20 to-epic-green/5",
          icon: "🚀",
        };
      case "alert":
        return {
          text: "Atenção Necessária",
          color: "text-epic-red",
          gradient: "from-epic-red/20 to-epic-red/5",
          icon: "⚠️",
        };
      default:
        return {
          text: "Estável",
          color: "text-epic-blue",
          gradient: "from-epic-blue/20 to-epic-blue/5",
          icon: "⚖️",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", statusConfig.gradient)} />
      
      <div className="relative text-center space-y-6 py-8">
        {/* Title */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Sua Jornada Financeira
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Da Primeira Moeda ao Objetivo dos Sonhos
          </p>
        </div>

        {/* Main value - Hero's fortune */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm md:text-base text-muted-foreground font-semibold">
            Sua Fortuna
          </p>
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-epic-green via-epic-gold to-epic-blue bg-clip-text text-transparent">
              {formatCurrency(animatedValue)}
            </h2>
            <div className="absolute -inset-4 bg-gradient-to-r from-epic-green/10 via-epic-gold/10 to-epic-blue/10 blur-xl -z-10 animate-pulse-icon" />
          </div>
        </div>

        {/* Status with animated icon */}
        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border animate-float", statusConfig.color)} style={{ animationDelay: "0.4s" }}>
          <span className="text-2xl animate-pulse-icon">{statusConfig.icon}</span>
          <span className="font-semibold">{statusConfig.text}</span>
        </div>

        {/* Narrative */}
        <p className="text-sm md:text-base text-muted-foreground italic max-w-md mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
          "Sua fortuna cresce como uma lenda"
        </p>
      </div>
    </div>
  );
}
