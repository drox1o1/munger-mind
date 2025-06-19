export type AssetType = 'equity' | 'commodity' | 'property';

export interface AssetData {
  symbol: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  currency: string;
  change24h: number;
  changePercent24h: number;
  volume?: number;
  marketCap?: number;
  exchange?: string;
  unit?: string;
  yearBuilt?: number;
  location?: string;
  description?: string;
  website?: string;
  lastUpdated: Date;
  chartData?: ChartDataPoint[];
  fundamentals?: Record<string, any>;
}

export interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Property data seed
const propertyData: Record<string, AssetData> = {
  'land-mumbai-bandra': {
    symbol: 'LAND-BDR',
    name: 'Premium Land Plot - Bandra West',
    type: 'property',
    currentPrice: 45000,
    currency: '₹',
    change24h: 0,
    changePercent24h: 0,
    exchange: 'Mumbai Real Estate',
    location: 'Bandra West, Mumbai',
    yearBuilt: 2024,
    unit: 'per sq ft',
    description: 'Prime residential land plot in the heart of Bandra West with excellent connectivity and infrastructure.',
    lastUpdated: new Date(),
    fundamentals: {
      'Area (sq ft)': '2,400',
      'FSI': '2.5',
      'Zone': 'Residential',
      'Parking': 'Available',
      'Amenities': 'Metro, Schools, Hospitals nearby',
      'Legal Status': 'Clear Title',
      'Registration': 'Ready',
      'Rental Yield': '3.2%'
    }
  },
  'land-mumbai-andheri': {
    symbol: 'LAND-AND',
    name: 'Commercial Plot - Andheri East',
    type: 'property',
    currentPrice: 32000,
    currency: '₹',
    change24h: 800,
    changePercent24h: 2.6,
    exchange: 'Mumbai Real Estate',
    location: 'Andheri East, Mumbai',
    yearBuilt: 2023,
    unit: 'per sq ft',
    description: 'Strategic commercial land plot near SEEPZ with high growth potential.',
    lastUpdated: new Date(),
    fundamentals: {
      'Area (sq ft)': '5,000',
      'FSI': '4.0',
      'Zone': 'Commercial',
      'Parking': '50 slots',
      'Amenities': 'Metro, Airport connectivity',
      'Legal Status': 'Clear Title',
      'Registration': 'Ready',
      'Expected ROI': '18% p.a.'
    }
  }
};

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual API key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

export function parseAssetSlug(slug: string): { type: AssetType; symbol: string } {
  // Property assets
  if (slug.startsWith('land-')) {
    return { type: 'property', symbol: slug };
  }
  
  // Commodity assets
  const commodities = ['gold', 'silver', 'crude', 'copper', 'natural-gas'];
  if (commodities.includes(slug.toLowerCase())) {
    return { type: 'commodity', symbol: slug.toUpperCase() };
  }
  
  // Default to equity for stock symbols like TCS.NS, RELIANCE.BO
  return { type: 'equity', symbol: slug.toUpperCase() };
}

export async function getAssetData(slug: string): Promise<AssetData> {
  const { type, symbol } = parseAssetSlug(slug);
  
  switch (type) {
    case 'property':
      return getPropertyData(symbol);
    case 'commodity':
      return getCommodityData(symbol);
    case 'equity':
      return getEquityData(symbol);
    default:
      throw new Error(`Unsupported asset type: ${type}`);
  }
}

async function getPropertyData(symbol: string): Promise<AssetData> {
  const data = propertyData[symbol];
  if (!data) {
    throw new Error(`Property data not found for ${symbol}`);
  }
  
  // Simulate some price movement for demo
  const randomChange = (Math.random() - 0.5) * 1000;
  const changePercent = (randomChange / data.currentPrice) * 100;
  
  return {
    ...data,
    change24h: Math.round(randomChange),
    changePercent24h: Number(changePercent.toFixed(2)),
    lastUpdated: new Date()
  };
}

