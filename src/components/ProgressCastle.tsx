import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressCastleProps {
  currentValue: number;
  goalValue: number;
}

export function ProgressCastle({ currentValue, goalValue }: ProgressCastleProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progress = Math.min((currentValue / goalValue) * 100, 100);

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);

    return () => clearTimeout(timer);
  }, [progress]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate circle stroke
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className="glass-card p-6 md:p-8 space-y-6 animate-slide-up" style={{ animationDelay: "0.8s" }}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl animate-pulse-icon">🏰</span>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Seu Castelo dos Sonhos
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Meta de {formatCurrency(goalValue)}
        </p>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        <svg className="transform -rotate-90 w-48 h-48 md:w-56 md:h-56">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-2000 ease-out"
            style={{ filter: "drop-shadow(0 0 8px hsl(var(--conquest-gold)))" }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--epic-green))" />
              <stop offset="50%" stopColor="hsl(var(--conquest-gold))" />
              <stop offset="100%" stopColor="hsl(var(--epic-blue))" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-epic-green via-conquest-gold to-epic-blue bg-clip-text text-transparent">
            {animatedProgress.toFixed(0)}%
          </span>
          <span className="text-xs md:text-sm text-muted-foreground mt-1">
            conquistado
          </span>
        </div>
      </div>

      {/* Distance to goal */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          Faltam {formatCurrency(goalValue - currentValue)}
        </p>
        <p className="text-xs text-muted-foreground italic">
          para alcançar seu castelo
        </p>
      </div>
    </div>
  );
}
