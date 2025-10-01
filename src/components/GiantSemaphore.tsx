import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TrendingUp, AlertTriangle, AlertCircle } from "lucide-react";

interface GiantSemaphoreProps {
  status: 'healthy' | 'attention' | 'urgent';
  value: number;
  targetAllocation: number;
}

export function GiantSemaphore({ status, value, targetAllocation }: GiantSemaphoreProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const config = {
    healthy: {
      color: 'hsl(142 76% 36%)',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      message: 'Carteira Balanceada',
      action: 'Continue acompanhando',
      icon: TrendingUp,
      animation: 'animate-pulse-subtle',
    },
    attention: {
      color: 'hsl(38 92% 50%)',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
      message: 'Precisa de Ajustes',
      action: 'Recomendamos rebalanceamento',
      icon: AlertTriangle,
      animation: 'animate-breathing',
    },
    urgent: {
      color: 'hsl(0 84% 60%)',
      bgColor: 'bg-danger/10',
      borderColor: 'border-danger',
      message: 'Contate Consultor',
      action: 'Ação imediata necessária',
      icon: AlertCircle,
      animation: 'animate-pulse',
    },
  };

  const currentConfig = config[status];
  const Icon = currentConfig.icon;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <>
      <div className="flex items-center justify-center h-[80vh] min-h-[400px]">
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-full transition-all duration-500 cursor-pointer hover:scale-105",
            "w-[280px] h-[280px] md:w-[400px] md:h-[400px]",
            currentConfig.bgColor,
            currentConfig.borderColor,
            "border-4",
            currentConfig.animation
          )}
          style={{
            boxShadow: `0 0 60px ${currentConfig.color}40`,
          }}
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke={currentConfig.color}
              strokeWidth="5"
              strokeDasharray={`${targetAllocation * 3.14 * 2} ${100 * 3.14 * 2}`}
              opacity="0.3"
            />
          </svg>

          {/* Content */}
          <div className="z-10 flex flex-col items-center">
            <Icon className="w-12 h-12 md:w-16 md:h-16 mb-4" style={{ color: currentConfig.color }} />
            <p className="text-4xl md:text-6xl font-display font-bold text-foreground mb-2">
              {formatCurrency(value)}
            </p>
            <p className="text-lg md:text-xl font-medium" style={{ color: currentConfig.color }}>
              {currentConfig.message}
            </p>
          </div>
        </button>
      </div>

      {/* Modal with Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-gold/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Icon className="w-6 h-6" style={{ color: currentConfig.color }} />
              <span>Detalhes da Carteira</span>
            </DialogTitle>
            <DialogDescription>
              Status atual do rebalanceamento da sua carteira
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Patrimônio Total</p>
              <p className="text-3xl font-display font-bold">{formatCurrency(value)}</p>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-xl font-semibold" style={{ color: currentConfig.color }}>
                {currentConfig.message}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{currentConfig.action}</p>
            </div>

            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Progresso da Meta</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${targetAllocation}%`,
                      backgroundColor: currentConfig.color,
                    }}
                  />
                </div>
                <span className="text-lg font-semibold">{targetAllocation}%</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        @keyframes breathing {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        .animate-breathing {
          animation: breathing 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
