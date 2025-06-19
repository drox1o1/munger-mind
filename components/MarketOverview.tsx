import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Globe, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  slug: string;
}

interface SectorData {
  name: string;
  change: string;
  isPositive: boolean;
}

interface MarketOverviewProps {
  onAssetClick?: (slug: string) => void;
}

export function MarketOverview({ onAssetClick }: MarketOverviewProps) {
  const indianIndices: MarketData[] = [
    { symbol: 'Nifty 50', name: 'NIFTY', price: '22,475', change: '+265.40', changePercent: '+1.2%', isPositive: true, slug: 'NIFTY50.NSE' },
    { symbol: 'Sensex', name: 'BSE', price: '74,205', change: '+815.05', changePercent: '+1.1%', isPositive: true, slug: 'SENSEX.BSE' },
    { symbol: 'Bank Nifty', name: 'BANKNIFTY', price: '48,720', change: '-392.75', changePercent: '-0.8%', isPositive: false, slug: 'BANKNIFTY.NSE' },
    { symbol: 'Nifty IT', name: 'NIFTYIT', price: '34,890.15', change: '+785.20', changePercent: '+2.3%', isPositive: true, slug: 'NIFTYIT.NSE' }
  ];

  const globalIndices: MarketData[] = [
    { symbol: 'S&P 500', name: 'SPX', price: '5,627.8', change: '+67.87', changePercent: '+1.2%', isPositive: true, slug: 'SPX.US' },
    { symbol: 'NASDAQ', name: 'NASDAQ', price: '17,592.1', change: '+123.45', changePercent: '+0.7%', isPositive: true, slug: 'NASDAQ.US' },
    { symbol: 'FTSE 100', name: 'FTSE', price: '8,105.4', change: '-23.67', changePercent: '-0.3%', isPositive: false, slug: 'FTSE.UK' },
    { symbol: 'Nikkei 225', name: 'NIKKEI', price: '38,725.20', change: '+287.15', changePercent: '+0.8%', isPositive: true, slug: 'NIKKEI.JP' }
  ];

  const sectorPerformance: SectorData[] = [
    { name: 'Technology', change: '+2.8%', isPositive: true },
    { name: 'Banking', change: '-0.5%', isPositive: false },
    { name: 'Pharmaceuticals', change: '+1.9%', isPositive: true },
    { name: 'Automobiles', change: '+0.7%', isPositive: true },
    { name: 'Energy', change: '-1.2%', isPositive: false },
    { name: 'FMCG', change: '+0.3%', isPositive: true }
  ];

  const topMovers: MarketData[] = [
    { symbol: 'Reliance Industries', name: 'RELIANCE.NSE', price: '₹2,845.60', change: '+2.05%', changePercent: '+57.20', isPositive: true, slug: 'RELIANCE.NSE' },
    { symbol: 'TCS', name: 'TCS.NSE', price: '₹4,125.30', change: '-0.85%', changePercent: '-35.40', isPositive: false, slug: 'TCS.NS' },
    { symbol: 'HDFC Bank', name: 'HDFCBANK.NSE', price: '₹1,672.45', change: '-1.5%', changePercent: '-25.68', isPositive: false, slug: 'HDFCBANK.NS' },
    { symbol: 'Infosys', name: 'INFY.NSE', price: '₹1,890.75', change: '+2.1%', changePercent: '+39.87', isPositive: true, slug: 'INFY.NS' }
  ];

  const handleAssetClick = (slug: string) => {
    if (onAssetClick) {
      onAssetClick(slug);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-chart-1/30 to-chart-1/10 rounded-xl border border-chart-1/20">
              <BarChart3 className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-lg">Market Overview</CardTitle>
              <CardDescription className="text-sm">Real-time market data</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-profit/20 to-profit/10 text-profit border-profit/30 px-3 py-1.5 font-medium">
              <Activity className="w-3 h-3 mr-2" />
              Live
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6 h-full overflow-auto custom-scrollbar">
        {/* Indian Market Indices */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <div className="w-2 h-2 bg-chart-1 rounded-full mr-2" />
            Indian Market Indices
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {indianIndices.map((index, idx) => (
              <button
                key={idx}
                onClick={() => handleAssetClick(index.slug)}
                className="p-3 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-200 touch-target text-left w-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium text-foreground truncate">{index.symbol}</h5>
                    <p className="text-xs text-muted-foreground">{index.name}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${index.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {index.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{index.changePercent}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{index.price}</p>
                  <p className={`text-xs font-medium ${index.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {index.change}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sector Performance */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <div className="w-2 h-2 bg-chart-2 rounded-full mr-2" />
            Sector Performance
          </h4>
          <div className="space-y-2">
            {sectorPerformance.map((sector, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-secondary/20">
                <span className="text-sm text-foreground">{sector.name}</span>
                <div className={`flex items-center space-x-1 ${sector.isPositive ? 'text-profit' : 'text-loss'}`}>
                  {sector.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-sm font-medium">{sector.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <div className="w-2 h-2 bg-chart-3 rounded-full mr-2" />
            Top Movers
          </h4>
          <div className="space-y-3">
            {topMovers.map((stock, idx) => (
              <button
                key={idx}
                onClick={() => handleAssetClick(stock.slug)}
                className="w-full p-3 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-200 touch-target text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground truncate">{stock.symbol}</h5>
                    <p className="text-xs text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{stock.price}</p>
                    <div className={`flex items-center justify-end space-x-1 ${stock.isPositive ? 'text-profit' : 'text-loss'}`}>
                      {stock.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="text-xs font-medium">{stock.change}</span>
                    </div>
                    <p className={`text-xs ${stock.isPositive ? 'text-profit' : 'text-loss'}`}>
                      {stock.changePercent}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Global Markets */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <div className="w-2 h-2 bg-chart-4 rounded-full mr-2" />
            <Globe className="w-4 h-4 mr-1" />
            Global Markets
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {globalIndices.map((index, idx) => (
              <button
                key={idx}
                onClick={() => handleAssetClick(index.slug)}
                className="p-3 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-200 touch-target text-left w-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-medium text-foreground truncate">{index.symbol}</h5>
                    <p className="text-xs text-muted-foreground">{index.name}</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${index.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {index.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{index.changePercent}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{index.price}</p>
                  <p className={`text-xs font-medium ${index.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {index.change}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}