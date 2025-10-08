// src/services/brapi.service.ts
import axios, { AxiosInstance } from 'axios';
import { BrapiResponse, BrapiQuoteResult, MarketStock, MarketIndex } from '@/types/brapi.types';

class BrapiService {
  private client: AxiosInstance;
  private readonly baseURL = 'https://brapi.dev/api';
  private readonly token = 'iStxNTZSBUYE6JQBu8rhwX';
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 429) {
          console.error('Rate limit exceeded - aguarde 1 minuto');
          throw new Error('Limite de requisições excedido. Aguarde alguns minutos.');
        }
        if (error.response?.status === 401) {
          console.error('Invalid API token');
        }
        throw error;
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  async getQuotes(tickers: string[]): Promise<BrapiQuoteResult[]> {
    const results: BrapiQuoteResult[] = [];
    
    for (const ticker of tickers) {
      try {
        await this.delay(800);
        const quote = await this.getQuote(ticker);
        results.push(quote);
      } catch (error) {
        console.error(`Failed to fetch ${ticker}, skipping...`);
      }
    }
    
    return results;
  }

  async getTopBrazilianStocks(): Promise<MarketStock[]> {
    const freeTickers = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4'];
    
    try {
      const cachedData = this.getFromCache('stocks');
      if (cachedData) {
        console.log('✅ Using cached stocks data');
        return cachedData;
      }

      console.log('🔄 Fetching stocks... (4 requests, ~3s)');
      const quotes = await this.getQuotes(freeTickers);
      
      const stocks = quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.shortName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: this.formatVolume(quote.regularMarketVolume),
        category: this.getCategoryBySymbol(quote.symbol)
      })).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

      this.setCache('stocks', stocks, 30 * 60 * 1000);
      console.log('✅ Stocks cached for 30min');
      return stocks;
    } catch (error) {
      console.error('Error fetching top stocks:', error);
      const fallback = this.getFromCache<MarketStock[]>('stocks_fallback');
      return fallback || [];
    }
  }

  async getBrazilianIndices(): Promise<MarketIndex[]> {
    try {
      const cachedData = this.getFromCache<MarketIndex[]>('indices');
      if (cachedData) {
        console.log('✅ Using cached indices data');
        return cachedData;
      }

      console.log('🔄 Fetching IBOVESPA...');
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

      this.setCache('indices', indices, 30 * 60 * 1000);
      console.log('✅ Indices cached for 30min');
      return indices;
    } catch (error) {
      console.error('Error fetching IBOVESPA:', error);
      const fallback: MarketIndex[] = [
        { name: 'IBOVESPA', symbol: '^BVSP', value: 128450, change: 0.0 },
        { name: 'S&P 500', symbol: '^GSPC', value: 4890, change: 0.85 },
        { name: 'NASDAQ', symbol: '^IXIC', value: 15420, change: 1.42 },
        { name: 'DOW JONES', symbol: '^DJI', value: 38650, change: -0.32 }
      ];
      return fallback;
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