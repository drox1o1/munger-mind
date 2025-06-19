import React from 'react';
import { FileText, TrendingUp, Building, BarChart, Globe, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { AssetData } from '../utils/assetUtils';

interface AssetDataMetricsProps {
  assetData: AssetData;
  variant?: 'summary' | 'detailed';
}

export function AssetDataMetrics({ assetData, variant = 'detailed' }: AssetDataMetricsProps) {
  const isSummary = variant === 'summary';

  const getMetricIcon = (key: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Market Cap': <BarChart className="w-4 h-4" />,
      'P/E Ratio': <TrendingUp className="w-4 h-4" />,
      'Volume': <Globe className="w-4 h-4" />,
      'Area': <MapPin className="w-4 h-4" />,
      'Year Built': <Calendar className="w-4 h-4" />,
      'FSI': <Building className="w-4 h-4" />,
      'Market': <BarChart className="w-4 h-4" />,
      'Contract Size': <DollarSign className="w-4 h-4" />
    };
    
    for (const [pattern, icon] of Object.entries(iconMap)) {
      if (key.toLowerCase().includes(pattern.toLowerCase())) {
        return icon;
      }
    }
    return <FileText className="w-4 h-4" />;
  };

  const getMetricColor = (key: string, value: string) => {
    // Color coding based on metric type and value
    if (key.includes('Ratio') || key.includes('Yield')) {
      const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
      if (assetData.type === 'equity') {
        if (key.includes('P/E')) {
          if (numValue < 15) return 'text-profit';
          if (numValue > 30) return 'text-loss';
        }
        if (key.includes('Dividend Yield')) {
          if (numValue > 2) return 'text-profit';
        }
      }
    }
    
    if (key.includes('Change') || key.includes('Return')) {
      if (value.includes('+') || value.startsWith('₹') && !value.includes('-')) return 'text-profit';
      if (value.includes('-')) return 'text-loss';
    }
    
    return 'text-foreground';
  };

  const renderEquityMetrics = () => {
    const fundamentals = assetData.fundamentals || {};
    
    if (isSummary) {
      const keyMetrics = ['Market Cap', 'P/E Ratio', 'Dividend Yield', '52 Week High'];
      return (
        <div className="space-y-4">
          {keyMetrics.map((key) => {
            const value = fundamentals[key];
            if (!value) return null;
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(key)}
                  <span className="text-sm text-muted-foreground">{key}</span>
                </div>
                <span className={`text-sm font-semibold ${getMetricColor(key, value)}`}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Valuation Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-chart-1" />
            Valuation Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Market Cap', 'P/E Ratio', 'P/B Ratio', 'EPS'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              return (
                <div key={key} className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                  <p className="text-xs text-muted-foreground mb-1">{key}</p>
                  <p className={`text-lg font-semibold ${getMetricColor(key, value)}`}>{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Performance */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <BarChart className="w-4 h-4 mr-2 text-chart-2" />
            Price Performance
          </h4>
          <div className="space-y-3">
            {['52 Week High', '52 Week Low', 'Book Value'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
              const currentPrice = assetData.currentPrice;
              const percentage = key === '52 Week High' 
                ? ((currentPrice / numValue) * 100).toFixed(1)
                : key === '52 Week Low'
                ? ((currentPrice / numValue) * 100).toFixed(1)
                : null;
              
              return (
                <div key={key} className="p-3 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className={`text-sm font-semibold ${getMetricColor(key, value)}`}>{value}</span>
                  </div>
                  {percentage && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current vs {key}</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress 
                        value={Math.min(100, Number(percentage))} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Health */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-chart-3" />
            Financial Health
          </h4>
          <div className="p-4 bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-lg border border-chart-3/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dividend Yield</p>
                <p className="text-lg font-semibold text-profit">{fundamentals['Dividend Yield'] || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volume (24h)</p>
                <p className="text-lg font-semibold text-foreground">
                  {assetData.volume?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCommodityMetrics = () => {
    const fundamentals = assetData.fundamentals || {};
    
    if (isSummary) {
      const keyMetrics = ['52 Week High', '52 Week Low', 'Market', 'Contract Size'];
      return (
        <div className="space-y-4">
          {keyMetrics.map((key) => {
            const value = fundamentals[key];
            if (!value) return null;
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-lg border border-amber-500/20">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(key)}
                  <span className="text-sm text-muted-foreground">{key}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Trading Information */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Globe className="w-4 h-4 mr-2 text-chart-3" />
            Trading Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Market', 'Trading Hours', 'Contract Size', 'Minimum Tick'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              return (
                <div key={key} className="p-3 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-lg border border-amber-500/20">
                  <p className="text-xs text-muted-foreground mb-1">{key}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-chart-2" />
            Price Ranges
          </h4>
          <div className="space-y-3">
            {['52 Week High', '52 Week Low'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
              const currentPrice = assetData.currentPrice;
              const percentage = ((currentPrice / numValue) * 100).toFixed(1);
              
              return (
                <div key={key} className="p-3 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current vs {key}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress 
                      value={Math.min(100, Number(percentage))} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPropertyMetrics = () => {
    const fundamentals = assetData.fundamentals || {};
    
    if (isSummary) {
      const keyMetrics = ['Area (sq ft)', 'FSI', 'Zone', 'Rental Yield'];
      return (
        <div className="space-y-4">
          {keyMetrics.map((key) => {
            const value = fundamentals[key];
            if (!value) return null;
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2">
                  {getMetricIcon(key)}
                  <span className="text-sm text-muted-foreground">{key}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Property Details */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Building className="w-4 h-4 mr-2 text-chart-2" />
            Property Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Area (sq ft)', 'FSI', 'Zone', 'Parking'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              return (
                <div key={key} className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">{key}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal & Financial */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-chart-3" />
            Legal & Financial
          </h4>
          <div className="space-y-3">
            {['Legal Status', 'Registration', 'Rental Yield', 'Expected ROI'].map((key) => {
              const value = fundamentals[key];
              if (!value) return null;
              
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-secondary/20">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className={`text-sm font-semibold ${getMetricColor(key, value)}`}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-chart-1" />
            Location & Amenities
          </h4>
          <div className="p-4 bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-lg border border-chart-1/20">
            <p className="text-sm text-foreground">{fundamentals['Amenities'] || 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMetrics = () => {
    switch (assetData.type) {
      case 'equity':
        return renderEquityMetrics();
      case 'commodity':
        return renderCommodityMetrics();
      case 'property':
        return renderPropertyMetrics();
      default:
        return <p className="text-muted-foreground">No metrics available for this asset type.</p>;
    }
  };

  const getCardTitle = () => {
    if (isSummary) return 'Key Metrics';
    return `${assetData.type.charAt(0).toUpperCase() + assetData.type.slice(1)} Metrics`;
  };

  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-chart-2/30 to-chart-2/10 rounded-xl border border-chart-2/20">
            <FileText className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <CardTitle className="text-lg">{getCardTitle()}</CardTitle>
            <CardDescription className="text-sm">
              {isSummary ? 'Essential data points' : 'Comprehensive fundamental analysis'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {renderMetrics()}
        
        {/* Last Updated */}
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated</span>
          <span>{assetData.lastUpdated.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short'
          })}</span>
        </div>
      </CardContent>
    </Card>
  );
}