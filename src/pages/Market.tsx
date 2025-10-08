// src/pages/Market.tsx
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Search, Star, Filter, Calendar, Newspaper, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { brapiService } from "@/services/brapi.service";
import { MarketStock, MarketIndex } from "@/types/brapi.types";
import { useToast } from "@/hooks/use-toast";

export default function Market() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [topMovers, setTopMovers] = useState<MarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const sectors = [
    { name: "Tecnologia", performance: 12.5, color: "success" },
    { name: "Financeiro", performance: 8.3, color: "primary" },
    { name: "Saúde", performance: -2.1, color: "danger" },
    { name: "Energia", performance: 15.8, color: "success" },
    { name: "Consumo", performance: 4.2, color: "primary" },
    { name: "Indústria", performance: -1.5, color: "danger" },
  ];

  const news = [
    {
      title: "Petrobras anuncia dividendos extraordinários",
      source: "Valor Econômico",
      time: "2h atrás",
      impact: "high",
    },
    {
      title: "Ibovespa supera 130 mil pontos pela primeira vez",
      source: "InfoMoney",
      time: "4h atrás",
      impact: "high",
    },
    {
      title: "Vale3 renova máximas históricas",
      source: "Bloomberg",
      time: "5h atrás",
      impact: "medium",
    },
  ];

  const fetchMarketData = async () => {
    try {
      setRefreshing(true);
      
      const indicesData = await brapiService.getBrazilianIndices();
      setIndices(indicesData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stocksData = await brapiService.getTopBrazilianStocks();
      setTopMovers(stocksData);
      
      setLoading(false);
      
      if (!refreshing) {
        toast({
          title: "Dados carregados",
          description: "Cotações atualizadas (delay 15min)",
        });
      }
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      
      const errorMessage = error.message || 'Erro desconhecido';
      
      toast({
        title: "Erro ao carregar dados",
        description: errorMessage.includes('Limite') 
          ? "Limite de requisições atingido. Os dados serão atualizados em breve."
          : "Não foi possível atualizar. Usando dados em cache.",
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Carregando dados do mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Mercado <span className="gradient-gold">ao Vivo</span>
          </h1>
          <p className="text-muted-foreground">Dados com delay de 15min - Cache local ativo</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="glass" 
            size="lg"
            onClick={fetchMarketData}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-5 h-5 mr-2", refreshing && "animate-spin")} />
            Atualizar
          </Button>
          <Button variant="glass" size="lg">
            <Calendar className="w-5 h-5 mr-2" />
            Calendário
          </Button>
          <Button variant="glass" size="lg">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Indices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {indices.map((index, i) => (
          <div key={index.symbol} className="glass-card p-6 hover-glow" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gold font-semibold">{index.name}</span>
              {index.change > 0 ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger" />
              )}
            </div>
            <p className="text-3xl font-display font-bold mb-1">
              {index.value.toLocaleString('pt-BR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
              })}
            </p>
            <p
              className={cn(
                "text-sm font-semibold",
                index.change > 0 ? "text-success" : "text-danger"
              )}
            >
              {index.change > 0 ? "+" : ""}
              {index.change.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* Search and Top Movers */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ativo (ex: PETR4, VALE3, ITUB4)..."
              className="pl-10 bg-secondary/50 border-gold/30"
            />
          </div>
          <Button variant="default" className="bg-gradient-gold text-background">
            Buscar
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xl font-bold">Principais Ações Brasileiras</h3>
            <Button variant="ghost" size="sm" className="text-gold">
              Ver todos
            </Button>
          </div>

          {topMovers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum dado disponível no momento</p>
            </div>
          ) : (
            topMovers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-gold/20"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleWatchlist(stock.symbol)}
                    className="transition-colors"
                  >
                    <Star
                      className={cn(
                        "w-5 h-5",
                        watchlist.includes(stock.symbol)
                          ? "fill-gold text-gold"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                  <div>
                    <p className="font-semibold">{stock.symbol}</p>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-semibold">
                      R$ {stock.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Vol: {stock.volume}</p>
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1 rounded-md font-semibold text-sm min-w-[80px] text-center",
                      stock.change > 0
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    )}
                  >
                    {stock.change > 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sectors Heatmap */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold">Performance por Setor</h3>
          <span className="text-sm text-muted-foreground">Últimos 30 dias (dados estimados)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className={cn(
                "p-4 rounded-lg border-2 text-center transition-all hover-scale",
                sector.performance > 10
                  ? "bg-success/10 border-success/30"
                  : sector.performance > 0
                  ? "bg-primary/10 border-primary/30"
                  : "bg-danger/10 border-danger/30"
              )}
            >
              <p className="text-sm font-semibold mb-2">{sector.name}</p>
              <p
                className={cn(
                  "text-2xl font-display font-bold",
                  sector.performance > 0 ? "text-success" : "text-danger"
                )}
              >
                {sector.performance > 0 ? "+" : ""}
                {sector.performance.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
            <Newspaper className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Notícias do Mercado</h3>
            <p className="text-sm text-muted-foreground">Últimas notícias B3</p>
          </div>
        </div>

        <div className="space-y-4">
          {news.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border-l-4 border-gold cursor-pointer"
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  item.impact === "high" ? "bg-danger" : "bg-gold"
                )}
              />
              <div className="flex-1">
                <p className="font-semibold mb-1">{item.title}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}