import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RadarOpportunity {
  symbol: string;
  category: "growth" | "dividends" | "rare";
  confidence: number;
  angle: number;
}

interface RadarInterfaceProps {
  opportunities: RadarOpportunity[];
}

export function RadarInterface({ opportunities }: RadarInterfaceProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: "growth" | "dividends" | "rare") => {
    switch (category) {
      case "growth":
        return "bg-success";
      case "dividends":
        return "bg-primary";
      case "rare":
        return "bg-gold";
    }
  };

  const getConfidenceRadius = (confidence: number) => {
    if (confidence >= 80) return 30; // Inner circle
    if (confidence >= 60) return 50; // Middle circle
    return 70; // Outer circle
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square">
      {/* Radar background with grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background rounded-full overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute top-1/2 left-1/2 w-[1px] h-full bg-gold/10 origin-top"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        {/* Concentric circles */}
        {[30, 50, 70, 90].map((radius, i) => (
          <div
            key={`circle-${i}`}
            className="absolute top-1/2 left-1/2 border border-gold/20 rounded-full"
            style={{
              width: `${radius}%`,
              height: `${radius}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transition: "transform 50ms linear",
            }}
          >
            {/* Zone labels */}
            {i === 0 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-success font-semibold">
                Alta Confiança
              </div>
            )}
            {i === 1 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-warning font-semibold">
                Média Confiança
              </div>
            )}
            {i === 2 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-semibold">
                Baixa Confiança
              </div>
            )}
          </div>
        ))}

        {/* Center pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-gold rounded-full animate-pulse shadow-gold" />
        </div>

        {/* Opportunity dots */}
        {opportunities.map((opp, index) => {
          const radius = getConfidenceRadius(opp.confidence);
          const angle = (opp.angle + rotation) * (Math.PI / 180);
          const x = 50 + radius * Math.cos(angle) * 0.4;
          const y = 50 + radius * Math.sin(angle) * 0.4;

          return (
            <div
              key={`${opp.symbol}-${index}`}
              className="absolute transition-all duration-50"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className={cn("w-3 h-3 rounded-full shadow-lg animate-pulse", getCategoryColor(opp.category))}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold text-gold">{opp.symbol}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Sweeping radar line */}
        <div
          className="absolute top-1/2 left-1/2 w-[1px] h-1/2 origin-top"
          style={{
            background: "linear-gradient(to bottom, hsl(45 80% 52% / 0.8), transparent)",
            transform: `translate(-50%, -50%) rotate(${rotation * 3}deg)`,
            transition: "transform 50ms linear",
          }}
        />
      </div>

      {/* Radar pulse rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute inset-0 border-2 border-gold/30 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
      </div>
    </div>
  );
}
