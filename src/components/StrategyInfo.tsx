import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StrategyInfoProps {
  strategy: string;
}

const strategyDescriptions: Record<string, { description: string; allocation: string }> = {
  "OpOne AI": {
    description: "Estratégia otimizada por IA que busca equilíbrio entre rentabilidade e risco.",
    allocation: "60% Ações | 30% FIIs | 10% Renda Fixa"
  },
  "Recomendação OpOne AI": {
    description: "Alocação recomendada pela IA com base no seu perfil de investidor.",
    allocation: "60% Ações | 30% FIIs | 10% Renda Fixa"
  },
  "Minha Estratégia Personalizada": {
    description: "Estratégia customizada conforme suas preferências pessoais.",
    allocation: "50% Ações | 30% FIIs | 15% Renda Fixa | 5% Crypto"
  },
  "Buy & Hold": {
    description: "Foco em investimentos de longo prazo com baixa rotatividade.",
    allocation: "70% Ações | 20% FIIs | 10% Renda Fixa"
  },
  "Day Trading": {
    description: "Operações de curto prazo com alta frequência e volatilidade.",
    allocation: "90% Ações | 5% FIIs | 5% Renda Fixa"
  },
  "Swing Trading": {
    description: "Operações de médio prazo aproveitando movimentos de tendência.",
    allocation: "80% Ações | 15% FIIs | 5% Renda Fixa"
  }
};

export function StrategyInfo({ strategy }: StrategyInfoProps) {
  const info = strategyDescriptions[strategy] || {
    description: "Estratégia de investimento",
    allocation: "Alocação personalizada"
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="glass-card px-3 py-1 border-gold/30 flex items-center gap-2 cursor-help">
            <span className="text-xs text-muted-foreground">Estratégia: </span>
            <span className="text-sm font-semibold gradient-gold">{strategy}</span>
            <Info className="w-3 h-3 text-gold/60" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-semibold">{strategy}</p>
            <p className="text-xs text-muted-foreground">{info.description}</p>
            <div className="glass-card p-2 bg-secondary/20 border-gold/20">
              <p className="text-xs font-medium text-gold">Alocação Ideal:</p>
              <p className="text-xs text-muted-foreground mt-1">{info.allocation}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}