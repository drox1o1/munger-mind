import React, { useState } from 'react';
import { Star, Plus, TrendingUp, TrendingDown, MoreVertical, Eye, Bell, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  type: 'STOCK' | 'INDEX' | 'ETF' | 'COMMODITY' | 'PROPERTY';
  exchange: string;
  slug: string;
}

interface WatchlistProps {
  onAssetClick?: (slug: string) => void;
}

export function Watchlist({ onAssetClick }: WatchlistProps) {
  const [watchlistItems] = useState<WatchlistItem[]>([
    {
      id: '1',
      symbol: 'Reliance Ind.',
      name: 'RELIANCE.NSE',
      price: '₹2,845.60',
      change: '+57.20',
      changePercent: '+2.05%',
      isPositive: true,
      type: 'STOCK',
      exchange: 'NSE',
      slug: 'RELIANCE.NSE'
    },
    {
      id: '2',
      symbol: 'Nifty 50',
      name: 'NIFTY',
      price: '22,475.85',
      change: '+265.40',
      changePercent: '+1.2%',
      isPositive: true,
      type: 'INDEX',
      exchange: 'NSE',
      slug: 'NIFTY50.NSE'
    },
    {
      id: '3',
      symbol: 'TCS',
      name: 'TCS.NSE',
      price: '₹4,125.30',
      change: '-35.40',
      changePercent: '-0.85%',
      isPositive: false,
      type: 'STOCK',
      exchange: 'NSE',
      slug: 'TCS.NS'
    },
    {
      id: '4',
      symbol: 'Gold',
      name: 'GOLD',
      price: '$2,658.45',
      change: '+12.30',
      changePercent: '+0.46%',
      isPositive: true,
      type: 'COMMODITY',
      exchange: 'COMEX',
      slug: 'gold'
    },
    {
      id: '5',
      symbol: 'Mumbai Land',
      name: 'LAND-BDR',
      price: '₹45,000',
      change: '0',
      changePercent: '0.00%',
      isPositive: true,
      type: 'PROPERTY',
      exchange: 'Mumbai RE',
      slug: 'land-mumbai-bandra'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'STOCK':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-600 border-blue-500/30';
      case 'INDEX':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-600 border-purple-500/30';
      case 'ETF':
        return 'bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-600 border-green-500/30';
      case 'COMMODITY':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-600 border-amber-500/30';
      case 'PROPERTY':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-600 border-emerald-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const handleAssetClick = (slug: string) => {
    if (onAssetClick) {
      onAssetClick(slug);
    }
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
      <CardHeader className="pb-4 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-chart-3/30 to-chart-3/10 rounded-xl border border-chart-3/20">
              <Star className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-lg">Watchlist</CardTitle>
              <CardDescription className="text-sm">Track your investments</CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3 h-full overflow-auto custom-scrollbar">
        {watchlistItems.map((item) => (
          <div key={item.id} className="group relative">
            {/* Main Container - Now a div instead of button */}
            <div className="relative p-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              
              {/* Clickable Area - Covers most of the card */}
              <div
                onClick={() => handleAssetClick(item.slug)}
                className="absolute inset-0 cursor-pointer touch-target"
                style={{ right: '40px' }} // Leave space for dropdown
              />

              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="text-sm font-semibold text-foreground truncate">{item.symbol}</h5>
                    <Badge className={`text-xs px-2 py-0.5 ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                </div>
                
                {/* Dropdown Menu - Now properly positioned and not nested */}
                <div className="relative z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity touch-target"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleAssetClick(item.slug)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="w-4 h-4 mr-2" />
                        Set Alert
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Price and Change Row */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-foreground mb-1">{item.price}</p>
                  <p className="text-xs text-muted-foreground">{item.exchange}</p>
                </div>
                
                <div className="text-right">
                  <div className={`flex items-center justify-end space-x-1 ${item.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {item.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-sm font-semibold">{item.changePercent}</span>
                  </div>
                  <p className={`text-xs font-medium mt-1 ${item.isPositive ? 'text-profit' : 'text-loss'}`}>
                    {item.change}
                  </p>
                </div>
              </div>

              {/* Progress indicator for performance */}
              <div className="mt-3">
                <div className="w-full bg-secondary/30 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      item.isPositive ? 'bg-profit' : 'bg-loss'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(parseFloat(item.changePercent.replace('%', ''))), 5) * 20}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add More Stocks Button */}
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset to Watchlist
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t border-border/30">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-profit/10 to-profit/5 rounded-lg border border-profit/20">
              <p className="text-xs text-muted-foreground mb-1">Gainers</p>
              <p className="text-sm font-semibold text-profit">4</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-loss/10 to-loss/5 rounded-lg border border-loss/20">
              <p className="text-xs text-muted-foreground mb-1">Losers</p>
              <p className="text-sm font-semibold text-loss">1</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}