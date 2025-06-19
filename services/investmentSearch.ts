export interface SearchQuery {
  id: string;
  query: string;
  type: 'sector' | 'real-estate' | 'equity' | 'mutual-fund' | 'treasury' | 'commodity' | 'general';
  timestamp: Date;
  followUpQuestions?: string[];
  context?: any;
}

export interface SectorData {
  name: string;
  companies: Company[];
  marketTrends: string[];
  macroFactors: string[];
  growthPotential: 'High' | 'Medium' | 'Low';
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface Company {
  name: string;
  symbol: string;
  marketCap: string;
  marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  growthPotential: 'High' | 'Medium' | 'Low';
  region: 'India' | 'Global';
}

export interface RealEstateData {
  location: string;
  averagePrice: string;
  priceAppreciation: string;
  marketTrends: string[];
  pros: string[];
  cons: string[];
  recommendation: 'Buy' | 'Wait' | 'Avoid';
}

export interface SearchResponse {
  type: 'sector-analysis' | 'real-estate-advice' | 'company-list' | 'follow-up-question' | 'general-advice';
  title: string;
  data: any;
  followUpQuestions?: string[];
  nextSteps?: string[];
}

class InvestmentSearchService {
  private static instance: InvestmentSearchService;
  private searchHistory: SearchQuery[] = [];

  static getInstance(): InvestmentSearchService {
    if (!InvestmentSearchService.instance) {
      InvestmentSearchService.instance = new InvestmentSearchService();
    }
    return InvestmentSearchService.instance;
  }

  private categorizeQuery(query: string): SearchQuery['type'] {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('house') || lowerQuery.includes('property') || lowerQuery.includes('real estate') || lowerQuery.includes('home')) {
      return 'real-estate';
    }
    if (lowerQuery.includes('sector') || lowerQuery.includes('semiconductor') || lowerQuery.includes('technology') || 
        lowerQuery.includes('pharma') || lowerQuery.includes('banking') || lowerQuery.includes('automotive')) {
      return 'sector';
    }
    if (lowerQuery.includes('mutual fund') || lowerQuery.includes('sip') || lowerQuery.includes('fund')) {
      return 'mutual-fund';
    }
    if (lowerQuery.includes('treasury') || lowerQuery.includes('bond') || lowerQuery.includes('government')) {
      return 'treasury';
    }
    if (lowerQuery.includes('gold') || lowerQuery.includes('silver') || lowerQuery.includes('commodity') || lowerQuery.includes('oil')) {
      return 'commodity';
    }
    if (lowerQuery.includes('stock') || lowerQuery.includes('equity') || lowerQuery.includes('share')) {
      return 'equity';
    }
    
    return 'general';
  }

