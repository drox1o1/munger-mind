import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, ExternalLink, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
  imageUrl?: string;
}

interface AssetNewsProps {
  slug: string;
  assetName: string;
}

export function AssetNews({ slug, assetName }: AssetNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentimentOverall, setSentimentOverall] = useState<{
    positive: number;
    negative: number;
    neutral: number;
    overall: 'bullish' | 'bearish' | 'neutral';
  } | null>(null);

  useEffect(() => {
    fetchNewsData();
  }, [slug]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - in production, this would call Alpha Vantage NEWS_SENTIMENT
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNews = generateMockNews(assetName);
      setNews(mockNews);
      
      // Calculate sentiment
      const sentimentCounts = mockNews.reduce(
        (acc, item) => {
          acc[item.sentiment]++;
          return acc;
        },
        { positive: 0, negative: 0, neutral: 0 }
      );
      
      const total = mockNews.length;
      const sentimentData = {
        positive: Math.round((sentimentCounts.positive / total) * 100),
        negative: Math.round((sentimentCounts.negative / total) * 100),
        neutral: Math.round((sentimentCounts.neutral / total) * 100),
        overall: sentimentCounts.positive > sentimentCounts.negative ? 'bullish' : 
                sentimentCounts.negative > sentimentCounts.positive ? 'bearish' : 'neutral'
      } as const;
      
      setSentimentOverall(sentimentData);
    } catch (err) {
      setError('Failed to load news data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockNews = (assetName: string): NewsItem[] => {
    const newsTemplates = [
      {
        title: `${assetName} Reports Strong Q3 Results`,
        summary: `${assetName} exceeded market expectations with robust quarterly performance driven by strong operational metrics and improved market conditions.`,
        sentiment: 'positive' as const,
        source: 'Financial Express',
        relevanceScore: 0.95
      },
      {
        title: `Market Volatility Affects ${assetName} Trading`,
        summary: `Recent market turbulence has impacted ${assetName} with increased volatility as investors reassess risk appetite in the current environment.`,
        sentiment: 'negative' as const,
        source: 'Economic Times',
        relevanceScore: 0.87
      },
      {
        title: `Analysts Update ${assetName} Price Targets`,
        summary: `Leading investment firms have revised their price targets for ${assetName} following recent developments and changing market dynamics.`,
        sentiment: 'neutral' as const,
        source: 'Reuters',
        relevanceScore: 0.82
      },
      {
        title: `${assetName} Announces Strategic Initiatives`,
        summary: `The company has unveiled new strategic initiatives aimed at strengthening market position and driving long-term growth.`,
        sentiment: 'positive' as const,
        source: 'Bloomberg',
        relevanceScore: 0.91
      },
      {
        title: `Regulatory Changes Impact ${assetName} Sector`,
        summary: `New regulatory guidelines are expected to affect the sector, with ${assetName} among the companies adapting to compliance requirements.`,
        sentiment: 'neutral' as const,
        source: 'Mint',
        relevanceScore: 0.78
      }
    ];

    return newsTemplates.map((template, index) => ({
      id: `news-${index}`,
      title: template.title,
      summary: template.summary,
      url: `https://example.com/news/${index}`,
      source: template.source,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      sentiment: template.sentiment,
      relevanceScore: template.relevanceScore,
      imageUrl: `https://images.unsplash.com/400x200/?business,finance&sig=${index}`
    }));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-profit bg-profit/10 border-profit/20';
      case 'negative':
        return 'text-loss bg-loss/10 border-loss/20';
      default:
        return 'text-neutral bg-neutral/10 border-neutral/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-chart-3/30 to-chart-3/10 rounded-xl border border-chart-3/20">
                <Newspaper className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <CardTitle className="text-lg">News & Sentiment</CardTitle>
                <CardDescription className="text-sm">Loading latest news...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-destructive/20 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          {error}. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      {sentimentOverall && (
        <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-chart-3/30 to-chart-3/10 rounded-xl border border-chart-3/20">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <CardTitle className="text-lg">Market Sentiment</CardTitle>
                  <CardDescription className="text-sm">Based on recent news analysis</CardDescription>
                </div>
              </div>
              <Badge className={`px-3 py-1.5 font-medium ${
                sentimentOverall.overall === 'bullish' ? 'bg-profit/20 text-profit border-profit/30' :
                sentimentOverall.overall === 'bearish' ? 'bg-loss/20 text-loss border-loss/30' :
                'bg-neutral/20 text-neutral border-neutral/30'
              }`}>
                {sentimentOverall.overall.charAt(0).toUpperCase() + sentimentOverall.overall.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-profit/10 to-profit/5 rounded-lg border border-profit/20">
                <p className="text-2xl font-bold text-profit">{sentimentOverall.positive}%</p>
                <p className="text-sm text-muted-foreground">Positive</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-neutral/10 to-neutral/5 rounded-lg border border-neutral/20">
                <p className="text-2xl font-bold text-neutral">{sentimentOverall.neutral}%</p>
                <p className="text-sm text-muted-foreground">Neutral</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-loss/10 to-loss/5 rounded-lg border border-loss/20">
                <p className="text-2xl font-bold text-loss">{sentimentOverall.negative}%</p>
                <p className="text-sm text-muted-foreground">Negative</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Articles */}
      <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-chart-2/30 to-chart-2/10 rounded-xl border border-chart-2/20">
                <Newspaper className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg">Latest News</CardTitle>
                <CardDescription className="text-sm">{news.length} recent articles</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchNewsData}
              className="touch-target"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {news.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No news articles found</p>
            </div>
          ) : (
            news.map((article) => (
              <div
                key={article.id}
                className="p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-semibold text-foreground leading-tight hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <Badge className={`ml-3 px-2 py-1 text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
                        {getSentimentIcon(article.sentiment)}
                        <span className="ml-1 capitalize">{article.sentiment}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="font-medium">{article.source}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatTimeAgo(article.publishedAt)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {Math.round(article.relevanceScore * 100)}% relevant
                        </Badge>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs p-2 hover:bg-secondary touch-target"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Load More Button */}
          {news.length > 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" className="touch-target">
                Load More Articles
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-chart-3/20 bg-chart-3/5">
        <AlertCircle className="h-4 w-4 text-chart-3" />
        <AlertDescription className="text-chart-3">
          <strong>Disclaimer:</strong> News sentiment analysis is provided for informational purposes only and should not be considered as financial advice. Always conduct your own research before making investment decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}