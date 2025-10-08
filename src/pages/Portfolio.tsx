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
import { useRebalanceLogic } from "@/hooks/useRebalanceLogic";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { usePortfolios } from "@/hooks/usePortfolios";
import { usePortfolioPositions } from "@/hooks/usePortfolioPositions";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { StrategyInfo } from "@/components/StrategyInfo";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
  
  // Usar cotações reais do Market ao invés do Supabase
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
  
  const numAssets = positions.length;
  const baseScore = Math.min(numAssets * 10, 50);
  
  const maxAllocation = positionsWithPrices.length > 0 
    ? Math.max(...positionsWithPrices.map(p => (p.quantity * p.currentPrice / totalValue) * 100))
    : 0;
  const distributionBonus = maxAllocation < 40 ? 50 : maxAllocation < 60 ? 30 : 10;
  
  const diversificationScore = Math.min(baseScore + distributionBonus, 100);
  
  const cdiRate = 12.5;
  const cdiComparison = totalReturn >= 0 ? (totalReturn / cdiRate) * 100 : 0;

  const assetsForRebalance = positionsWithPrices.map(pos => ({
    symbol: pos.symbol,
    name: pos.name,
    quantity: pos.quantity,
    avgPrice: pos.avg_price,
    currentPrice: pos.currentPrice,
    allocation: totalValue > 0 ? (pos.quantity * pos.currentPrice / totalValue) * 100 : 0,
    dividends: 0,
    brokerage: pos.total_brokerage,
    type: pos.type,
  }));

  const { rebalanceActions, rebalanceStatus } = useRebalanceLogic(
    assetsForRebalance,
    currentPortfolio?.strategy || 'OpOne AI',
    5
  );

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
      console.error('Erro ao deletar transação:', error);
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
            onClick={() => setIsAddTransactionModalOpen(true)}
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
        daysUntilRebalance={15}
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
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ativo</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Quantidade</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">PM</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Cotação</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Corretagem</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">P&L</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold">Alocação</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {positionsWithPrices.map((pos, index) => {
                      const totalToday = pos.quantity * pos.currentPrice;
                      const pl = totalToday - pos.total_invested;
                      const plPercent = (pl / pos.total_invested) * 100;
                      const allocation = totalValue > 0 ? (totalToday / totalValue) * 100 : 0;
                      const rebalanceAction = rebalanceActions[index] || { action: 'HOLD', message: 'Manter posição' };
                      const marketData = marketPrices[pos.symbol];

                      return (
                        <tr key={pos.asset_id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold">{pos.symbol}</p>
                              <p className="text-sm text-muted-foreground">{pos.name}</p>
                              {marketData && (
                                <p className={`text-xs ${marketData.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                                  {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}% hoje
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">{pos.quantity.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">{currencySymbol} {pos.avg_price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-semibold">{currencySymbol} {pos.currentPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">{currencySymbol} {pos.total_brokerage.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className={pl >= 0 ? "text-success" : "text-danger"}>
                              <p className="font-semibold">
                                {pl >= 0 ? '+' : ''}{currencySymbol} {pl.toFixed(2)}
                              </p>
                              <p className="text-sm">
                                ({plPercent >= 0 ? '+' : ''}{plPercent.toFixed(1)}%)
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-primary"
                                  style={{ width: `${allocation}%` }}
                                />
                              </div>
                              <span className="text-sm">{allocation.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              rebalanceAction.action === 'SELL' 
                                ? 'bg-danger/10 text-danger border border-danger/20' 
                                : rebalanceAction.action === 'BUY'
                                ? 'bg-success/10 text-success border border-success/20'
                                : 'bg-muted/50 text-muted-foreground border border-border/50'
                            }`}>
                              {rebalanceAction.message}
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
                {currencySymbol} {totalClosedReturn >= 0 ? '+' : ''}{totalClosedReturn.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Win Rate</p>
              <p className="text-3xl font-display font-bold text-primary">{winRate.toFixed(1)}%</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Maior Ganho</p>
              <p className="text-3xl font-display font-bold text-success">
                {currencySymbol} {maxProfit.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground mb-2">Maior Perda</p>
              <p className="text-3xl font-display font-bold text-danger">
                {currencySymbol} {maxLoss.toFixed(2)}
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
                        <td className="px-6 py-4 text-right">{currencySymbol} {pos.entry_price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">{currencySymbol} {pos.exit_price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">{pos.quantity.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className={pos.return_value >= 0 ? "text-success" : "text-danger"}>
                            <p className="font-semibold">
                              {pos.return_value >= 0 ? '+' : ''}{currencySymbol} {pos.return_value.toFixed(2)}
                            </p>
                            <p className="text-sm">
                              ({pos.return_percent >= 0 ? '+' : ''}{pos.return_percent.toFixed(1)}%)
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
                        <td className="px-6 py-4 text-right">{tx.quantity.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          {currencySymbol} {tx.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {currencySymbol} {tx.brokerage.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-foreground">
                          {currencySymbol} {tx.total.toFixed(2)}
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