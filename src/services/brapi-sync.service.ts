// src/services/brapi-sync.service.ts
import axios from 'axios';
import { supabase } from '@/lib/supabase';

interface BrapiQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketTime: string;
}

class BrapiSyncService {
  private readonly baseURL = 'https://brapi.dev/api';
  private readonly token = 'iStxNTZSBUYE6JQBu8rhwX';

  /**
   * Busca cotações de múltiplos tickers (endpoint correto: /quote/TICKER1,TICKER2,TICKER3)
   */
  async fetchMultipleQuotes(symbols: string[]): Promise<BrapiQuote[]> {
    if (symbols.length === 0) return [];

    try {
      // Endpoint correto: /quote/{tickers} separados por vírgula
      const tickersParam = symbols.join(',');
      
      console.log(`🔄 Fetching ${symbols.length} quotes: ${tickersParam}`);
      
      const response = await axios.get(`${this.baseURL}/quote/${tickersParam}`, {
        headers: { Authorization: `Bearer ${this.token}` },
        timeout: 15000,
      });

      if (response.data?.results) {
        return response.data.results;
      }

      return [];
    } catch (error: any) {
      console.error('Erro ao buscar cotações:', error.message);
      
      if (error.response?.status === 429) {
        throw new Error('Rate limit atingido. Aguarde alguns minutos.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Token inválido. Verifique suas credenciais.');
      }
      
      throw error;
    }
  }

  /**
   * Salva preços no Supabase (tabela price_history)
   */
  async savePricesToDatabase(quotes: BrapiQuote[]): Promise<void> {
    if (quotes.length === 0) return;

    try {
      // Buscar asset_ids baseado nos símbolos
      const symbols = quotes.map(q => q.symbol);
      
      const { data: assets, error: assetsError } = await supabase
        .from('assets')
        .select('id, symbol')
        .in('symbol', symbols);

      if (assetsError) throw assetsError;

      const assetMap = new Map(assets?.map(a => [a.symbol, a.id]) || []);
      
      const today = new Date().toISOString().split('T')[0];

      const priceRecords = quotes
        .filter(quote => assetMap.has(quote.symbol))
        .map(quote => ({
          asset_id: assetMap.get(quote.symbol),
          price: quote.regularMarketPrice,
          price_date: today,
          source: 'brapi',
        }));

      if (priceRecords.length === 0) {
        console.warn('Nenhum ativo encontrado no banco para salvar preços');
        return;
      }

      // Upsert: insere ou atualiza se já existe para hoje
      const { error: insertError } = await supabase
        .from('price_history')
        .upsert(priceRecords, {
          onConflict: 'asset_id,price_date',
          ignoreDuplicates: false,
        });

      if (insertError) throw insertError;

      console.log(`✅ ${priceRecords.length} cotações salvas no banco`);
    } catch (error) {
      console.error('Erro ao salvar preços no banco:', error);
      throw error;
    }
  }

  /**
   * Sincroniza preços dos ativos de um portfolio específico
   */
  async syncPortfolioPrices(portfolioId: string): Promise<void> {
    try {
      // Buscar símbolos dos ativos no portfolio
      const { data: positions, error } = await supabase
        .from('current_positions')
        .select('symbol')
        .eq('portfolio_id', portfolioId);

      if (error) throw error;

      if (!positions || positions.length === 0) {
        console.log('Portfolio sem posições, nada a sincronizar');
        return;
      }

      const symbols = positions.map(p => p.symbol);
      
      console.log(`🔄 Sincronizando ${symbols.length} ativos: ${symbols.join(', ')}`);

      const quotes = await this.fetchMultipleQuotes(symbols);
      
      await this.savePricesToDatabase(quotes);

      console.log('✅ Sincronização concluída');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    }
  }

  /**
   * Sincroniza preços de todos os ativos ativos no sistema
   */
  async syncAllActivePrices(): Promise<void> {
    try {
      const { data: assets, error } = await supabase
        .from('assets')
        .select('symbol')
        .eq('is_active', true);

      if (error) throw error;

      if (!assets || assets.length === 0) {
        console.log('Nenhum ativo ativo no sistema');
        return;
      }

      const symbols = assets.map(a => a.symbol);
      
      console.log(`🔄 Sincronizando TODOS os ${symbols.length} ativos ativos`);

      // Se houver muitos ativos, dividir em lotes de 10 para evitar URL muito longa
      const batchSize = 10;
      const batches: string[][] = [];
      
      for (let i = 0; i < symbols.length; i += batchSize) {
        batches.push(symbols.slice(i, i + batchSize));
      }

      console.log(`📦 Dividido em ${batches.length} lotes de até ${batchSize} ativos`);

      for (const [index, batch] of batches.entries()) {
        console.log(`🔄 Processando lote ${index + 1}/${batches.length}`);
        
        const quotes = await this.fetchMultipleQuotes(batch);
        await this.savePricesToDatabase(quotes);
        
        // Delay entre lotes para evitar rate limit
        if (index < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log('✅ Sincronização completa concluída');
    } catch (error) {
      console.error('Erro na sincronização completa:', error);
      throw error;
    }
  }
}

export const brapiSyncService = new BrapiSyncService();