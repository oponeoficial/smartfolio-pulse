import { TrendingUp, DollarSign, Activity, PieChart, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const metrics = [
    { title: "Patrimônio Total", value: "R$ 125.430", change: 8.5, icon: DollarSign },
    { title: "Retorno (30d)", value: "+15.8%", change: 12.3, icon: TrendingUp },
    { title: "Volatilidade", value: "Moderada", change: -3.2, icon: Activity },
    { title: "Diversificação", value: "8 Ativos", change: 5.1, icon: PieChart },
  ];

  const recommendations = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      action: "buy" as const,
      confidence: 87,
      price: 178.45,
      change: 2.3,
      reason:
        "Indicadores técnicos mostram momentum positivo com rompimento de resistência. Volume crescente indica interesse institucional.",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      action: "hold" as const,
      confidence: 72,
      price: 242.15,
      change: -1.2,
      reason:
        "Aguardar consolidação do preço após rally recente. RSI em zona neutra sugere lateralização no curto prazo.",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      action: "buy" as const,
      confidence: 91,
      price: 495.22,
      change: 5.7,
      reason:
        "Tendência de alta sustentada com fundamentos sólidos. IA continua impulsionando demanda por GPUs no mercado corporativo.",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Dashboard <span className="gradient-text">de Trading</span>
          </h1>
          <p className="text-muted-foreground">Visão completa do seu desempenho e oportunidades</p>
        </div>
        <Button variant="glass" size="lg">
          <Sparkles className="w-5 h-5 mr-2" />
          Consultar IA
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={metric.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <MetricCard {...metric} />
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Recomendações IA</h2>
            <p className="text-sm text-muted-foreground">Atualizadas há 5 minutos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={rec.symbol} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
              <RecommendationCard {...rec} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">Estatísticas Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-success">87%</p>
            <p className="text-sm text-muted-foreground mt-1">Taxa de Acerto IA</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold">247</p>
            <p className="text-sm text-muted-foreground mt-1">Operações (30d)</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary">R$ 12.8k</p>
            <p className="text-sm text-muted-foreground mt-1">Lucro Realizado</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold">1.8</p>
            <p className="text-sm text-muted-foreground mt-1">Sharpe Ratio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
