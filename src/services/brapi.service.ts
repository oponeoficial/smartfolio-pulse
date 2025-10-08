// src/services/brapi.service.ts
import axios, { AxiosInstance } from 'axios';
import { BrapiResponse, BrapiQuoteResult, MarketStock, MarketIndex } from '@/types/brapi.types';

interface BrapiListResponse {
  indexes: Array<{ stock: string; name: string }>;
  stocks: Array<{
    stock: string;
    name: string;
    close: number;
    change: number;
    volume: number;
    market_cap: number;
    logo: string;
    sector: string;
    type: string;
  }>;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCount: number;
  hasNextPage: boolean;
}

class BrapiService {
  private client: AxiosInstance;
  private readonly baseURL = 'https://brapi.dev/api';
  private readonly token = 'iStxNTZSBUYE6JQBu8rhwX';
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 429) {
          console.error('Rate limit exceeded - usando cache');
          throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.');
        }
        if (error.response?.status === 401) {
          console.error('Invalid API token');
          throw new Error('Token inválido. Verifique suas credenciais.');
        }
        throw error;
      }
    );
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  }

  /**
   * Busca top N ações usando endpoint /list (1 requisição = múltiplas ações)
   */
  async getTopStocks(limit: number = 100): Promise<MarketStock[]> {
    const cacheKey = `top-stocks-${limit}`;
    const cached = this.getFromCache<MarketStock[]>(cacheKey);
    
    if (cached) {
      console.log(`✅ Cache hit: top ${limit} stocks`);
      return cached;
    }

    try {
      console.log(`🔄 Fetching top ${limit} stocks from /quote/list...`);
      
      const response = await this.client.get<BrapiListResponse>('/quote/list', {
        params: {
          type: 'stock',
          sortBy: 'volume',
          sortOrder: 'desc',
          limit,
          page: 1
        }
      });

      if (!response.data?.stocks) {
        throw new Error('Resposta inválida da API');
      }

      const stocks: MarketStock[] = response.data.stocks.map(stock => ({
        symbol: stock.stock,
        name: stock.name,
        price: stock.close,
        change: stock.change,
        changePercent: (stock.change / (stock.close - stock.change)) * 100,
        volume: this.formatVolume(stock.volume),
        category: this.getCategoryBySymbol(stock.stock),
      }));

      // Cache por 24 horas (economiza requisições)
      this.setCache(cacheKey, stocks, 24 * 60 * 60 * 1000);
      console.log(`✅ ${stocks.length} ações em cache por 24h`);

      return stocks;
    } catch (error: any) {
      console.error('Erro ao buscar top stocks:', error.message);
      
      // Retornar cache expirado se disponível (fallback)
      const expiredCache = this.cache.get(cacheKey);
      if (expiredCache) {
        console.warn('⚠️ Usando cache expirado como fallback');
        return expiredCache.data;
      }

      throw error;
    }
  }

  /**
   * Busca cotação de um único ticker (ações gratuitas: PETR4, VALE3, MGLU3, ITUB4)
   */
  async getQuote(ticker: string): Promise<BrapiQuoteResult> {
    try {
      const response = await this.client.get<BrapiResponse>(`/quote/${ticker}`);
      if (response.data.results.length === 0) {
        throw new Error(`Ticker ${ticker} not found`);
      }
      return response.data.results[0];
    } catch (error) {
      console.error(`Error fetching quote for ${ticker}:`, error);
      throw error;
    }
  }

  /**
   * Busca cotações de múltiplos tickers (endpoint: /quote/PETR4,VALE3,ITUB4)
   */
  async getMultipleQuotes(tickers: string[]): Promise<BrapiQuoteResult[]> {
    if (tickers.length === 0) return [];

    try {
      const tickersParam = tickers.join(',');
      const response = await this.client.get<BrapiResponse>(`/quote/${tickersParam}`);
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  /**
   * Busca índices brasileiros (IBOVESPA, IFIX, etc)
   */
  async getBrazilianIndices(): Promise<MarketIndex[]> {
    const cacheKey = 'indices';
    const cached = this.getFromCache<MarketIndex[]>(cacheKey);
    
    if (cached) {
      console.log('✅ Cache hit: indices');
      return cached;
    }

    try {
      console.log('🔄 Fetching IBOVESPA index...');
      const ibovQuote = await this.getQuote('^BVSP');
      
      const indices: MarketIndex[] = [
        {
          name: 'IBOVESPA',
          symbol: ibovQuote.symbol,
          value: ibovQuote.regularMarketPrice,
          change: ibovQuote.regularMarketChangePercent
        },
        { name: 'S&P 500', symbol: '^GSPC', value: 4890, change: 0.85 },
        { name: 'NASDAQ', symbol: '^IXIC', value: 15420, change: 1.42 },
        { name: 'DOW JONES', symbol: '^DJI', value: 38650, change: -0.32 }
      ];

      this.setCache(cacheKey, indices, 30 * 60 * 1000);
      console.log('✅ Indices cached for 30min');
      return indices;
    } catch (error) {
      console.error('Error fetching IBOVESPA:', error);
      
      // Fallback se IBOVESPA falhar
      const fallback: MarketIndex[] = [
        { name: 'IBOVESPA', symbol: '^BVSP', value: 128450, change: 0.0 },
        { name: 'S&P 500', symbol: '^GSPC', value: 4890, change: 0.85 },
        { name: 'NASDAQ', symbol: '^IXIC', value: 15420, change: 1.42 },
        { name: 'DOW JONES', symbol: '^DJI', value: 38650, change: -0.32 }
      ];
      return fallback;
    }
  }

  /**
   * Busca ações por termo de busca
   */
  async searchStocks(searchTerm: string, limit: number = 10): Promise<MarketStock[]> {
    try {
      console.log(`🔍 Searching for: ${searchTerm}`);
      
      const response = await this.client.get<BrapiListResponse>('/quote/list', {
        params: {
          search: searchTerm,
          type: 'stock',
          limit
        }
      });

      if (!response.data?.stocks) {
        return [];
      }

      return response.data.stocks.map(stock => ({
        symbol: stock.stock,
        name: stock.name,
        price: stock.close,
        change: stock.change,
        changePercent: (stock.change / (stock.close - stock.change)) * 100,
        volume: this.formatVolume(stock.volume),
        category: this.getCategoryBySymbol(stock.stock),
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  private formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  }

  private getCategoryBySymbol(symbol: string): string {
    const categories: Record<string, string> = {
      'PETR4': 'energy',
      'VALE3': 'mining',
      'ITUB4': 'financial',
      'BBDC4': 'financial',
      'ABEV3': 'consumer',
      'MGLU3': 'retail',
      'WEGE3': 'industrial',
      'RENT3': 'automotive',
      'SUZB3': 'industrial',
      'BBAS3': 'financial'
    };
    return categories[symbol] || 'other';
  }
}

export const brapiService = new BrapiService();