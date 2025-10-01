interface Strategy {
  stocks: number;
  reits: number;
  fixedIncome: number;
  crypto?: number;
}

interface Asset {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocation: number;
  type: 'stock' | 'reit' | 'fixedIncome' | 'crypto';
}

interface RebalanceAction {
  action: 'SELL' | 'BUY' | 'HOLD';
  message: string;
  targetAllocation: number;
  currentAllocation: number;
  deviation: number;
}

const STRATEGIES: Record<string, Strategy> = {
  'OpOne AI': {
    stocks: 60,
    reits: 30,
    fixedIncome: 10,
  },
  'Recomendação OpOne AI': {
    stocks: 60,
    reits: 30,
    fixedIncome: 10,
  },
  'Minha Estratégia Personalizada': {
    stocks: 50,
    reits: 30,
    fixedIncome: 15,
    crypto: 5,
  },
  'Buy & Hold': {
    stocks: 70,
    reits: 20,
    fixedIncome: 10,
  },
  'Day Trading': {
    stocks: 90,
    reits: 5,
    fixedIncome: 5,
  },
  'Swing Trading': {
    stocks: 80,
    reits: 15,
    fixedIncome: 5,
  },
};

export function useRebalanceLogic(
  assets: Asset[],
  strategyName: string,
  threshold: number = 5
) {
  const strategy = STRATEGIES[strategyName] || STRATEGIES['OpOne AI'];

  // Calculate current allocations by type
  const totalValue = assets.reduce(
    (acc, asset) => acc + asset.quantity * asset.currentPrice,
    0
  );

  const allocationsByType = assets.reduce(
    (acc, asset) => {
      const value = asset.quantity * asset.currentPrice;
      const allocation = (value / totalValue) * 100;
      acc[asset.type] = (acc[asset.type] || 0) + allocation;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate rebalance actions for each asset
  const rebalanceActions = assets.map((asset): RebalanceAction => {
    const assetValue = asset.quantity * asset.currentPrice;
    const currentAllocation = (assetValue / totalValue) * 100;
    const targetTypeAllocation = strategy[asset.type] || 0;
    const currentTypeAllocation = allocationsByType[asset.type] || 0;
    
    // Calculate deviation from target
    const deviation = Math.abs(currentTypeAllocation - targetTypeAllocation);

    // Determine action based on deviation
    if (deviation <= threshold) {
      return {
        action: 'HOLD',
        message: 'Posição dentro da alocação ideal',
        targetAllocation: targetTypeAllocation,
        currentAllocation: currentTypeAllocation,
        deviation,
      };
    }

    if (currentTypeAllocation > targetTypeAllocation) {
      // Over-allocated, suggest sell
      const excessValue = ((currentTypeAllocation - targetTypeAllocation) / 100) * totalValue;
      const quantityToSell = Math.floor(excessValue / asset.currentPrice);
      
      return {
        action: 'SELL',
        message: `Vender ${quantityToSell} ${asset.symbol} para rebalancear`,
        targetAllocation: targetTypeAllocation,
        currentAllocation: currentTypeAllocation,
        deviation,
      };
    }

    // Under-allocated, suggest buy
    const shortValue = ((targetTypeAllocation - currentTypeAllocation) / 100) * totalValue;
    const quantityToBuy = Math.floor(shortValue / asset.currentPrice);

    return {
      action: 'BUY',
      message: `Comprar ${quantityToBuy} ${asset.symbol} para atingir alocação ideal`,
      targetAllocation: targetTypeAllocation,
      currentAllocation: currentTypeAllocation,
      deviation,
    };
  });

  // Calculate overall rebalance status
  const maxDeviation = Math.max(...rebalanceActions.map((a) => a.deviation));
  const rebalanceStatus: 'good' | 'warning' | 'critical' = 
    maxDeviation <= threshold ? 'good' : maxDeviation <= threshold * 2 ? 'warning' : 'critical';

  return {
    rebalanceActions,
    rebalanceStatus,
    strategy,
    allocationsByType,
  };
}
