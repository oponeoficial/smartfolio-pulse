import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'reit' | 'fixedIncome' | 'crypto';
  currency: string;
  exchange: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AssetPrice {
  asset_id: string;
  price: number;
  price_date: string;
}

export function useAssets() {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('is_active', true)
        .order('symbol');

      if (error) throw error;
      return data as Asset[];
    },
  });

  return {
    assets,
    isLoading,
  };
}

export function useAssetPrices(assetIds: string[]) {
  const { data: prices = {}, isLoading } = useQuery({
    queryKey: ['asset-prices', assetIds],
    queryFn: async () => {
      if (assetIds.length === 0) return {};

      const { data, error } = await supabase
        .from('price_history')
        .select('asset_id, price, price_date')
        .in('asset_id', assetIds)
        .order('price_date', { ascending: false });

      if (error) throw error;

      const latestPrices: Record<string, number> = {};
      const seenAssets = new Set();

      data.forEach((row: AssetPrice) => {
        if (!seenAssets.has(row.asset_id)) {
          latestPrices[row.asset_id] = row.price;
          seenAssets.add(row.asset_id);
        }
      });

      return latestPrices;
    },
    enabled: assetIds.length > 0,
  });

  return {
    prices,
    isLoading,
  };
}