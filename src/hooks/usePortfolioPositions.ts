import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Position {
  portfolio_id: string;
  asset_id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'reit' | 'fixedIncome' | 'crypto';
  quantity: number;
  avg_price: number;
  total_invested: number;
  total_brokerage: number;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  asset_id: string;
  operation: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  brokerage: number;
  total: number;
  transaction_date: string;
  notes: string | null;
  created_at: string;
  asset?: {
    symbol: string;
    name: string;
  };
}

export interface ClosedPosition {
  portfolio_id: string;
  asset_id: string;
  symbol: string;
  name: string;
  entry_date: string;
  exit_date: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  return_value: number;
  return_percent: number;
}

export function usePortfolioPositions(portfolioId: string | null) {
  const { data: positions = [], isLoading: isLoadingPositions } = useQuery({
    queryKey: ['positions', portfolioId],
    queryFn: async () => {
      if (!portfolioId) return [];

      const { data, error } = await supabase
        .from('current_positions')
        .select('*')
        .eq('portfolio_id', portfolioId);

      if (error) throw error;
      return data as Position[];
    },
    enabled: !!portfolioId,
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', portfolioId],
    queryFn: async () => {
      if (!portfolioId) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          asset:assets(symbol, name)
        `)
        .eq('portfolio_id', portfolioId)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!portfolioId,
  });

  const { data: closedPositions = [], isLoading: isLoadingClosed } = useQuery({
    queryKey: ['closed-positions', portfolioId],
    queryFn: async () => {
      if (!portfolioId) return [];

      const { data, error } = await supabase
        .from('closed_positions')
        .select('*')
        .eq('portfolio_id', portfolioId);

      if (error) throw error;
      return data as ClosedPosition[];
    },
    enabled: !!portfolioId,
  });

  const { data: dividends = [], isLoading: isLoadingDividends } = useQuery({
    queryKey: ['dividends', portfolioId],
    queryFn: async () => {
      if (!portfolioId) return [];

      const { data, error } = await supabase
        .from('dividends')
        .select('*')
        .eq('portfolio_id', portfolioId);

      if (error) throw error;
      return data;
    },
    enabled: !!portfolioId,
  });

  return {
    positions,
    transactions,
    closedPositions,
    dividends,
    isLoading: isLoadingPositions || isLoadingTransactions || isLoadingClosed || isLoadingDividends,
  };
}