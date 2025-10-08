// src/hooks/useMarketPrices.ts
import { useQuery } from '@tanstack/react-query';
import { brapiService } from '@/services/brapi.service';

interface MarketPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

/**
 * Hook para buscar cotações reais do Market (top 100 ações em cache)
 * Substitui useAssetPrices que buscava do Supabase price_history
 */
export function useMarketPrices(symbols: string[]) {
  const { data: marketPrices = {}, isLoading } = useQuery({
    queryKey: ['market-prices', symbols],
    queryFn: async () => {
      if (symbols.length === 0) return {};

      try {
        // Buscar top 100 ações do market (usa cache de 24h)
        const topStocks = await brapiService.getTopStocks(100);
        
        // Criar mapa symbol → price
        const priceMap: Record<string, MarketPrice> = {};
        
        topStocks.forEach(stock => {
          if (symbols.includes(stock.symbol)) {
            priceMap[stock.symbol] = {
              symbol: stock.symbol,
              price: stock.price,
              change: stock.change,
              changePercent: stock.changePercent,
            };
          }
        });

        // Para símbolos não encontrados no top 100, buscar individualmente
        const missingSymbols = symbols.filter(s => !priceMap[s]);
        
        if (missingSymbols.length > 0) {
          console.log(`⚠️ Buscando ${missingSymbols.length} ativos fora do top 100:`, missingSymbols.join(', '));
          
          // Buscar cotações específicas (usa 1 requisição para múltiplos tickers)
          const quotes = await brapiService.getMultipleQuotes(missingSymbols);
          
          quotes.forEach(quote => {
            priceMap[quote.symbol] = {
              symbol: quote.symbol,
              price: quote.regularMarketPrice,
              change: quote.regularMarketChange,
              changePercent: quote.regularMarketChangePercent,
            };
          });
        }

        console.log(`✅ ${Object.keys(priceMap).length}/${symbols.length} cotações carregadas do Market`);
        return priceMap;
      } catch (error) {
        console.error('Erro ao buscar preços do Market:', error);
        return {};
      }
    },
    enabled: symbols.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos (Market já tem cache de 24h)
    refetchOnWindowFocus: false,
  });

  return {
    prices: marketPrices,
    isLoading,
  };
}