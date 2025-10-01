import { useState } from "react";
import { ArrowLeft, Search, Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecommendationCard } from "@/components/RecommendationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalysesPublic() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  const allAnalyses = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      action: "buy" as const,
      confidence: 87,
      price: 178.45,
      change: 2.3,
      targetPrice: 195.50,
      stopLoss: 172.00,
      entryPrices: {
        conservative: 176.80,
        moderate: 178.10,
        aggressive: 179.40,
      },
      reason:
        "Análise técnica: MACD cruzamento positivo + RSI em 58 (zona neutra-positiva). Fundamentos: EPS crescente 12% YoY. Sentimento: 78% positivo nas notícias.",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      action: "buy" as const,
      confidence: 91,
      price: 495.22,
      change: 5.7,
      targetPrice: 580.00,
      stopLoss: 470.00,
      entryPrices: {
        conservative: 490.00,
        moderate: 495.00,
        aggressive: 500.00,
      },
      reason:
        "Forte momentum de alta sustentado. Volume 2.3x acima da média. Padrão de rompimento de resistência confirmado. Setor de IA em expansão.",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      action: "hold" as const,
      confidence: 72,
      price: 242.15,
      change: -1.2,
      targetPrice: 260.00,
      stopLoss: 230.00,
      entryPrices: {
        conservative: 240.00,
        moderate: 242.00,
        aggressive: 244.00,
      },
      reason:
        "Consolidação após rally recente. RSI em 52 sugere lateralização. Aguardar confirmação de tendência antes de entrar/sair.",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      action: "buy" as const,
      confidence: 89,
      price: 385.50,
      change: 3.5,
      targetPrice: 420.00,
      stopLoss: 370.00,
      entryPrices: {
        conservative: 382.00,
        moderate: 385.00,
        aggressive: 388.00,
      },
      reason:
        "Integração de IA nos produtos impulsiona crescimento. Cloud Azure em expansão com margens crescentes. Fundamentos sólidos com P/E atrativo.",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      action: "buy" as const,
      confidence: 84,
      price: 142.30,
      change: 1.8,
      targetPrice: 165.00,
      stopLoss: 135.00,
      entryPrices: {
        conservative: 140.50,
        moderate: 142.00,
        aggressive: 143.50,
      },
      reason:
        "Publicidade digital resiliente. Bard e IA generativa começam a monetizar. Valuation atrativo comparado aos pares de tecnologia.",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      action: "hold" as const,
      confidence: 75,
      price: 178.25,
      change: -0.5,
      targetPrice: 195.00,
      stopLoss: 170.00,
      entryPrices: {
        conservative: 176.00,
        moderate: 178.00,
        aggressive: 180.00,
      },
      reason:
        "AWS mostra desaceleração mas mantém liderança. E-commerce estável. Aguardar sinais mais claros de retomada de crescimento.",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      action: "buy" as const,
      confidence: 86,
      price: 512.80,
      change: 4.2,
      targetPrice: 580.00,
      stopLoss: 490.00,
      entryPrices: {
        conservative: 508.00,
        moderate: 512.00,
        aggressive: 516.00,
      },
      reason:
        "Reality Labs começa a mostrar tração. Publicidade forte com IA melhorando targeting. Eficiência operacional impulsiona margens.",
    },
    {
      symbol: "JPM",
      name: "JPMorgan Chase",
      action: "sell" as const,
      confidence: 78,
      price: 198.50,
      change: -2.1,
      targetPrice: 175.00,
      stopLoss: 205.00,
      entryPrices: {
        conservative: 200.00,
        moderate: 198.50,
        aggressive: 197.00,
      },
      reason:
        "Pressão em margens de juros com expectativa de cortes pelo Fed. Setor bancário sob escrutínio regulatório. Realização de lucros recomendada.",
    },
    {
      symbol: "BAC",
      name: "Bank of America",
      action: "sell" as const,
      confidence: 80,
      price: 35.75,
      change: -1.8,
      targetPrice: 30.00,
      stopLoss: 37.50,
      entryPrices: {
        conservative: 36.50,
        moderate: 35.75,
        aggressive: 35.00,
      },
      reason:
        "Exposição significativa a títulos com perdas não realizadas. Ambiente de taxa de juros desfavorável. Fundamentals fracos no curto prazo.",
    },
  ];

  const filteredAnalyses = allAnalyses.filter((analysis) => {
    const matchesSearch =
      analysis.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || analysis.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actionCounts = {
    buy: allAnalyses.filter((a) => a.action === "buy").length,
    sell: allAnalyses.filter((a) => a.action === "sell").length,
    hold: allAnalyses.filter((a) => a.action === "hold").length,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/ai")}
            className="border-gold/30 hover:bg-gold/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Todas as <span className="gradient-gold">Análises Públicas</span>
            </h1>
            <p className="text-muted-foreground">
              {filteredAnalyses.length} análises disponíveis
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ativo ou empresa..."
              className="pl-10 bg-secondary/50 border-gold/30"
            />
          </div>
          <div className="flex gap-4">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px] bg-secondary/50 border-gold/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas ({allAnalyses.length})</SelectItem>
                <SelectItem value="buy">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    Comprar ({actionCounts.buy})
                  </div>
                </SelectItem>
                <SelectItem value="sell">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-danger" />
                    Vender ({actionCounts.sell})
                  </div>
                </SelectItem>
                <SelectItem value="hold">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-warning" />
                    Manter ({actionCounts.hold})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gold/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-2xl font-display font-bold text-success">
                {actionCounts.buy}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Comprar</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-danger" />
              <span className="text-2xl font-display font-bold text-danger">
                {actionCounts.sell}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Vender</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Minus className="w-5 h-5 text-warning" />
              <span className="text-2xl font-display font-bold text-warning">
                {actionCounts.hold}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Manter</p>
          </div>
        </div>
      </div>

      {/* Analyses Grid */}
      {filteredAnalyses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis, index) => (
            <div
              key={analysis.symbol}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <RecommendationCard {...analysis} />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma análise encontrada com os filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
