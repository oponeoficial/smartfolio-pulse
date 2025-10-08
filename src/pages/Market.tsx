// src/pages/Market.tsx
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Search, Star, Filter, Calendar, RefreshCw } from "lucide-react";
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
  const [displayedStocks, setDisplayedStocks] = useState<MarketStock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
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
      
      // Buscar índices
      const indicesData = await brapiService.getBrazilianIndices();
      setIndices(indicesData);
      
      // Buscar top 100 ações brasileiras (1 única requisição!)
      console.log('🔄 Carregando top 100 ações brasileiras...');
      const stocksData = await brapiService.getTopStocks(100);
      setTopMovers(stocksData);
      setDisplayedStocks(stocksData.slice(0, 20)); // Mostrar top 20 inicialmente
      
      setLoading(false);
      
      if (!refreshing) {
        toast({
          title: "Dados carregados",
          description: `${stocksData.length} ações carregadas (cache 24h)`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching market data:', error);
      
      const errorMessage = error.message || 'Erro desconhecido';
      
      toast({
        title: "Erro ao carregar dados",
        description: errorMessage.includes('Limite') 
          ? "Limite de requisições atingido. Usando dados em cache."
          : "Não foi possível atualizar. Usando dados em cache.",
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setDisplayedStocks(topMovers.slice(0, 20));
      return;
    }

    setSearching(true);

    try {
      // Primeiro, buscar no cache local (topMovers)
      const localResults = topMovers.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (localResults.length > 0) {
        setDisplayedStocks(localResults);
        toast({
          title: "Busca concluída",
          description: `${localResults.length} ações encontradas no cache`,
        });
      } else {
        // Se não encontrar no cache, buscar na API
        const apiResults = await brapiService.searchStocks(searchTerm, 20);
        
        if (apiResults.length > 0) {
          setDisplayedStocks(apiResults);
          toast({
            title: "Busca concluída",
            description: `${apiResults.length} ações encontradas`,
          });
        } else {
          toast({
            title: "Nenhum resultado",
            description: "Nenhuma ação encontrada com esse termo",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleLoadMore = () => {
    const currentLength = displayedStocks.length;
    const nextBatch = topMovers.slice(currentLength, currentLength + 20);
    setDisplayedStocks([...displayedStocks, ...nextBatch]);
  };

  useEffect(() => {
    fetchMarketData();
    // Atualizar a cada 4 horas (economia de requisições)
    const interval = setInterval(fetchMarketData, 4 * 60 * 60 * 1000);
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
          <p className="text-sm text-muted-foreground mt-2">Buscando top 100 ações brasileiras</p>
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
          <p className="text-muted-foreground">
            {topMovers.length} ações disponíveis • Cache 24h • Dados com delay de 15min
          </p>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            variant="default" 
            className="bg-gradient-gold text-background"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-xl font-bold">
              {searchTerm ? 'Resultados da Busca' : 'Top Ações Brasileiras'}
            </h3>
            <span className="text-sm text-muted-foreground">
              Exibindo {displayedStocks.length} de {topMovers.length} ações
            </span>
          </div>

          {displayedStocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum dado disponível no momento</p>
            </div>
          ) : (
            <>
              {displayedStocks.map((stock) => (
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
              ))}

              {!searchTerm && displayedStocks.length < topMovers.length && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="border-gold/30"
                  >
                    Carregar mais {Math.min(20, topMovers.length - displayedStocks.length)} ações
                  </Button>
                </div>
              )}
            </>
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
                {sector.performance}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div className="glass-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold" />
          Últimas Notícias
        </h3>

        <div className="space-y-4">
          {news.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-gold/20 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    item.impact === "high"
                      ? "bg-danger/20 text-danger"
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {item.impact === "high" ? "Alto Impacto" : "Médio Impacto"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}