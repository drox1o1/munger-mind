import { env } from '@/env';

export interface Quote {
  symbol: string;
  price: number;
  change: number;
}

type Fn = 'SYMBOL_SEARCH' | 'TIME_SERIES_DAILY_ADJUSTED' | 'GLOBAL_QUOTE';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Rate limiting
const RATE_LIMIT = {
  requestsPerMinute: 5,
  requestsPerDay: 25,
  tokens: 5,
  lastRefill: Date.now(),
  dailyCount: 0,
  lastDay: new Date().toDateString(),
};

function refillTokens() {
  const now = Date.now();
  const timePassed = now - RATE_LIMIT.lastRefill;
  const newTokens = Math.floor(timePassed / (60 * 1000)) * RATE_LIMIT.requestsPerMinute;
  
  if (newTokens > 0) {
    RATE_LIMIT.tokens = Math.min(RATE_LIMIT.tokens + newTokens, RATE_LIMIT.requestsPerMinute);
    RATE_LIMIT.lastRefill = now;
  }

  // Reset daily count if it's a new day
  const today = new Date().toDateString();
  if (today !== RATE_LIMIT.lastDay) {
    RATE_LIMIT.dailyCount = 0;
    RATE_LIMIT.lastDay = today;
  }
}

export async function alphaFetch(
  fn: Fn,
  params: Record<string, string>,
): Promise<unknown> {
  refillTokens();

  if (RATE_LIMIT.tokens <= 0) {
    throw new Error('Rate limit exceeded. Please try again in a minute.');
  }

  if (RATE_LIMIT.dailyCount >= RATE_LIMIT.requestsPerDay) {
    throw new Error('Daily API limit reached. Please try again tomorrow.');
  }

  const queryParams = new URLSearchParams({
    ...params,
    apikey: env.ALPHAVANTAGE_KEY,
    datatype: 'json',
  });

  const url = `https://www.alphavantage.co/query?${queryParams.toString()}`;
  const cacheKey = `${fn}:${queryParams.toString()}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Make request
  RATE_LIMIT.tokens--;
  RATE_LIMIT.dailyCount++;

  const response = await fetch(url);
  const data = await response.json();

  // Cache response
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

export async function searchSymbols(query: string) {
  const data = (await alphaFetch('SYMBOL_SEARCH', {
    keywords: query,
  })) as { bestMatches?: Record<string, string>[] };
  return (
    data.bestMatches?.map((match) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
    })) || []
  );
}

export async function getDaily(symbol: string) {
  const data = await alphaFetch('TIME_SERIES_DAILY_ADJUSTED', { symbol });
  return data['Time Series (Daily)'];
}

export async function getQuote(symbol: string): Promise<Quote> {
  const data = await alphaFetch('GLOBAL_QUOTE', { symbol });
  const quote = data['Global Quote'];
  
  return {
    symbol,
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
  };
} 