import { useState, useMemo } from "react";
import { Brain, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecommendationCard } from "@/components/RecommendationCard";
import { KPIsGrid } from "@/components/KPIsGrid";
import { AIChatPopup } from "@/components/AIChatPopup";

export default function AITrading() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterConfidence, setFilterConfidence] = useState<string>("all");

  const allRecommendations = [
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
      confidence: 83,
      price: 415.30,
      change: 1.8,
      targetPrice: 450.00,
      stopLoss: 400.00,
      entryPrices: {
        conservative: 412.00,
        moderate: 415.00,
        aggressive: 418.00,
      },
      reason: "Crescimento consistente em cloud computing. Azure expandindo participação de mercado.",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      action: "sell" as const,
      confidence: 76,
      price: 142.50,
      change: -2.1,
      targetPrice: 130.00,
      stopLoss: 148.00,
      entryPrices: {
        conservative: 143.00,
        moderate: 142.50,
        aggressive: 142.00,
      },
      reason: "Pressão regulatória aumentando. Momentum de baixa confirmado por volume.",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      action: "hold" as const,
      confidence: 68,
      price: 178.20,
      change: 0.5,
      targetPrice: 190.00,
      stopLoss: 170.00,
      entryPrices: {
        conservative: 177.00,
        moderate: 178.00,
        aggressive: 179.00,
      },
      reason: "Lateralização após earnings. Aguardar definição de tendência.",
    },
  ];

  // Filter and search logic with debounce
  const filteredRecommendations = useMemo(() => {
    return allRecommendations.filter((rec) => {
      const matchesSearch = 
        rec.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        filterType === "all" || rec.action === filterType;
      
      const matchesConfidence = 
        filterConfidence === "all" ||
        (filterConfidence === "high" && rec.confidence >= 80) ||
        (filterConfidence === "medium" && rec.confidence >= 60 && rec.confidence < 80) ||
        (filterConfidence === "low" && rec.confidence < 60);
      
      return matchesSearch && matchesType && matchesConfidence;
    });
  }, [searchQuery, filterType, filterConfidence]);

  const featuredRecommendations = allRecommendations.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header with Search and Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Análises <span className="gradient-gold">Públicas da IA</span>
            </h1>
            <p className="text-muted-foreground">Análises inteligentes para suas decisões de trading</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20">
            <Brain className="w-5 h-5 text-gold animate-pulse" />
            <span className="font-semibold text-gold">IA Ativa</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-gold/30"
            />
          </div>
          <div className="flex gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-gold/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="buy">Comprar</SelectItem>
                <SelectItem value="sell">Vender</SelectItem>
                <SelectItem value="hold">Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterConfidence} onValueChange={setFilterConfidence}>
              <SelectTrigger className="w-[140px] bg-secondary/50 border-gold/30">
                <SelectValue placeholder="Confiança" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta (80%+)</SelectItem>
                <SelectItem value="medium">Média (60-80%)</SelectItem>
                <SelectItem value="low">Baixa (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <KPIsGrid />

      {/* All Analyses */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-2">Todas as Análises</h2>
          <p className="text-sm text-muted-foreground">
            {filteredRecommendations.length} análises encontradas
          </p>
        </div>

        {filteredRecommendations.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Nenhuma análise encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRecommendations.map((rec, index) => (
              <div key={rec.symbol} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <RecommendationCard {...rec} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating AI Chat Popup */}
      <AIChatPopup />
    </div>
  );
}