async function getCommodityData(symbol: string): Promise<AssetData> {
  try {
    // For demo purposes, using mock data. In production, integrate with Alpha Vantage
    const mockCommodityData: Record<string, Partial<AssetData>> = {
      'GOLD': {
        name: 'Gold',
        currentPrice: 2658.45,
        currency: '$',
        change24h: 12.30,
        changePercent24h: 0.46,
        volume: 145230000,
        unit: 'per troy oz',
        exchange: 'COMEX'
      },
      'SILVER': {
        name: 'Silver',
        currentPrice: 30.85,
        currency: '$',
        change24h: -0.45,
        changePercent24h: -1.44,
        volume: 89450000,
        unit: 'per troy oz',
        exchange: 'COMEX'
      },
      'CRUDE': {
        name: 'Crude Oil WTI',
        currentPrice: 71.24,
        currency: '$',
        change24h: 1.85,
        changePercent24h: 2.67,
        volume: 324560000,
        unit: 'per barrel',
        exchange: 'NYMEX'
      }
    };

    const baseData = mockCommodityData[symbol];
    if (!baseData) {
      throw new Error(`Commodity data not found for ${symbol}`);
    }

    return {
      symbol,
      type: 'commodity',
      description: `${baseData.name} commodity futures and spot prices`,
      lastUpdated: new Date(),
      fundamentals: {
        '52 Week High': `${baseData.currency}${(baseData.currentPrice! * 1.15).toFixed(2)}`,
        '52 Week Low': `${baseData.currency}${(baseData.currentPrice! * 0.85).toFixed(2)}`,
        'Market': baseData.exchange,
        'Trading Hours': '23:00 GMT - 22:00 GMT',
        'Contract Size': '1000 units',
        'Minimum Tick': '0.01'
      },
      ...baseData
    } as AssetData;
  } catch (error) {
    throw new Error(`Failed to fetch commodity data: ${error}`);
  }
}

async function getEquityData(symbol: string): Promise<AssetData> {
  try {
    // For demo purposes, using mock data. In production, integrate with Alpha Vantage
    const mockEquityData: Record<string, Partial<AssetData>> = {
      'TCS.NS': {
        name: 'Tata Consultancy Services',
        currentPrice: 4125.30,
        currency: '₹',
        change24h: -35.40,
        changePercent24h: -0.85,
        volume: 1250000,
        marketCap: 15200000000000, // 15.2 trillion
        exchange: 'NSE'
      },
      'RELIANCE.BO': {
        name: 'Reliance Industries Limited',
        currentPrice: 2845.60,
        currency: '₹',
        change24h: 57.20,
        changePercent24h: 2.05,
        volume: 3200000,
        marketCap: 19200000000000, // 19.2 trillion
        exchange: 'BSE'
      },
      'INFY.NS': {
        name: 'Infosys Limited',
        currentPrice: 1890.75,
        currency: '₹',
        change24h: 39.87,
        changePercent24h: 2.1,
        volume: 2100000,
        marketCap: 7800000000000, // 7.8 trillion
        exchange: 'NSE'
      },
      'HDFCBANK.NS': {
        name: 'HDFC Bank Limited',
        currentPrice: 1672.45,
        currency: '₹',
        change24h: -25.68,
        changePercent24h: -1.5,
        volume: 4500000,
        marketCap: 12600000000000, // 12.6 trillion
        exchange: 'NSE'
      }
    };

    const baseData = mockEquityData[symbol];
    if (!baseData) {
      throw new Error(`Equity data not found for ${symbol}`);
    }

    return {
      symbol,
      type: 'equity',
      description: `${baseData.name} - Indian equity stock trading on ${baseData.exchange}`,
      website: `https://www.${symbol.split('.')[0].toLowerCase()}.com`,
      lastUpdated: new Date(),
      fundamentals: {
        'Market Cap': `₹${(baseData.marketCap! / 1e12).toFixed(1)}T`,
        'P/E Ratio': '24.5',
        'P/B Ratio': '3.8',
        'Dividend Yield': '1.2%',
        'EPS': `₹${(baseData.currentPrice! / 24.5).toFixed(2)}`,
        '52 Week High': `₹${(baseData.currentPrice! * 1.25).toFixed(2)}`,
        '52 Week Low': `₹${(baseData.currentPrice! * 0.75).toFixed(2)}`,
        'Book Value': `₹${(baseData.currentPrice! / 3.8).toFixed(2)}`
      },
      chartData: generateMockChartData(baseData.currentPrice!),
      ...baseData
    } as AssetData;
  } catch (error) {
    throw new Error(`Failed to fetch equity data: ${error}`);
  }
}

function generateMockChartData(currentPrice: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const days = 30;
  let price = currentPrice * 0.95; // Start 5% lower
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 5000000) + 1000000
    });
    
    price = close;
  }
  
  return data;
}

// Cache helper functions
function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// API rate limiting helper
export function createRateLimiter(maxCalls: number, windowMs: number) {
  const calls: number[] = [];
  
  return function canMakeCall(): boolean {
    const now = Date.now();
    // Remove calls outside the window
    while (calls.length > 0 && calls[0] < now - windowMs) {
      calls.shift();
    }
    
    if (calls.length < maxCalls) {
      calls.push(now);
      return true;
    }
    
    return false;
  };
}

// Alpha Vantage rate limiter (5 calls per minute for free tier)
export const alphaVantageRateLimiter = createRateLimiter(5, 60000);

// Export for testing
export { propertyData };