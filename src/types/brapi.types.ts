// src/types/brapi.types.ts
export interface BrapiQuoteResult {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  marketCap: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  priceEarnings?: number;
  earningsPerShare?: number;
  logourl?: string;
}

export interface BrapiResponse {
  results: BrapiQuoteResult[];
  requestedAt: string;
  took: string;
}

export interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  category: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  symbol: string;
}