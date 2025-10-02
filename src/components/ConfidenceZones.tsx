import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfidenceZonesProps {
  conservative: number;
  moderate: number;
  aggressive: number;
}

export function ConfidenceZones({ conservative, moderate, aggressive }: ConfidenceZonesProps) {
  const zones = [
    { label: "CONSERVADORA", price: conservative, color: "bg-success", icon: "🟢" },
    { label: "EQUILIBRADA", price: moderate, color: "bg-warning", icon: "🟡" },
    { label: "OUSADA", price: aggressive, color: "bg-[#FF9800]", icon: "🟠" },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gold mb-3">ZONAS DE ENTRADA</p>
      {zones.map((zone, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 group cursor-pointer">
                <span className="text-sm">{zone.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">{zone.label}</span>
                    <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      R$ {zone.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", zone.color)}
                      style={{ width: `${(index + 1) * 33}%` }}
                    />
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-card">
              <p className="font-bold">R$ {zone.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{zone.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
