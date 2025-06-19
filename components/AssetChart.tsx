import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, MapPin, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, CandlestickChart, BarChart, Bar } from 'recharts';
import { AssetData } from '../utils/assetUtils';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AssetChartProps {
  assetData: AssetData;
}

type ChartTimeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
type ChartType = 'line' | 'area' | 'candlestick';

export function AssetChart({ assetData }: AssetChartProps) {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');

  const timeframes: ChartTimeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  // Generate chart data based on timeframe
  const getChartData = () => {
    if (assetData.type === 'property') {
      // For property, show location map/image instead of price chart
      return null;
    }

    // Use existing chart data or generate mock data
    if (assetData.chartData) {
      return assetData.chartData.map(point => ({
        date: point.timestamp,
        price: point.close,
        open: point.open,
        high: point.high,
        low: point.low,
        volume: point.volume || 0
      }));
    }

    // Generate mock data for different timeframes
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : 90;
    const data = [];
    let price = assetData.currentPrice;

    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date();
      if (timeframe === '1D') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }

      const change = (Math.random() - 0.5) * 0.02 * price; // 2% volatility
      price += change;

      data.push({
        date: timeframe === '1D' ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(price.toFixed(2)),
        open: Number((price - change).toFixed(2)),
        high: Number((price + Math.abs(change) * 0.5).toFixed(2)),
        low: Number((price - Math.abs(change) * 0.5).toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    return data;
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Price: <span className="font-semibold text-foreground">{assetData.currency}{data.price?.toLocaleString()}</span>
            </p>
            {chartType === 'candlestick' && (
              <>
                <p className="text-xs text-muted-foreground">
                  Open: {assetData.currency}{data.open?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  High: {assetData.currency}{data.high?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Low: {assetData.currency}{data.low?.toLocaleString()}
                </p>
              </>
            )}
            {data.volume && (
              <p className="text-xs text-muted-foreground">
                Volume: {data.volume.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Property-specific display
  if (assetData.type === 'property') {
    return (
      <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-xl border border-green-500/20">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Property Location</CardTitle>
                <CardDescription className="text-sm">{assetData.location}</CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-600 border-green-500/30 px-3 py-1.5 font-medium">
              {assetData.unit}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Property Image/Map Placeholder */}
          <div className="relative h-64 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Property Location Map</p>
                <p className="text-xs text-muted-foreground/70">{assetData.location}</p>
              </div>
            </div>
            {/* Overlay with property details */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="text-white">
                <p className="text-sm font-medium mb-1">{assetData.name}</p>
                <p className="text-xs opacity-90">{assetData.description}</p>
              </div>
            </div>
          </div>

          {/* Property Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl border border-green-500/20">
              <p className="text-2xl font-bold text-green-600">{assetData.currentPrice.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{assetData.currency} {assetData.unit}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-600">{assetData.yearBuilt}</p>
              <p className="text-sm text-muted-foreground">Year Built</p>
            </div>
          </div>

          {/* Market Trend for Property */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Local Market Trend</h4>
            <div className="h-32 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg border border-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Property values trending upward</p>
                <p className="text-xs text-green-600 font-medium">+8.5% YoY growth</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Financial assets (equity/commodity) chart
  return (
    <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-chart-1/30 to-chart-1/10 rounded-xl border border-chart-1/20">
              <BarChart3 className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-lg">Price Chart</CardTitle>
              <CardDescription className="text-sm">
                {assetData.name} - {timeframe} view
              </CardDescription>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Timeframe Selector */}
            <div className="flex bg-secondary/50 rounded-lg p-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={`text-xs px-3 py-1.5 transition-all duration-200 ${
                    timeframe === tf 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex bg-secondary/50 rounded-lg p-1">
              {(['line', 'area', 'candlestick'] as ChartType[]).map((type) => (
                <Button
                  key={type}
                  variant={chartType === type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType(type)}
                  className={`text-xs px-3 py-1.5 transition-all duration-200 capitalize ${
                    chartType === type 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type === 'candlestick' ? 'Candle' : type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: "rgb(59, 130, 246)" }}
                  />
                </LineChart>
              ) : (
                // Candlestick chart simulation using bar chart
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(148, 163, 184, 0.6)"
                    fontSize={12}
                    tickLine={false}
                    domain={['dataMin - 50', 'dataMax + 50']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="price" 
                    fill="rgb(59, 130, 246)"
                    opacity={0.7}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Chart data loading...</p>
                <p className="text-xs text-muted-foreground/70">Please wait while we fetch the latest data</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart Summary */}
        {chartData && chartData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/60">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Period High</p>
                <p className="text-sm font-semibold text-foreground">
                  {assetData.currency}{Math.max(...chartData.map(d => d.price)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Period Low</p>
                <p className="text-sm font-semibold text-foreground">
                  {assetData.currency}{Math.min(...chartData.map(d => d.price)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Avg Volume</p>
                <p className="text-sm font-semibold text-foreground">
                  {(chartData.reduce((sum, d) => sum + (d.volume || 0), 0) / chartData.length).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                <p className="text-sm font-semibold text-foreground">
                  {(Math.max(...chartData.map(d => d.price)) / Math.min(...chartData.map(d => d.price)) * 100 - 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}