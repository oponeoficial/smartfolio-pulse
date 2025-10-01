import { Wallet, Plus, TrendingUp, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const assets = [
    { symbol: "AAPL", name: "Apple Inc.", quantity: 50, avgPrice: 165.0, currentPrice: 178.45, allocation: 35 },
    { symbol: "MSFT", name: "Microsoft", quantity: 30, avgPrice: 320.0, currentPrice: 335.12, allocation: 25 },
    { symbol: "GOOGL", name: "Alphabet", quantity: 25, avgPrice: 125.0, currentPrice: 135.88, allocation: 20 },
    { symbol: "AMZN", name: "Amazon", quantity: 15, avgPrice: 140.0, currentPrice: 148.22, allocation: 20 },
  ];

  const calculatePL = (qty: number, avg: number, current: number) => {
    const total = qty * (current - avg);
    const percent = ((current - avg) / avg) * 100;
    return { total, percent };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Minha <span className="gradient-text">Carteira</span>
          </h1>
          <p className="text-muted-foreground">Gerencie seus investimentos e acompanhe performance</p>
        </div>
        <Button variant="default" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Ativo
        </Button>
      </div>

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
    </div>
  );
}
