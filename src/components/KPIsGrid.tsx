import { Target, TrendingUp, BarChart3, Brain } from "lucide-react";

const kpis = [
  { 
    label: "Taxa de Acerto", 
    value: "85%", 
    subtitle: "das análises corretas",
    icon: Target, 
    color: "success" 
  },
  { 
    label: "Retorno Médio", 
    value: "+12.5%", 
    subtitle: "por operação",
    icon: TrendingUp, 
    color: "gold" 
  },
  { 
    label: "Análises do Dia", 
    value: "8", 
    subtitle: "novas análises",
    icon: BarChart3, 
    color: "primary" 
  },
  { 
    label: "Confiança Média", 
    value: "78%", 
    subtitle: "de confiança",
    icon: Brain, 
    color: "gold" 
  },
];

export function KPIsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.label}
          className="glass-card p-6 hover-glow animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-${kpi.color}/10 border border-${kpi.color}/20`}>
              <kpi.icon className={`w-6 h-6 text-${kpi.color}`} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-3xl font-display font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