  private extractSectorFromQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('semiconductor') || lowerQuery.includes('chip')) return 'semiconductors';
    if (lowerQuery.includes('technology') || lowerQuery.includes('tech') || lowerQuery.includes('it')) return 'technology';
    if (lowerQuery.includes('pharma') || lowerQuery.includes('pharmaceutical') || lowerQuery.includes('medicine')) return 'pharmaceuticals';
    if (lowerQuery.includes('bank') || lowerQuery.includes('financial')) return 'banking';
    if (lowerQuery.includes('auto') || lowerQuery.includes('car') || lowerQuery.includes('vehicle')) return 'automotive';
    if (lowerQuery.includes('energy') || lowerQuery.includes('power') || lowerQuery.includes('renewable')) return 'energy';
    if (lowerQuery.includes('fmcg') || lowerQuery.includes('consumer')) return 'fmcg';
    
    return 'technology'; // default
  }

  private getSectorData(sector: string, region: 'India' | 'Global' = 'India'): SectorData {
    const sectorData: Record<string, SectorData> = {
      semiconductors: {
        name: 'Semiconductors',
        companies: region === 'India' ? [
          { name: 'Tata Elxsi', symbol: 'TATAELXSI', marketCap: '₹48,250 Cr', marketCapCategory: 'Large Cap', price: '7,245.30', change: '+145.20', changePercent: '+2.05%', isPositive: true, growthPotential: 'High', region: 'India' },
          { name: 'Dixon Technologies', symbol: 'DIXON', marketCap: '₹22,840 Cr', marketCapCategory: 'Mid Cap', price: '12,850.75', change: '-85.40', changePercent: '-0.66%', isPositive: false, growthPotential: 'High', region: 'India' },
          { name: 'LTTS', symbol: 'LTTS', marketCap: '₹45,120 Cr', marketCapCategory: 'Large Cap', price: '4,287.60', change: '+92.15', changePercent: '+2.20%', isPositive: true, growthPotential: 'Medium', region: 'India' }
        ] : [
          { name: 'NVIDIA Corporation', symbol: 'NVDA', marketCap: '$2.8T', marketCapCategory: 'Large Cap', price: '$875.25', change: '+12.45', changePercent: '+1.44%', isPositive: true, growthPotential: 'High', region: 'Global' },
          { name: 'Taiwan Semiconductor', symbol: 'TSM', marketCap: '$520B', marketCapCategory: 'Large Cap', price: '$142.80', change: '-2.15', changePercent: '-1.48%', isPositive: false, growthPotential: 'High', region: 'Global' },
          { name: 'ASML Holding', symbol: 'ASML', marketCap: '$285B', marketCapCategory: 'Large Cap', price: '$695.40', change: '+8.75', changePercent: '+1.27%', isPositive: true, growthPotential: 'High', region: 'Global' }
        ],
        marketTrends: [
          'AI chip demand driving unprecedented growth',
          'Supply chain normalization after 2-year shortage',
          'Increasing investment in domestic manufacturing'
        ],
        macroFactors: [
          'US-China trade tensions affecting global supply chains',
          'Taiwan geopolitical risks impacting TSMC operations',
          'Government subsidies boosting domestic production',
          'Rising interest rates affecting capital-intensive projects'
        ],
        growthPotential: 'High',
        riskLevel: 'Medium'
      },
      technology: {
        name: 'Information Technology',
        companies: region === 'India' ? [
          { name: 'Tata Consultancy Services', symbol: 'TCS', marketCap: '₹15,24,680 Cr', marketCapCategory: 'Large Cap', price: '4,125.30', change: '+112.80', changePercent: '+2.81%', isPositive: true, growthPotential: 'Medium', region: 'India' },
          { name: 'Infosys', symbol: 'INFY', marketCap: '₹7,89,450 Cr', marketCapCategory: 'Large Cap', price: '1,890.75', change: '+39.80', changePercent: '+2.15%', isPositive: true, growthPotential: 'Medium', region: 'India' },
          { name: 'HCL Technologies', symbol: 'HCLTECH', marketCap: '₹4,12,380 Cr', marketCapCategory: 'Large Cap', price: '1,520.45', change: '-15.25', changePercent: '-0.99%', isPositive: false, growthPotential: 'Medium', region: 'India' }
        ] : [
          { name: 'Microsoft Corporation', symbol: 'MSFT', marketCap: '$2.8T', marketCapCategory: 'Large Cap', price: '$385.50', change: '+4.25', changePercent: '+1.12%', isPositive: true, growthPotential: 'High', region: 'Global' },
          { name: 'Apple Inc.', symbol: 'AAPL', marketCap: '$3.1T', marketCapCategory: 'Large Cap', price: '$195.75', change: '-1.85', changePercent: '-0.94%', isPositive: false, growthPotential: 'Medium', region: 'Global' },
          { name: 'Alphabet Inc.', symbol: 'GOOGL', marketCap: '$1.7T', marketCapCategory: 'Large Cap', price: '$142.30', change: '+2.10', changePercent: '+1.50%', isPositive: true, growthPotential: 'High', region: 'Global' }
        ],
        marketTrends: [
          'AI and machine learning driving new revenue streams',
          'Cloud computing market showing robust growth',
          'Digital transformation accelerating across industries'
        ],
        macroFactors: [
          'Rising interest rates affecting tech valuations',
          'Regulatory scrutiny on big tech companies',
          'Talent shortage driving up operational costs',
          'Economic slowdown impacting enterprise spending'
        ],
        growthPotential: 'High',
        riskLevel: 'Medium'
      }
    };

    return sectorData[sector] || sectorData.technology;
  }

  private getRealEstateData(location: string): RealEstateData {
    const realEstateData: Record<string, RealEstateData> = {
      bangalore: {
        location: 'Bangalore',
        averagePrice: '₹8,500/sq ft',
        priceAppreciation: '+12% YoY',
        marketTrends: [
          'IT hub driving residential demand',
          'Infrastructure development boosting connectivity',
          'Premium segments showing strong growth'
        ],
        pros: [
          'Strong job market and IT industry presence',
          'Excellent infrastructure and connectivity',
          'Good rental yields (3-4%)',
          'High appreciation potential'
        ],
        cons: [
          'High property prices compared to other cities',
          'Traffic congestion issues',
          'Water scarcity concerns',
          'Regulatory challenges for approvals'
        ],
        recommendation: 'Buy'
      },
      mumbai: {
        location: 'Mumbai',
        averagePrice: '₹18,500/sq ft',
        priceAppreciation: '+8% YoY',
        marketTrends: [
          'Premium real estate market showing resilience',
          'Infrastructure projects like metro expansion',
          'Limited land availability driving prices'
        ],
        pros: [
          'Financial capital with diverse job opportunities',
          'Excellent connectivity and infrastructure',
          'Strong rental market',
          'Liquid real estate market'
        ],
        cons: [
          'Extremely high property prices',
          'Space constraints and high population density',
          'Monsoon-related infrastructure issues',
          'High cost of living'
        ],
        recommendation: 'Wait'
      },
      delhi: {
        location: 'Delhi NCR',
        averagePrice: '₹6,800/sq ft',
        priceAppreciation: '+6% YoY',
        marketTrends: [
          'Government sector and corporates driving demand',
          'New town developments in surrounding areas',
          'Metro expansion improving connectivity'
        ],
        pros: [
          'Capital city with government job security',
          'Better infrastructure compared to other tier-1 cities',
          'Educational institutions and healthcare facilities',
          'Diverse economic opportunities'
        ],
        cons: [
          'Air pollution concerns',
          'Extreme weather conditions',
          'Regulatory and bureaucratic challenges',
          'Water table depletion issues'
        ],
        recommendation: 'Buy'
      }
    };

    const normalizedLocation = location.toLowerCase();
    if (normalizedLocation.includes('bangalore') || normalizedLocation.includes('bengaluru')) {
      return realEstateData.bangalore;
    }
    if (normalizedLocation.includes('mumbai')) {
      return realEstateData.mumbai;
    }
    if (normalizedLocation.includes('delhi') || normalizedLocation.includes('ncr') || normalizedLocation.includes('gurgaon') || normalizedLocation.includes('noida')) {
      return realEstateData.delhi;
    }

    // Default response for unknown locations
    return {
      location: location,
      averagePrice: 'Data not available',
      priceAppreciation: 'Contact local experts',
      marketTrends: ['Limited data available for this location'],
      pros: ['Consult with local real estate experts'],
      cons: ['Market data not readily available'],
      recommendation: 'Wait'
    };
  }

  async processQuery(query: string, context?: any): Promise<SearchResponse> {
    const searchQuery: SearchQuery = {
      id: Date.now().toString(),
      query,
      type: this.categorizeQuery(query),
      timestamp: new Date(),
      context
    };

    this.searchHistory.unshift(searchQuery);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (searchQuery.type) {
      case 'sector':
        return this.processSectorQuery(query, context);
      
      case 'real-estate':
        return this.processRealEstateQuery(query, context);
      
      case 'equity':
        return this.processEquityQuery(query, context);
      
      default:
        return this.processGeneralQuery(query);
    }
  }

  private processSectorQuery(query: string, context?: any): SearchResponse {
    const sector = this.extractSectorFromQuery(query);
    
    // If no region specified, ask for clarification
    if (!context?.region) {
      return {
        type: 'follow-up-question',
        title: `Investment Options in ${sector.charAt(0).toUpperCase() + sector.slice(1)}`,
        data: {
          sector,
          question: 'Would you like to explore investment opportunities in India or globally?',
          options: ['India', 'Global']
        },
        followUpQuestions: [
          'Show me Indian semiconductor companies',
          'What are the global leaders in this sector?',
          'Compare Indian vs global opportunities'
        ]
      };
    }

    const sectorData = this.getSectorData(sector, context.region);
    
    return {
      type: 'sector-analysis',
      title: `${sectorData.name} Sector Analysis - ${context.region}`,
      data: sectorData,
      nextSteps: [
        'Add companies to watchlist',
        'Set up sector news alerts',
        'Analyze individual company fundamentals',
        'Review sector ETF options'
      ]
    };
  }

  private processRealEstateQuery(query: string, context?: any): SearchResponse {
    // If no location specified, ask for clarification
    if (!context?.location) {
      return {
        type: 'follow-up-question',
        title: 'Real Estate Investment Analysis',
        data: {
          question: 'Which city or area are you considering for property investment?',
          popularOptions: ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai']
        },
        followUpQuestions: [
          'Should I buy property in Bangalore?',
          'Real estate trends in Mumbai',
          'Best cities for property investment in India'
        ]
      };
    }

    const realEstateData = this.getRealEstateData(context.location);
    
    return {
      type: 'real-estate-advice',
      title: `Real Estate Analysis - ${realEstateData.location}`,
      data: realEstateData,
      nextSteps: [
        'Research specific localities',
        'Compare with other cities',
        'Calculate EMI and affordability',
        'Consult local real estate experts'
      ]
    };
  }

  private processEquityQuery(query: string, context?: any): SearchResponse {
    return {
      type: 'general-advice',
      title: 'Equity Investment Guidance',
      data: {
        content: 'Equity investments can be approached through various strategies. Would you like to explore individual stocks, equity mutual funds, or ETFs?',
        suggestions: [
          'Diversified equity mutual funds for beginners',
          'Blue-chip stocks for stable returns',
          'Small-cap funds for higher growth potential',
          'Index funds for market exposure'
        ]
      },
      followUpQuestions: [
        'Best equity mutual funds for SIP',
        'How to analyze individual stocks',
        'Difference between large cap and small cap funds'
      ]
    };
  }

  private processGeneralQuery(query: string): SearchResponse {
    return {
      type: 'general-advice',
      title: 'Investment Guidance',
      data: {
        content: 'I can help you with various investment decisions. You can ask me about sectors, real estate, mutual funds, stocks, or general financial planning.',
        suggestions: [
          'I want to invest in technology sector',
          'Should I buy a house in Bangalore?',
          'Best mutual funds for long-term investment',
          'How to start investing with ₹10,000?'
        ]
      },
      followUpQuestions: [
        'What are the best investment options for beginners?',
        'How much should I invest in equity vs debt?',
        'Tax-saving investment options in India'
      ]
    };
  }

  getSearchHistory(): SearchQuery[] {
    return this.searchHistory.slice(0, 10); // Return last 10 searches
  }

  getSuggestedQueries(): string[] {
    return [
      'I want to invest in semiconductors',
      'Should I buy a house in Bangalore?',
      'Best technology stocks in India',
      'Real estate vs mutual funds',
      'How to invest in global markets?',
      'Tax-saving investment options',
      'SIP vs lump sum investment',
      'Should I invest in gold right now?'
    ];
  }
}

export const investmentSearchService = InvestmentSearchService.getInstance();