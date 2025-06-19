import React, { useState } from 'react';
import { Newspaper, TrendingUp, Clock, ExternalLink, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const newsItems = [
    {
      id: 1,
      title: 'RBI Keeps Repo Rate Unchanged at 6.5%, Maintains Accommodative Stance',
      summary: 'The Reserve Bank of India maintained its key lending rate for the eighth consecutive meeting, citing balanced growth and inflation outlook.',
      category: 'macro',
      sentiment: 'neutral',
      source: 'Economic Times',
      timeAgo: '15 min ago',
      impact: 'high',
      relevantSectors: ['Banking', 'Real Estate'],
    },
    {
      id: 2,
      title: 'Indian IT Sector Sees Strong Q3 Earnings Amid Global Demand Recovery',
      summary: 'Major IT companies report robust quarterly results as enterprise digital transformation spending increases globally.',
      category: 'sector',
      sentiment: 'positive',
      source: 'Business Standard',
      timeAgo: '1 hour ago',
      impact: 'medium',
      relevantSectors: ['Technology'],
    },
    {
      id: 3,
      title: 'Semiconductor Shortage Eases as New Fabs Come Online',
      summary: 'Global chip shortage shows signs of improvement with new manufacturing facilities beginning production in Asia and Europe.',
      category: 'global',
      sentiment: 'positive',
      source: 'Reuters',
      timeAgo: '2 hours ago',
      impact: 'medium',
      relevantSectors: ['Technology', 'Automobiles'],
    },
    {
      id: 4,
      title: 'Oil Prices Decline on China Demand Concerns',
      summary: 'Crude oil futures fell 2% in Asian trading following reports of slower-than-expected economic recovery in China.',
      category: 'commodities',
      sentiment: 'negative',
      source: 'Bloomberg',
      timeAgo: '3 hours ago',
      impact: 'medium',
      relevantSectors: ['Energy', 'Automobiles'],
    },
    {
      id: 5,
      title: 'Indian Pharmaceutical Exports Reach Record High in FY24',
      summary: 'Pharma exports crossed $25 billion mark driven by generic drug demand and API manufacturing growth.',
      category: 'sector',
      sentiment: 'positive',
      source: 'Mint',
      timeAgo: '4 hours ago',
      impact: 'low',
      relevantSectors: ['Pharmaceuticals'],
    },
  ];

  const categories = [
    { id: 'all', label: 'All News', count: newsItems.length },
    { id: 'macro', label: 'Macro', count: newsItems.filter(item => item.category === 'macro').length },
    { id: 'sector', label: 'Sectors', count: newsItems.filter(item => item.category === 'sector').length },
    { id: 'global', label: 'Global', count: newsItems.filter(item => item.category === 'global').length },
    { id: 'commodities', label: 'Commodities', count: newsItems.filter(item => item.category === 'commodities').length },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-profit/10 text-profit border-profit/20';
      case 'negative': return 'bg-loss/10 text-loss border-loss/20';
      case 'neutral': return 'bg-neutral/10 text-neutral border-neutral/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
      case 'medium': return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'low': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-chart-1/10 rounded-lg">
            <Newspaper className="w-5 h-5 text-chart-1" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Market News</h3>
            <p className="text-sm text-muted-foreground">Latest market updates</p>
          </div>
        </div>
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{category.label}</span>
            <span className="bg-background/20 px-1.5 py-0.5 rounded text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {filteredNews.map((news) => (
          <div key={news.id} className="p-4 bg-muted/30 rounded-lg border border-border transition-all duration-200 hover:shadow-sm hover:bg-muted/40 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs ${getSentimentColor(news.sentiment)}`}>
                  {news.sentiment}
                </Badge>
                <Badge className={`text-xs ${getImpactColor(news.impact)}`}>
                  {news.impact} impact
                </Badge>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {news.timeAgo}
              </div>
            </div>

            <h4 className="font-medium text-foreground mb-2 line-clamp-2 leading-5">
              {news.title}
            </h4>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-5">
              {news.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">{news.source}</span>
                {news.relevantSectors.length > 0 && (
                  <div className="flex space-x-1">
                    {news.relevantSectors.slice(0, 2).map((sector) => (
                      <Badge key={sector} className="text-xs bg-background/50 text-muted-foreground border-border">
                        {sector}
                      </Badge>
                    ))}
                    {news.relevantSectors.length > 2 && (
                      <Badge className="text-xs bg-background/50 text-muted-foreground border-border">
                        +{news.relevantSectors.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 p-1.5">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Market Pulse Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="p-4 bg-gradient-to-r from-profit/5 to-profit/10 rounded-lg border border-profit/20">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-profit" />
            <span className="font-medium text-sm text-foreground">Today's Market Pulse</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Positive sentiment dominates with technology and pharma sectors showing strength. 
            RBI's dovish stance supporting market confidence despite global headwinds.
          </p>
        </div>
      </div>
    </div>
  );
}