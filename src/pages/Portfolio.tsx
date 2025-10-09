// src/pages/Portfolio.tsx
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioKPIs } from "@/components/PortfolioKPIs";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { usePortfolios } from "@/hooks/usePortfolios";
import { usePortfolioPositions } from "@/hooks/usePortfolioPositions";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { StrategyInfo } from "@/components/StrategyInfo";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Função auxiliar para formatação brasileira de números
const formatBRL = (value: number): string => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Portfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { portfolios, isLoading: isLoadingPortfolios, createPortfolio, isCreating } = usePortfolios();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioCurrency, setNewPortfolioCurrency] = useState("BRL");
  const [newPortfolioStrategy, setNewPortfolioStrategy] = useState("OpOne AI");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);

  const portfolioId = selectedPortfolio || portfolios[0]?.id || null;
  
  const { positions, transactions, closedPositions, isLoading: isLoadingPositions } = usePortfolioPositions(portfolioId);
  
  const symbols = positions.map(p => p.symbol);
  const { prices: marketPrices } = useMarketPrices(symbols);

  const currentPortfolio = portfolios.find(p => p.id === portfolioId);

  const positionsWithPrices = useMemo(() => {
    return positions.map(pos => ({
      ...pos,
      currentPrice: marketPrices[pos.symbol]?.price || pos.avg_price,
    }));
  }, [positions, marketPrices]);

  const totalValue = positionsWithPrices.reduce((acc, pos) => 
    acc + (pos.quantity * pos.currentPrice), 0
  );

  const investedValue = positionsWithPrices.reduce((acc, pos) => 
    acc + pos.total_invested, 0
  );

  const totalReturn = investedValue > 0 ?
    ((totalValue - investedValue) / investedValue) * 100 : 0;

  const totalValueChange = 0;

  const diversificationScore = useMemo(() => {
    if (positions.length === 0) return 0;
    
    const allocations = positionsWithPrices.map(pos => {
      const positionValue = pos.quantity * pos.currentPrice;
      return totalValue > 0 ? (positionValue / totalValue) * 100 : 0;
    });
    
    const hhi = allocations.reduce((sum, alloc) => sum + (alloc * alloc), 0);
    const score = Math.max(0, Math.min(100, 100 * (1 - (hhi / 10000))));
    
    return score;
  }, [positionsWithPrices, totalValue, positions.length]);

  const cdiRate = 12.5;

  const portfolioAnnualizedReturn = useMemo(() => {
    if (transactions.length === 0) return 0;
    
    const firstTransactionDate = new Date(
      Math.min(...transactions.map(t => new Date(t.transaction_date).getTime()))
    );
    
    const today = new Date();
    const daysSinceStart = Math.max(1, 
      (today.getTime() - firstTransactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const annualizedReturn = daysSinceStart < 365 
      ? totalReturn * (365 / daysSinceStart)
      : ((Math.pow(1 + (totalReturn / 100), 365 / daysSinceStart) - 1) * 100);
    
    return annualizedReturn;
  }, [totalReturn, transactions]);

  const cdiComparison = portfolioAnnualizedReturn / cdiRate * 100;

  const { rebalanceStatus, daysUntilRebalance } = useMemo(() => {
    if (positions.length === 0) return { rebalanceStatus: 'good' as const, daysUntilRebalance: 30 };
    
    const strategy = currentPortfolio?.strategy || 'OpOne AI';
    
    const strategyTargets: Record<string, { stocks: number; reits: number; fixedIncome: number }> = {
      'OpOne AI': { stocks: 60, reits: 30, fixedIncome: 10 },
      'Buy & Hold': { stocks: 70, reits: 20, fixedIncome: 10 },
      'Day Trading': { stocks: 90, reits: 5, fixedIncome: 5 },
      'Swing Trading': { stocks: 80, reits: 15, fixedIncome: 5 },
    };
    
    const target = strategyTargets[strategy] || strategyTargets['OpOne AI'];
    
    const currentAllocationByType = positionsWithPrices.reduce((acc, pos) => {
      const value = pos.quantity * pos.currentPrice;
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      acc[pos.type] = (acc[pos.type] || 0) + percentage;
      return acc;
    }, {} as Record<string, number>);
    
    const deviations = {
      stock: Math.abs((currentAllocationByType.stock || 0) - target.stocks),
      reit: Math.abs((currentAllocationByType.reit || 0) - target.reits),
      fixedIncome: Math.abs((currentAllocationByType.fixedIncome || 0) - target.fixedIncome)
    };
    
    const maxDeviation = Math.max(deviations.stock, deviations.reit, deviations.fixedIncome);
    
    let status: 'good' | 'warning' | 'critical';
    let days: number;
    
    if (maxDeviation <= 5) {
      status = 'good';
      days = 30;
    } else if (maxDeviation <= 15) {
      status = 'warning';
      days = 7;
    } else {
      status = 'critical';
      days = 0;
    }
    
    return { rebalanceStatus: status, daysUntilRebalance: days };
  }, [positionsWithPrices, totalValue, positions.length, currentPortfolio?.strategy]);

  const rebalanceInsights = useMemo(() => {
    if (positions.length === 0) return [];
    
    const strategy = currentPortfolio?.strategy || 'OpOne AI';
    const strategyTargets: Record<string, { stocks: number; reits: number; fixedIncome: number }> = {
      'OpOne AI': { stocks: 60, reits: 30, fixedIncome: 10 },
      'Buy & Hold': { stocks: 70, reits: 20, fixedIncome: 10 },
      'Day Trading': { stocks: 90, reits: 5, fixedIncome: 5 },
      'Swing Trading': { stocks: 80, reits: 15, fixedIncome: 5 },
    };
    
    const target = strategyTargets[strategy] || strategyTargets['OpOne AI'];
    
    const currentAllocation: Record<string, number> = {
      stock: 0,
      reit: 0,
      fixedIncome: 0,
    };
    
    positionsWithPrices.forEach(pos => {
      const value = pos.quantity * pos.currentPrice;
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      currentAllocation[pos.type] = (currentAllocation[pos.type] || 0) + percentage;
    });
    
    const deviations = {
      stock: currentAllocation.stock - target.stocks,
      reit: currentAllocation.reit - target.reits,
      fixedIncome: currentAllocation.fixedIncome - target.fixedIncome,
    };
    
    return positionsWithPrices.map(pos => {
      const positionValue = pos.quantity * pos.currentPrice;
      const deviation = deviations[pos.type];
      
      if (deviation > 5) {
        const assetsOfSameType = positionsWithPrices.filter(p => p.type === pos.type);
        const sellPercentage = deviation / assetsOfSameType.length;
        const quantityToSell = Math.floor((sellPercentage / 100) * totalValue / pos.currentPrice);
        
        if (quantityToSell > 0) {
          return {
            action: 'SELL' as const,
            message: `Vender ${quantityToSell} ${pos.symbol} para rebalancear`
          };
        }
      }
      
      if (deviation < -5) {
        const typeLabel = pos.type === 'stock' ? 'ações' : pos.type === 'reit' ? 'FIIs' : 'renda fixa';
        return {
          action: 'BUY' as const,
          message: `Comprar mais ${typeLabel} para balancear`
        };
      }
      
      return {
        action: 'HOLD' as const,
        message: 'Posição dentro da alocação ideal'
      };
    });
  }, [positionsWithPrices, totalValue, currentPortfolio?.strategy, positions.length]);

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      createPortfolio({
        name: newPortfolioName,
        currency: newPortfolioCurrency,
        strategy: newPortfolioStrategy,
      });
      setNewPortfolioName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTransactionId) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', deleteTransactionId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['positions', portfolioId] });
      await queryClient.invalidateQueries({ queryKey: ['transactions', portfolioId] });
      await queryClient.invalidateQueries({ queryKey: ['closed-positions', portfolioId] });

      toast({
        title: "Transação deletada",
        description: "A transação foi removida com sucesso!",
      });

      setDeleteTransactionId(null);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const totalClosedReturn = closedPositions.reduce((acc, pos) => acc + pos.return_value, 0);
  const winRate = closedPositions.length > 0 
    ? (closedPositions.filter((pos) => pos.return_value > 0).length / closedPositions.length) * 100 
    : 0;
  const maxProfit = closedPositions.length > 0 
    ? Math.max(...closedPositions.map((pos) => pos.return_value)) 
    : 0;
  const maxLoss = closedPositions.length > 0 
    ? Math.min(...closedPositions.map((pos) => pos.return_value)) 
    : 0;

  const currencySymbol = currentPortfolio?.currency === "BRL" ? "R$" : 
                         currentPortfolio?.currency === "USD" ? "US$" : "€";

  if (isLoadingPortfolios) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando carteiras...</p>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-4xl font-bold">
            Nenhuma <span className="gradient-gold">Carteira</span>
          </h1>
          <p className="text-muted-foreground">Crie sua primeira carteira para começar</p>
        </div>
        <Button size="lg" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Criar Primeira Carteira
        </Button>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              <div className="space-y-2">
                <Label htmlFor="strategy">Estratégia</Label>
                <Select value={newPortfolioStrategy} onValueChange={setNewPortfolioStrategy}>
                  <SelectTrigger id="strategy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpOne AI">OpOne AI</SelectItem>
                    <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                    <SelectItem value="Day Trading">Day Trading</SelectItem>
                    <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePortfolio} disabled={isCreating}>
                {isCreating ? "Criando..." : "Criar Carteira"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Minha <span className="gradient-gold">Carteira</span>
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">Gerencie seus investimentos e acompanhe performance</p>
            {currentPortfolio && (
              <StrategyInfo strategy={currentPortfolio.strategy} />
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Select 
            value={portfolioId || ""} 
            onValueChange={(value) => {
              if (value === "new") {
                setIsCreateDialogOpen(true);
              } else {
                setSelectedPortfolio(value);
              }
            }}
          >
            <SelectTrigger className="w-[200px] glass-card border-gold/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
              <SelectItem value="new" className="text-gold font-semibold">
                + Criar Nova Carteira
              </SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                <div className="space-y-2">
                  <Label htmlFor="strategy">Estratégia</Label>
                  <Select value={newPortfolioStrategy} onValueChange={setNewPortfolioStrategy}>
                    <SelectTrigger id="strategy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OpOne AI">OpOne AI</SelectItem>
                      <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                      <SelectItem value="Day Trading">Day Trading</SelectItem>
                      <SelectItem value="Swing Trading">Swing Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePortfolio} disabled={isCreating}>
                  {isCreating ? "Criando..." : "Criar Carteira"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="default" 
            size="lg"
            onClick={() => {
              if (!portfolioId) {
                toast({
                  title: "Erro",
                  description: "Nenhuma carteira selecionada. Crie uma carteira primeiro.",
                  variant: "destructive",
                });
                return;
              }
              
              setIsAddTransactionModalOpen(true);
            }}
            className="bg-[#00C853] hover:bg-[#00B248]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Transação
          </Button>
        </div>
      </div>

      <AddTransactionModal 
        open={isAddTransactionModalOpen} 
        onOpenChange={setIsAddTransactionModalOpen}
        currency={currentPortfolio?.currency || "BRL"}
        portfolioId={portfolioId || ""}
      />

      <EditTransactionModal
        open={isEditTransactionModalOpen}
        onOpenChange={setIsEditTransactionModalOpen}
        transaction={selectedTransaction}
        currency={currentPortfolio?.currency || "BRL"}
      />

      <AlertDialog open={!!deleteTransactionId} onOpenChange={() => setDeleteTransactionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita e irá recalcular suas posições.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction} className="bg-danger hover:bg-danger/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PortfolioKPIs
        totalValue={totalValue}
        totalValueChange={totalValueChange}
        totalReturn={totalReturn}
        diversificationScore={diversificationScore}
        cdiComparison={cdiComparison}
        rebalanceStatus={rebalanceStatus}
        daysUntilRebalance={daysUntilRebalance}
        currencySymbol={currencySymbol}
      />

      <Tabs defaultValue="positions" className="space-y-6">
        <TabsList className="glass-card">
          <TabsTrigger value="positions">Posições Abertas</TabsTrigger>
          <TabsTrigger value="closed">Operações Finalizadas</TabsTrigger>
          <TabsTrigger value="orders">Histórico de Ordens</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-bold">Posições Abertas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ativos atualmente em carteira • Cotações reais do Market
              </p>
            </div>

            {isLoadingPositions ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Carregando posições...</p>
              </div>
            ) : positionsWithPrices.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-muted-foreground">Nenhuma posição aberta</p>
                <Button onClick={() => setIsAddTransactionModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Transação
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Ativo</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Quantidade</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">PM</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Cotação</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Corretagem</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">P&L</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Alocação</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Insight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {positionsWithPrices.map((pos, index) => {
                      const totalToday = pos.quantity * pos.currentPrice;
                      const pl = totalToday - pos.total_invested;
                      const plPercent = (pl / pos.total_invested) * 100;
                      const allocation = totalValue > 0 ? (totalToday / totalValue) * 100 : 0;
                      const insight = rebalanceInsights[index] || { action: 'HOLD', message: 'Manter posição' };

                      return (
                        <tr key={pos.asset_id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4 text-center">
                            <p className="text-base">{pos.symbol}</p>
                          </td>
                          <td className="px-6 py-4 text-center">{formatBRL(pos.quantity)}</td>
                          <td className="px-6 py-4 text-center">{currencySymbol} {formatBRL(pos.avg_price)}</td>
                          <td className="px-6 py-4 text-center font-semibold">{currencySymbol} {formatBRL(pos.currentPrice)}</td>
                          <td className="px-6 py-4 text-center">{currencySymbol} {formatBRL(pos.total_brokerage)}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <p className={`font-semibold text-base ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                {currencySymbol} {pl >= 0 ? '+' : ''}{formatBRL(pl)}
                              </p>
                              <p className={`text-xs ${pl >= 0 ? 'text-success' : 'text-danger'}`}>
                                ({plPercent >= 0 ? '+' : ''}{formatBRL(plPercent)}%)
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-primary"
                                  style={{ width: `${allocation}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{formatBRL(allocation)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center leading-tight max-w-[150px] mx-auto ${
                              insight.action === 'SELL' 
                                ? 'bg-danger/10 text-danger border border-danger/20' 
                                : insight.action === 'BUY'
                                ? 'bg-success/10 text-success border border-success/20'
                                : 'bg-muted/50 text-muted-foreground border border-border/50'
                            }`}>
                              {insight.message}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="closed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Retorno Total</p>
              <p className={`text-3xl font-display font-bold ${totalClosedReturn >= 0 ? "text-success" : "text-danger"}`}>
                {currencySymbol} {totalClosedReturn >= 0 ? '+' : ''}{formatBRL(totalClosedReturn)}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-3xl font-display font-bold text-primary">{formatBRL(winRate)}%</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Maior Ganho</p>
              <p className="text-3xl font-display font-bold text-success">
                {currencySymbol} {formatBRL(maxProfit)}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Maior Perda</p>
              <p className="text-3xl font-display font-bold text-danger">
                {currencySymbol} {formatBRL(maxLoss)}
              </p>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-bold">Operações Finalizadas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Trades completos (compra + venda)
              </p>
            </div>

            {closedPositions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Nenhuma operação finalizada</p>
              </div>
            ) : (
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
                    {closedPositions.map((pos) => (
                      <tr key={`${pos.asset_id}-${pos.exit_date}`} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{pos.symbol}</p>
                            <p className="text-sm text-muted-foreground">{pos.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">{new Date(pos.entry_date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-right">{new Date(pos.exit_date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-right">{currencySymbol} {formatBRL(pos.entry_price)}</td>
                        <td className="px-6 py-4 text-right">{currencySymbol} {formatBRL(pos.exit_price)}</td>
                        <td className="px-6 py-4 text-right">{formatBRL(pos.quantity)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={pos.return_value >= 0 ? "text-success" : "text-danger"}>
                            <p className="font-semibold">
                              {pos.return_value >= 0 ? '+' : ''}{currencySymbol} {formatBRL(pos.return_value)}
                            </p>
                            <p className="text-sm">
                              ({pos.return_percent >= 0 ? '+' : ''}{formatBRL(pos.return_percent)}%)
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <h2 className="font-display text-2xl font-bold">Histórico de Ordens</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Todas as operações executadas • Edite ou delete transações
              </p>
            </div>

            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Nenhuma transação registrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Operação</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ativo</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Quantidade</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Preço</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Corretagem</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Total</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4">
                          {new Date(tx.transaction_date).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tx.operation === "BUY"
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-danger/10 text-danger border border-danger/20"
                            }`}
                          >
                            {tx.operation === "BUY" ? "COMPRA" : "VENDA"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{tx.asset?.symbol}</p>
                            <p className="text-sm text-muted-foreground">{tx.asset?.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">{formatBRL(tx.quantity)}</td>
                        <td className="px-6 py-4 text-right">
                          {currencySymbol} {formatBRL(tx.price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {currencySymbol} {formatBRL(tx.brokerage)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          {currencySymbol} {formatBRL(tx.total)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTransaction(tx)}
                              className="hover:bg-gold/10 hover:text-gold"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTransactionId(tx.id)}
                              className="hover:bg-danger/10 hover:text-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}