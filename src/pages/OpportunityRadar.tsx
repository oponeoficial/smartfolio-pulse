import { useState, useMemo } from "react";
import { Radar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OpportunityCard } from "@/components/OpportunityCard";
import { RadarInterface } from "@/components/RadarInterface";
import { KPIsGrid } from "@/components/KPIsGrid";
import { AIChatPopup } from "@/components/AIChatPopup";

export default function OpportunityRadar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterConfidence, setFilterConfidence] = useState<string>("all");

  const allOpportunities = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      category: "growth" as const,
      confidence: 87,
      price: 178.45,
      change: 2.3,
      targetPrice: 195.50,
      stopLoss: 172.00,
      confidenceZones: {
        conservative: 176.80,
        moderate: 178.10,
        aggressive: 179.40,
      },
      story:
        "Este ativo está construindo momentum como um trem saindo da estação, com equilíbrio perfeito entre otimismo e cautela dos investidores. O interesse está crescendo como formigas no açúcar.",
      angle: 45,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      category: "growth" as const,
      confidence: 91,
      price: 495.22,
      change: 5.7,
      targetPrice: 580.00,
      stopLoss: 470.00,
      confidenceZones: {
        conservative: 490.00,
        moderate: 495.00,
        aggressive: 500.00,
      },
      story:
        "Forte momentum de alta sustentado como uma onda imparável. O volume está disparando acima da média, mostrando interesse crescente dos investidores institucionais. Setor de IA em expansão acelerada.",
      angle: 90,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      category: "rare" as const,
      confidence: 72,
      price: 242.15,
      change: -1.2,
      targetPrice: 260.00,
      stopLoss: 230.00,
      confidenceZones: {
        conservative: 240.00,
        moderate: 242.00,
        aggressive: 244.00,
      },
      story:
        "Após uma alta significativa, o ativo está em momento de consolidação como um atleta recuperando fôlego. Equilíbrio entre compradores e vendedores sugere que uma nova tendência está se formando.",
      angle: 135,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      category: "dividends" as const,
      confidence: 83,
      price: 415.30,
      change: 1.8,
      targetPrice: 450.00,
      stopLoss: 400.00,
      confidenceZones: {
        conservative: 412.00,
        moderate: 415.00,
        aggressive: 418.00,
      },
      story:
        "Crescimento consistente em cloud computing como uma engrenagem bem lubrificada. Azure expandindo participação de mercado com força constante. Dividendos atraentes complementam o cenário positivo.",
      angle: 180,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      category: "growth" as const,
      confidence: 76,
      price: 142.50,
      change: -2.1,
      targetPrice: 130.00,
      stopLoss: 148.00,
      confidenceZones: {
        conservative: 143.00,
        moderate: 142.50,
        aggressive: 142.00,
      },
      story:
        "Pressão regulatória criando ventos contrários como tempestade no horizonte. O momentum de baixa está sendo confirmado por volume crescente de vendas. Momento de cautela e observação.",
      angle: 225,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      category: "rare" as const,
      confidence: 68,
      price: 178.20,
      change: 0.5,
      targetPrice: 190.00,
      stopLoss: 170.00,
      confidenceZones: {
        conservative: 177.00,
        moderate: 178.00,
        aggressive: 179.00,
      },
      story:
        "Após divulgação de resultados, o ativo está em lateralização como um barco à deriva esperando vento favorável. Aguardar sinais claros de direção antes de posicionar.",
      angle: 270,
    },
  ];

  // Filter and search logic
  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => {
      const matchesSearch = 
        opp.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        filterCategory === "all" || opp.category === filterCategory;
      
      const matchesConfidence = 
        filterConfidence === "all" ||
        (filterConfidence === "high" && opp.confidence >= 80) ||
        (filterConfidence === "medium" && opp.confidence >= 60 && opp.confidence < 80) ||
        (filterConfidence === "low" && opp.confidence < 60);
      
      return matchesSearch && matchesCategory && matchesConfidence;
    });
  }, [searchQuery, filterCategory, filterConfidence]);

  // Radar data
  const radarOpportunities = allOpportunities.map((opp) => ({
    symbol: opp.symbol,
    category: opp.category,
    confidence: opp.confidence,
    angle: opp.angle,
  }));

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header with Search and Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              <span className="gradient-gold">Radar de Oportunidades</span>
            </h1>
            <p className="text-muted-foreground">Análises inteligentes para te ajudar nas suas decisões</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20">
            <Radar className="w-5 h-5 text-gold animate-pulse" />
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
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px] bg-secondary/50 border-gold/30">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="growth">Crescimento</SelectItem>
                <SelectItem value="dividends">Dividendos</SelectItem>
                <SelectItem value="rare">Oportunidades Raras</SelectItem>
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

      {/* Radar Interface */}
      <div className="glass-card p-8">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">
          📡 <span className="gradient-gold">Interface Radar</span>
        </h2>
        <RadarInterface opportunities={radarOpportunities} />
        
        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">Crescimento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Dividendos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gold rounded-full" />
            <span className="text-sm text-muted-foreground">Oportunidades Raras</span>
          </div>
        </div>
      </div>

      {/* All Opportunities */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold mb-2">Todas as Oportunidades</h2>
          <p className="text-sm text-muted-foreground">
            {filteredOpportunities.length} oportunidades encontradas
          </p>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground">Nenhuma oportunidade encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp, index) => (
              <div key={opp.symbol} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <OpportunityCard {...opp} />
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
