import { Wallet, Plus, TrendingUp, PieChart, Target, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Portfolio {
  id: string;
  name: string;
  currency: string;
  strategy: string;
  color: string;
}

interface Asset {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocation: number;
}

interface ClosedPosition {
  symbol: string;
  name: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  returnValue: number;
  returnPercent: number;
}

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: "1", name: "Principal", currency: "BRL", strategy: "OpOne AI", color: "gold" },
  ]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("1");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioCurrency, setNewPortfolioCurrency] = useState("BRL");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isStrategyDialogOpen, setIsStrategyDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("OpOne AI");

  const assets: Asset[] = [
    { symbol: "AAPL", name: "Apple Inc.", quantity: 50, avgPrice: 165.0, currentPrice: 178.45, allocation: 35 },
    { symbol: "MSFT", name: "Microsoft", quantity: 30, avgPrice: 320.0, currentPrice: 335.12, allocation: 25 },
    { symbol: "GOOGL", name: "Alphabet", quantity: 25, avgPrice: 125.0, currentPrice: 135.88, allocation: 20 },
    { symbol: "AMZN", name: "Amazon", quantity: 15, avgPrice: 140.0, currentPrice: 148.22, allocation: 20 },
  ];

  const closedPositions: ClosedPosition[] = [
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      entryDate: "2024-01-15",
      exitDate: "2024-03-20",
      entryPrice: 180.5,
      exitPrice: 215.3,
      quantity: 20,
      returnValue: 696.0,
      returnPercent: 19.3,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA",
      entryDate: "2023-11-10",
      exitDate: "2024-02-28",
      entryPrice: 450.0,
      exitPrice: 520.8,
      quantity: 15,
      returnValue: 1062.0,
      returnPercent: 15.7,
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      entryDate: "2024-02-01",
      exitDate: "2024-03-15",
      entryPrice: 380.0,
      exitPrice: 365.2,
      quantity: 10,
      returnValue: -148.0,
      returnPercent: -3.9,
    },
  ];

  const strategies = [
    { id: "opone", name: "Recomendação OpOne AI", description: "Automática com IA" },
    { id: "custom", name: "Minha Estratégia Personalizada", description: "Customizável" },
    { id: "buyhold", name: "Buy & Hold", description: "Longo prazo" },
    { id: "daytrade", name: "Day Trading", description: "Operações intraday" },
    { id: "swing", name: "Swing Trading", description: "Médio prazo" },
  ];

  const calculatePL = (qty: number, avg: number, current: number) => {
    const total = qty * (current - avg);
    const percent = ((current - avg) / avg) * 100;
    return { total, percent };
  };

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        name: newPortfolioName,
        currency: newPortfolioCurrency,
        strategy: "OpOne AI",
        color: "gold",
      };
      setPortfolios([...portfolios, newPortfolio]);
      setNewPortfolioName("");
      setIsCreateDialogOpen(false);
    }
  };

  const totalClosedReturn = closedPositions.reduce((acc, pos) => acc + pos.returnValue, 0);
  const winRate = (closedPositions.filter((pos) => pos.returnValue > 0).length / closedPositions.length) * 100;
  const maxProfit = Math.max(...closedPositions.map((pos) => pos.returnValue));
  const maxLoss = Math.min(...closedPositions.map((pos) => pos.returnValue));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              Minha <span className="gradient-gold">Carteira</span>
            </h1>
            <p className="text-muted-foreground">Gerencie seus investimentos e acompanhe performance</p>
          </div>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger className="w-[200px] glass-card border-gold/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Dialog open={isStrategyDialogOpen} onOpenChange={setIsStrategyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="glass" size="lg">
                <Target className="w-5 h-5 mr-2" />
                Minhas Estratégias
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-gold">Estratégias de Investimento</DialogTitle>
                <DialogDescription>
                  Escolha ou personalize sua estratégia para esta carteira
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`glass-card p-4 cursor-pointer transition-all hover:border-gold/50 ${
                      selectedStrategy === strategy.name ? "border-gold border-2" : ""
                    }`}
                    onClick={() => setSelectedStrategy(strategy.name)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{strategy.name}</h3>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                      {selectedStrategy === strategy.name && (
                        <div className="w-6 h-6 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gold" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsStrategyDialogOpen(false)}>Aplicar Estratégia</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Nova Carteira
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-gold">Criar Nova Carteira</DialogTitle>
                <DialogDescription>
                  Configure sua nova carteira de investimentos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Carteira</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Ações Brasil, Stocks EUA..."
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Base</Label>
                  <Select value={newPortfolioCurrency} onValueChange={setNewPortfolioCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePortfolio}>Criar Carteira</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="default" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Ativo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="glass-card">
          <TabsTrigger value="positions">Posições Abertas</TabsTrigger>
          <TabsTrigger value="history">Histórico de Operações</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Valor Total</span>
              </div>
              <p className="text-3xl font-display font-bold">R$ 125.430</p>
              <p className="text-sm text-success mt-1">+R$ 12.850 (11.4%)</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10 border border-success/20">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Retorno Total</span>
              </div>
              <p className="text-3xl font-display font-bold text-success">+15.8%</p>
              <p className="text-sm text-muted-foreground mt-1">Últimos 12 meses</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                  <PieChart className="w-5 h-5 text-warning" />
                </div>
                <span className="text-sm text-muted-foreground">Diversificação</span>
              </div>
              <p className="text-3xl font-display font-bold">{assets.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Ativos diferentes</p>
            </div>
          </div>

          {/* Assets Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-bold">Posições Abertas</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ativo</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Quantidade</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Preço Médio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Preço Atual</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">P/L</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Alocação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {assets.map((asset) => {
                    const pl = calculatePL(asset.quantity, asset.avgPrice, asset.currentPrice);
                    return (
                      <tr key={asset.symbol} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{asset.symbol}</p>
                            <p className="text-sm text-muted-foreground">{asset.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">{asset.quantity}</td>
                        <td className="px-6 py-4 text-right">R$ {asset.avgPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right font-semibold">R$ {asset.currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={pl.total >= 0 ? "text-success" : "text-danger"}>
                            <p className="font-semibold">
                              R$ {pl.total >= 0 ? "+" : ""}
                              {pl.total.toFixed(2)}
                            </p>
                            <p className="text-sm">
                              ({pl.percent >= 0 ? "+" : ""}
                              {pl.percent.toFixed(2)}%)
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-primary"
                                style={{ width: `${asset.allocation}%` }}
                              />
                            </div>
                            <span className="text-sm">{asset.allocation}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                  <History className="w-5 h-5 text-gold" />
                </div>
                <span className="text-sm text-muted-foreground">Retorno Total</span>
              </div>
              <p className={`text-3xl font-display font-bold ${totalClosedReturn >= 0 ? "text-success" : "text-danger"}`}>
                R$ {totalClosedReturn >= 0 ? "+" : ""}
                {totalClosedReturn.toFixed(2)}
              </p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10 border border-success/20">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Taxa de Acerto</span>
              </div>
              <p className="text-3xl font-display font-bold text-success">{winRate.toFixed(1)}%</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success/10 border border-success/20">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <span className="text-sm text-muted-foreground">Maior Lucro</span>
              </div>
              <p className="text-3xl font-display font-bold text-success">R$ +{maxProfit.toFixed(2)}</p>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-danger/10 border border-danger/20">
                  <TrendingUp className="w-5 h-5 text-danger rotate-180" />
                </div>
                <span className="text-sm text-muted-foreground">Maior Prejuízo</span>
              </div>
              <p className="text-3xl font-display font-bold text-danger">R$ {maxLoss.toFixed(2)}</p>
            </div>
          </div>

          {/* Closed Positions Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-bold">Histórico de Operações</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Ativo</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Data Entrada</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Data Saída</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Preço Entrada</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Preço Saída</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Quantidade</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Retorno</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {closedPositions.map((position) => (
                    <tr key={position.symbol + position.exitDate} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{position.symbol}</p>
                          <p className="text-sm text-muted-foreground">{position.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        {new Date(position.entryDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        {new Date(position.exitDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-right">R$ {position.entryPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">R$ {position.exitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">{position.quantity}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={position.returnValue >= 0 ? "text-success" : "text-danger"}>
                          <p className="font-semibold">
                            R$ {position.returnValue >= 0 ? "+" : ""}
                            {position.returnValue.toFixed(2)}
                          </p>
                          <p className="text-sm">
                            ({position.returnPercent >= 0 ? "+" : ""}
                            {position.returnPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
