import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SemaphoreState = "healthy" | "warning" | "danger";

interface SemaphoreProps {
  state?: SemaphoreState;
}

const stateConfig = {
  healthy: {
    color: "bg-[#4CAF50]",
    icon: CheckCircle2,
    title: "Carteira Saudável",
    description: "Seus investimentos estão no caminho certo",
    animation: "animate-[pulse_3s_ease-in-out_infinite]",
    details: "Sua carteira apresenta diversificação adequada, retornos consistentes e baixa volatilidade. Continue monitorando periodicamente."
  },
  warning: {
    color: "bg-[#FFC107]",
    icon: AlertTriangle,
    title: "Atenção Necessária",
    description: "Recomendamos rebalanceamento",
    animation: "animate-[pulse_2s_ease-in-out_infinite]",
    details: "Identificamos alguns pontos de atenção: concentração em poucos ativos ou volatilidade acima do esperado. Considere rebalancear sua carteira."
  },
  danger: {
    color: "bg-[#F44336]",
    icon: XCircle,
    title: "Ação Necessária",
    description: "Contate seu consultor",
    animation: "animate-[pulse_1.5s_ease-in-out_infinite]",
    details: "Sua carteira apresenta riscos elevados. Recomendamos ação imediata: diversificação urgente ou ajuste de exposição. Entre em contato com seu consultor."
  }
};

export default function Semaphore({ state = "healthy" }: SemaphoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <div
            className={`
              w-[180px] h-[180px] md:w-[240px] md:h-[240px] 
              rounded-full ${config.color} ${config.animation}
              shadow-lg flex items-center justify-center
              cursor-pointer
            `}
          >
            <Icon className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={1.5} />
          </div>
        </button>

        <div className="text-center space-y-2 px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {config.title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-md">
            {config.description}
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`w-6 h-6 ${config.color.replace('bg-', 'text-')}`} />
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-left pt-4">
              {config.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
