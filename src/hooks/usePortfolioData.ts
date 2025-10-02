import { useMemo, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface Asset {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  allocation: number;
  dividends: number;
  type: 'stock' | 'reit' | 'fixedIncome' | 'crypto';
}

interface PortfolioData {
  totalValue: number;
  investedValue: number;
  totalReturn: number;
  performance: {
    oneMonth: number;
    twelveMonth: number;
    cdiComparison: number;
  };
  dividends: {
    currentMonth: number;
  };
  allocation: {
    stocks: number;
    reits: number;
    fixedIncome: number;
  };
  status: 'healthy' | 'attention' | 'urgent';
  goalValue: number;
  goalProgress: number;
}

// Mock portfolio data - in production this would come from API/state management
const mockAssetsData: Record<string, Asset[]> = {
  'carteira-principal': [
    { symbol: "PETR4", name: "Petrobras PN", quantity: 150, avgPrice: 32.5, currentPrice: 35.2, allocation: 35, dividends: 285.50, type: 'stock' },
    { symbol: "VALE3", name: "Vale ON", quantity: 100, avgPrice: 68.0, currentPrice: 72.15, allocation: 25, dividends: 420.00, type: 'stock' },
    { symbol: "ITUB4", name: "Itaú Unibanco PN", quantity: 200, avgPrice: 28.5, currentPrice: 30.80, allocation: 20, dividends: 340.00, type: 'stock' },
    { symbol: "HGLG11", name: "CSHG Logística FII", quantity: 80, avgPrice: 145.0, currentPrice: 152.30, allocation: 15, dividends: 680.00, type: 'reit' },
    { symbol: "BBAS3", name: "Banco do Brasil ON", quantity: 120, avgPrice: 42.0, currentPrice: 45.60, allocation: 5, dividends: 195.00, type: 'stock' },
  ],
  'carteira-growth': [
    { symbol: "MGLU3", name: "Magazine Luiza ON", quantity: 300, avgPrice: 2.5, currentPrice: 3.2, allocation: 40, dividends: 0, type: 'stock' },
    { symbol: "PETZ3", name: "Petz ON", quantity: 200, avgPrice: 5.0, currentPrice: 6.5, allocation: 35, dividends: 50.00, type: 'stock' },
    { symbol: "VIIA3", name: "Via Varejo ON", quantity: 400, avgPrice: 1.8, currentPrice: 2.1, allocation: 25, dividends: 0, type: 'stock' },
  ],
  // Outras carteiras começam vazias
};

export function usePortfolioData(portfolioId: string = 'carteira-principal'): PortfolioData {
  const queryClient = useQueryClient();

  // Invalidate all portfolio queries when portfolio changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
  }, [portfolioId, queryClient]);

  const portfolioData = useMemo(() => {
    // Get assets for the selected portfolio (empty array if not found)
    const mockAssets = mockAssetsData[portfolioId] || [];
    
    // Calculate total values
    const totalValue = mockAssets.reduce((acc, asset) => acc + asset.quantity * asset.currentPrice, 0);
    const investedValue = mockAssets.reduce((acc, asset) => acc + asset.quantity * asset.avgPrice, 0);
    const totalReturn = ((totalValue - investedValue) / investedValue) * 100;

    // Calculate monthly dividends (assuming mock data is yearly, divide by 12)
    const currentMonthDividends = mockAssets.reduce((acc, asset) => acc + asset.dividends, 0) / 12;

    // Calculate allocation by type
    const totalAllocation = mockAssets.reduce((acc, asset) => acc + asset.allocation, 0);
    const stocksAllocation = mockAssets
      .filter(asset => asset.type === 'stock')
      .reduce((acc, asset) => acc + asset.allocation, 0);
    const reitsAllocation = mockAssets
      .filter(asset => asset.type === 'reit')
      .reduce((acc, asset) => acc + asset.allocation, 0);
    const fixedIncomeAllocation = mockAssets
      .filter(asset => asset.type === 'fixedIncome')
      .reduce((acc, asset) => acc + asset.allocation, 0);

    // Mock performance data
    const oneMonthReturn = 2.5;
    const twelveMonthReturn = 15.2;
    const cdiRate = 12.5;
    const cdiComparison = twelveMonthReturn - cdiRate;

    // Calculate status based on portfolio balance
    const goalValue = 500000;
    const goalProgress = (totalValue / goalValue) * 100;
    
    let status: 'healthy' | 'attention' | 'urgent' = 'healthy';
    if (totalReturn < 0) {
      status = 'urgent';
    } else if (totalReturn < 5) {
      status = 'attention';
    }

    return {
      totalValue,
      investedValue,
      totalReturn,
      performance: {
        oneMonth: oneMonthReturn,
        twelveMonth: twelveMonthReturn,
        cdiComparison,
      },
      dividends: {
        currentMonth: currentMonthDividends,
      },
      allocation: {
        stocks: (stocksAllocation / totalAllocation) * 100,
        reits: (reitsAllocation / totalAllocation) * 100,
        fixedIncome: (fixedIncomeAllocation / totalAllocation) * 100,
      },
      status,
      goalValue,
      goalProgress,
    };
  }, [portfolioId]);

  return portfolioData;
}
