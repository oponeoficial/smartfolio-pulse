interface Order {
  id: string;
  date: string;
  operation: "BUY" | "SELL";
  asset: string;
  assetName: string;
  quantity: number;
  price: number;
  brokerage: number;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: "1",
    date: "2024-03-15",
    operation: "BUY",
    asset: "PETR4",
    assetName: "Petrobras PN",
    quantity: 100,
    price: 32.5,
    brokerage: 10.0,
    total: 3260.0,
  },
  {
    id: "2",
    date: "2024-03-10",
    operation: "BUY",
    asset: "VALE3",
    assetName: "Vale ON",
    quantity: 50,
    price: 68.0,
    brokerage: 15.0,
    total: 3415.0,
  },
  {
    id: "3",
    date: "2024-02-28",
    operation: "SELL",
    asset: "ITUB4",
    assetName: "Itaú Unibanco PN",
    quantity: 80,
    price: 30.5,
    brokerage: 8.0,
    total: 2432.0,
  },
  {
    id: "4",
    date: "2024-02-20",
    operation: "BUY",
    asset: "HGLG11",
    assetName: "CSHG Logística FII",
    quantity: 80,
    price: 145.0,
    brokerage: 20.0,
    total: 11620.0,
  },
];

interface OrderHistoryProps {
  currency: string;
}

export function OrderHistory({ currency }: OrderHistoryProps) {
  const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "US$" : "€";

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <h2 className="font-display text-2xl font-bold">Histórico de Ordens</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Todas as operações executadas na carteira
        </p>
      </div>

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
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-6 py-4">
                  {new Date(order.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.operation === "BUY"
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-danger/10 text-danger border border-danger/20"
                    }`}
                  >
                    {order.operation === "BUY" ? "COMPRA" : "VENDA"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.asset}</p>
                    <p className="text-sm text-muted-foreground">{order.assetName}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">{order.quantity}</td>
                <td className="px-6 py-4 text-right">
                  {currencySymbol} {order.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  {currencySymbol} {order.brokerage.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right font-semibold">
                  <span className={order.operation === "BUY" ? "text-danger" : "text-success"}>
                    {order.operation === "BUY" ? "-" : "+"}
                    {currencySymbol} {order.total.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
