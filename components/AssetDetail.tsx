import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, AlertTriangle, FileText, Brain, RefreshCw, Share, BookOpen, Copy, Download, MapPin, Calendar, DollarSign, Globe, Building, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { AssetChart } from './AssetChart';
import { AssetNews } from './AssetNews';
import { AssetAIInsights } from './AssetAIInsights';
import { AssetJournal } from './AssetJournal';
import { AssetDataMetrics } from './AssetDataMetrics';
import { getAssetData, type AssetData } from '../utils/assetUtils';
import { triggerHapticFeedback } from '../utils/mobileUtils';

interface AssetDetailProps {
  slug: string;
  onBack: () => void;
}

export function AssetDetail({ slug, onBack }: AssetDetailProps) {
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssetData(slug);
        setAssetData(data);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [slug]);

  const handleRefresh = async () => {
    triggerHapticFeedback('medium');
    await fetchAssetData();
  };

  const handleShare = async () => {
    triggerHapticFeedback('light');
    if (navigator.share && assetData) {
      try {
        await navigator.share({
          title: `${assetData.name} - MungerMind`,
          text: `Check out ${assetData.name} analysis on MungerMind`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastUpdated.toLocaleDateString();
  };

  const getAssetTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'equity':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-600 border-blue-500/30';
      case 'commodity':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-600 border-amber-500/30';
      case 'property':
        return 'bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-600 border-green-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-600 border-gray-500/30';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-profit';
    if (change < 0) return 'text-loss';
    return 'text-neutral';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="h-8 bg-secondary/30 rounded-lg animate-pulse mb-2" />
            <div className="h-4 bg-secondary/20 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Loading Cards */}
        <div className="grid gap-6">
          <div className="h-80 bg-secondary/20 rounded-2xl animate-pulse" />
          <div className="h-96 bg-secondary/20 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !assetData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Asset Not Found</h1>
        </div>

        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error || 'The requested asset could not be found. Please check the URL and try again.'}
          </AlertDescription>
        </Alert>

        <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Asset Not Available</h3>
              <p className="text-muted-foreground mb-6">
                This asset may not be supported yet or the identifier might be incorrect.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={onBack} className="touch-target">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="touch-target">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="touch-target mt-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                {assetData.name}
              </h1>
              <Badge className={`${getAssetTypeColor(assetData.type)} px-3 py-1.5 font-medium`}>
                {assetData.type.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-muted-foreground">
              <p className="text-sm font-medium">{assetData.symbol}</p>
              {assetData.exchange && (
                <>
                  <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="text-sm">{assetData.exchange}</span>
                </>
              )}
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full" />
              <span className="text-sm">Updated {formatLastUpdated()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="touch-target"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="touch-target"
          >
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Price Header Card */}
      <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Price */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {assetData.currency}{assetData.currentPrice.toLocaleString()}
              </p>
            </div>

            {/* 24h Change */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">24h Change</p>
              <div className="flex items-center space-x-2">
                {assetData.change24h > 0 ? (
                  <TrendingUp className={`w-5 h-5 ${getChangeColor(assetData.change24h)}`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 ${getChangeColor(assetData.change24h)}`} />
                )}
                <div>
                  <p className={`text-lg font-semibold ${getChangeColor(assetData.change24h)}`}>
                    {assetData.changePercent24h > 0 ? '+' : ''}{assetData.changePercent24h.toFixed(2)}%
                  </p>
                  <p className={`text-sm ${getChangeColor(assetData.change24h)}`}>
                    {assetData.change24h > 0 ? '+' : ''}{assetData.currency}{assetData.change24h.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Volume/Market Cap */}
            {assetData.volume && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-lg font-semibold text-foreground">
                  {assetData.currency}{assetData.volume.toLocaleString()}
                </p>
              </div>
            )}

            {/* Additional Metric based on type */}
            <div className="space-y-2">
              {assetData.type === 'equity' && assetData.marketCap && (
                <>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold text-foreground">
                    {assetData.currency}{(assetData.marketCap / 1e9).toFixed(1)}B
                  </p>
                </>
              )}
              {assetData.type === 'property' && assetData.yearBuilt && (
                <>
                  <p className="text-sm text-muted-foreground">Year Built</p>
                  <p className="text-lg font-semibold text-foreground">{assetData.yearBuilt}</p>
                </>
              )}
              {assetData.type === 'commodity' && assetData.unit && (
                <>
                  <p className="text-sm text-muted-foreground">Unit</p>
                  <p className="text-lg font-semibold text-foreground">{assetData.unit}</p>
                </>
              )}
            </div>
          </div>

          {/* Price Alert for significant moves */}
          {Math.abs(assetData.changePercent24h) > 3 && (
            <Alert className="mt-6 border-chart-3/20 bg-chart-3/5">
              <Zap className="h-4 w-4 text-chart-3" />
              <AlertDescription className="text-chart-3">
                <strong>Significant Movement:</strong> {assetData.name} has moved{' '}
                {assetData.changePercent24h > 0 ? 'up' : 'down'} by{' '}
                {Math.abs(assetData.changePercent24h).toFixed(1)}% in the last 24 hours.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="text-xs sm:text-sm touch-target">
            <BarChart3 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs sm:text-sm touch-target">
            <FileText className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="text-xs sm:text-sm touch-target">
            <Globe className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm touch-target">
            <Brain className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="text-xs sm:text-sm touch-target">
            <BookOpen className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Journal</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AssetChart assetData={assetData} />
            </div>
            <div>
              <AssetDataMetrics assetData={assetData} variant="summary" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <AssetDataMetrics assetData={assetData} variant="detailed" />
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <AssetNews slug={slug} assetName={assetData.name} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <AssetAIInsights slug={slug} assetData={assetData} />
        </TabsContent>

        <TabsContent value="journal" className="mt-6">
          <AssetJournal slug={slug} assetName={assetData.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}