import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, TrendingUp, Home, Building, PieChart, ArrowRight, Clock, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { investmentSearchService, SearchResponse } from '../services/investmentSearch';

interface IntelligentSearchProps {
  isProminent?: boolean;
  onQuerySubmit?: (query: string) => void;
  initialValue?: string;
}

export function IntelligentSearch({ isProminent = false, onQuerySubmit, initialValue = '' }: IntelligentSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedQueries = investmentSearchService.getSuggestedQueries();

  useEffect(() => {
    const history = investmentSearchService.getSearchHistory();
    setSearchHistory(history.map(h => h.query));
  }, []);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate search delay
      onQuerySubmit?.(searchQuery);
      
      // Update search history
      const history = investmentSearchService.getSearchHistory();
      setSearchHistory([searchQuery, ...history.slice(0, 9).map(h => h.query)]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  if (isProminent) {
    return (
      <div className="space-y-6">
        {/* Prominent Search Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-foreground">What would you like to invest in today?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask me anything about investments - from sectors and stocks to real estate and financial planning
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Try: 'I want to invest in semiconductors' or 'Should I buy a house in Bangalore?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-14 pr-32 h-16 text-lg bg-card border-2 border-border focus:border-primary transition-all duration-200 rounded-2xl shadow-lg"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 px-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-md rounded-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <Card className="absolute top-full left-0 right-0 mt-2 p-4 z-50 shadow-xl border-2">
              <div className="space-y-4">
                {searchHistory.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.slice(0, 3).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left p-2 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Suggested Queries</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestedQueries.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-left p-3 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground border border-border"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Quick Action Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: TrendingUp, label: 'Sectors & Stocks', query: 'I want to invest in technology sector' },
            { icon: Home, label: 'Real Estate', query: 'Should I buy a house?' },
            { icon: PieChart, label: 'Mutual Funds', query: 'Best mutual funds for SIP' },
            { icon: Building, label: 'Global Markets', query: 'How to invest in US stocks?' }
          ].map((category, index) => (
            <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
              <button
                onClick={() => handleSuggestionClick(category.query)}
                className="w-full text-center space-y-3"
              >
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{category.label}</p>
                </div>
              </button>
            </Card>
          ))}
        </div>

        {/* Popular Searches */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-medium text-foreground mb-4">Popular Investment Topics</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Semiconductor stocks',
              'Bangalore real estate',
              'Tax saving funds',
              'Global tech ETFs',
              'Gold investment',
              'SIP vs lump sum',
              'Best bank stocks',
              'Mumbai property prices'
            ].map((topic, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                onClick={() => handleSuggestionClick(`Tell me about ${topic}`)}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact search bar for header
  return (
    <div className="relative flex-1 max-w-2xl">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Ask anything... e.g., 'I want to invest in semiconductors'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="pl-12 pr-4 h-11 w-full bg-input border border-input-border text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
        disabled={isLoading}
      />

      {/* Compact Suggestions */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-3 z-50 shadow-xl">
          <div className="space-y-2">
            {searchHistory.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Recent</span>
                {searchHistory.slice(0, 2).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full text-left p-2 rounded hover:bg-secondary transition-colors text-sm text-foreground"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
              {suggestedQueries.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2 rounded hover:bg-secondary transition-colors text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}