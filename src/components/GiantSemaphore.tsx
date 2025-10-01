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
      color: 'hsl(142 91% 43%)',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
      message: 'Carteira Balanceada',
      action: 'Continue acompanhando',
      icon: TrendingUp,
      animation: 'animate-pulse-healthy',
      shadowColor: 'hsl(142 91% 43% / 0.4)',
    },
    attention: {
      color: 'hsl(38 92% 50%)',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
      message: 'Precisa de Ajustes',
      action: 'Recomendamos rebalanceamento',
      icon: AlertTriangle,
      animation: 'animate-breathing',
      shadowColor: 'hsl(38 92% 50% / 0.4)',
    },
    urgent: {
      color: 'hsl(0 84% 60%)',
      bgColor: 'bg-danger/10',
      borderColor: 'border-danger',
      message: 'Contate Consultor',
      action: 'Ação imediata necessária',
      icon: AlertCircle,
      animation: 'animate-pulse-urgent',
      shadowColor: 'hsl(0 84% 60% / 0.4)',
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
      <div className="flex items-center justify-center h-[80vh] min-h-[400px] animate-fade-in">
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-full transition-all duration-700 cursor-pointer hover:scale-105",
            "w-[350px] h-[350px] md:w-[500px] md:h-[500px]",
            currentConfig.bgColor,
            currentConfig.borderColor,
            "border-[6px]",
            currentConfig.animation
          )}
          style={{
            boxShadow: `0 8px 64px ${currentConfig.shadowColor}, 0 0 80px ${currentConfig.shadowColor}`,
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
              strokeWidth="6"
              strokeDasharray={`${targetAllocation * 3.14 * 2} ${100 * 3.14 * 2}`}
              opacity="0.4"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Content */}
          <div className="z-10 flex flex-col items-center animate-slide-up">
            <Icon className="w-14 h-14 md:w-20 md:h-20 mb-6 animate-float" style={{ color: currentConfig.color }} />
            <p className="text-4xl md:text-6xl font-display font-bold text-foreground mb-3 tracking-tight">
              {formatCurrency(value)}
            </p>
            <p className="text-xl md:text-2xl font-semibold tracking-wide" style={{ color: currentConfig.color }}>
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
        @keyframes pulse-healthy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes pulse-urgent {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes breathing {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.93; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-pulse-healthy {
          animation: pulse-healthy 4s ease-in-out infinite;
        }
        
        .animate-pulse-urgent {
          animation: pulse-urgent 2s ease-in-out infinite;
        }
        
        .animate-breathing {
          animation: breathing 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
