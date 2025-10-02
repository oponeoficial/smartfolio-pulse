import { cn } from "@/lib/utils";

interface VisualMeterProps {
  confidence: number;
  type?: "thermometer" | "signal";
}

export function VisualMeter({ confidence, type = "thermometer" }: VisualMeterProps) {
  const getColor = () => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-danger";
  };

  const getGradient = () => {
    if (confidence >= 80) return "from-success/50 to-success";
    if (confidence >= 60) return "from-warning/50 to-warning";
    return "from-danger/50 to-danger";
  };

  if (type === "signal") {
    return (
      <div className="flex items-end gap-1 h-12">
        {[20, 40, 60, 80, 100].map((threshold, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 rounded-t transition-all duration-500",
              confidence >= threshold ? getGradient() : "bg-secondary/50",
              "bg-gradient-to-t"
            )}
            style={{
              height: `${(index + 1) * 20}%`,
            }}
          />
        ))}
      </div>
    );
  }

  // Thermometer
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-8 h-32 bg-secondary/50 rounded-full overflow-hidden border-2 border-gold/20">
        {/* Mercury */}
        <div
          className={cn("absolute bottom-0 left-0 right-0 transition-all duration-700 bg-gradient-to-t", getGradient())}
          style={{ height: `${confidence}%` }}
        />
        
        {/* Bulb */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-danger/50 to-danger border-2 border-gold/20" />
        
        {/* Scale marks */}
        {[25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            className="absolute right-full mr-2 text-[10px] text-muted-foreground"
            style={{ bottom: `${mark}%`, transform: "translateY(50%)" }}
          >
            {mark}%
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className={cn("text-3xl font-bold", getColor())}>{confidence}%</span>
        <span className="text-xs text-muted-foreground">Confiança IA</span>
      </div>
    </div>
  );
}
