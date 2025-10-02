import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

interface IncomeGardenProps {
  monthlyDividends: number;
}

export function IncomeGarden({ monthlyDividends }: IncomeGardenProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [coins, setCoins] = useState<number[]>([]);

  // Animate value counting up
  useEffect(() => {
    const duration = 1500;
    const steps = 50;
    const increment = monthlyDividends / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= monthlyDividends) {
        setAnimatedValue(monthlyDividends);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [monthlyDividends]);

  // Generate falling coins animation
  useEffect(() => {
    const coinInterval = setInterval(() => {
      setCoins((prev) => [...prev, Date.now()]);
      setTimeout(() => {
        setCoins((prev) => prev.slice(1));
      }, 2000);
    }, 400);

    return () => clearInterval(coinInterval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6 hover-glow animate-slide-up overflow-hidden relative" style={{ animationDelay: "1.3s" }}>
      {/* Falling coins animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {coins.map((id) => (
          <div
            key={id}
            className="absolute text-2xl animate-coin-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-20px",
            }}
          >
            🪙
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-epic-gold animate-pulse-icon" />
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Colheita do Mês
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Seu dinheiro trabalhando para você
          </p>
        </div>

        {/* Tree visual */}
        <div className="flex justify-center my-6">
          <div className="relative">
            {/* Tree trunk and leaves */}
            <div className="text-6xl md:text-7xl animate-float">🌳</div>
            {/* Coins on tree */}
            <div className="absolute -top-2 -right-2 text-2xl animate-pulse-icon">🪙</div>
            <div className="absolute top-4 -left-4 text-xl animate-pulse-icon" style={{ animationDelay: "0.3s" }}>🪙</div>
            <div className="absolute top-8 right-2 text-xl animate-pulse-icon" style={{ animationDelay: "0.6s" }}>🪙</div>
          </div>
        </div>

        {/* Value */}
        <div className="text-center space-y-2">
          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-epic-gold via-conquest-gold to-epic-green bg-clip-text text-transparent">
            {formatCurrency(animatedValue)}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-epic-gold/10 border border-epic-gold/20">
            <span className="text-xs font-semibold text-epic-gold">Colheita Mensal</span>
          </div>
        </div>

        {/* Narrative */}
        <p className="text-xs md:text-sm text-center text-muted-foreground italic mt-4">
          "Seus investimentos gerando frutos continuamente"
        </p>
      </div>
    </div>
  );
}
