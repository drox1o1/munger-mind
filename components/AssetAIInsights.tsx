import React, { useState } from 'react';
import { Brain, Zap, Download, Copy, RefreshCw, AlertTriangle, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { AssetData } from '../utils/assetUtils';

interface AssetAIInsightsProps {
  slug: string;
  assetData: AssetData;
}

export function AssetAIInsights({ slug, assetData }: AssetAIInsightsProps) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    
    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockInsight = generateMockInsight(assetData);
    setInsight(mockInsight);
    setLoading(false);
  };

  const generateMockInsight = (asset: AssetData): string => {
    if (asset.type === 'equity') {
      return `# ${asset.name} - AI Investment Analysis

## Executive Summary
${asset.name} presents a **compelling investment opportunity** with strong fundamentals and positive market positioning. Our analysis indicates moderate buy potential with a 12-month price target suggesting ${asset.changePercent24h > 0 ? 'continued upward momentum' : 'recovery potential'}.

## Key Strengths
• **Financial Health**: Strong balance sheet with sustainable debt levels
• **Market Position**: Dominant player in core business segments  
• **Growth Drivers**: Digital transformation initiatives showing promising results
• **Valuation**: Currently trading at reasonable multiples relative to peers

## Risk Factors
• **Market Volatility**: Susceptible to broader market sentiment shifts
• **Regulatory Environment**: Potential impact from policy changes
• **Competition**: Increasing pressure from emerging competitors

## Investment Thesis
The company's strategic initiatives in digital transformation and market expansion position it well for sustained growth. Recent ${asset.changePercent24h > 0 ? 'positive momentum' : 'price correction'} creates ${asset.changePercent24h > 0 ? 'a premium entry point for quality-focused investors' : 'an attractive entry opportunity'}.

## Recommendation
**${asset.changePercent24h > 0 ? 'HOLD/BUY' : 'BUY'}** - Target allocation: 3-5% of equity portfolio for diversified investors.

*Analysis generated on ${new Date().toLocaleDateString()} | Confidence: 78%*`;
    }
    
    if (asset.type === 'commodity') {
      return `# ${asset.name} - Commodity Analysis

## Market Overview
${asset.name} is experiencing ${asset.changePercent24h > 0 ? 'bullish momentum' : 'bearish pressure'} driven by supply-demand dynamics and macroeconomic factors. Current pricing reflects ${asset.changePercent24h > 0 ? 'strong fundamentals' : 'oversold conditions'}.

## Supply & Demand Factors
• **Supply**: Global production levels remain constrained
• **Demand**: Industrial demand showing resilience despite economic headwinds
• **Inventory**: Stockpiles at ${asset.changePercent24h > 0 ? 'below-average' : 'elevated'} levels

## Technical Analysis
Current price action suggests ${asset.changePercent24h > 0 ? 'continuation of uptrend' : 'potential reversal from oversold levels'}. Key resistance at $${(asset.currentPrice * 1.1).toFixed(2)} and support at $${(asset.currentPrice * 0.9).toFixed(2)}.

## Investment Recommendation
**${asset.changePercent24h > 0 ? 'NEUTRAL/BUY' : 'BUY'}** - Suitable for portfolio diversification with 2-3% allocation.

*Generated: ${new Date().toLocaleDateString()}*`;
    }
    
    // Property
    return `# ${asset.name} - Real Estate Analysis

## Property Assessment
This ${asset.location} property offers ${asset.changePercent24h >= 0 ? 'strong investment potential' : 'value opportunity'} in a prime location with excellent connectivity and infrastructure.

## Location Advantages
• **Connectivity**: Excellent transport links and metro accessibility
• **Infrastructure**: Well-developed social and commercial infrastructure
• **Growth Potential**: Area showing consistent appreciation trends

## Financial Metrics
• **Current Rate**: ${asset.currency}${asset.currentPrice.toLocaleString()} per sq ft
• **Rental Yield**: Estimated 3-4% annually
• **Appreciation**: Expected 8-12% CAGR over 5 years

## Investment Thesis
Prime location with limited supply and growing demand fundamentals. Suitable for both investment and end-use with strong capital appreciation potential.

## Recommendation
**BUY** - Recommended for investors seeking real estate diversification.

*Assessment Date: ${new Date().toLocaleDateString()}*`;
  };

  const copyToClipboard = async () => {
    if (insight) {
      await navigator.clipboard.writeText(insight);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadInsight = () => {
    if (insight) {
      const blob = new Blob([insight], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}-ai-analysis.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Deep Dive Analysis</CardTitle>
                <CardDescription className="text-sm">
                  Comprehensive AI-powered investment insights
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateInsight}
              disabled={loading}
              className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Insight
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {!insight && !loading && (
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Analysis Ready</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get comprehensive investment insights powered by advanced AI analysis including risk assessment, 
              growth prospects, and investment recommendations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-3 bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-lg border border-chart-1/20">
                <Lightbulb className="w-6 h-6 text-chart-1 mx-auto mb-2" />
                <p className="text-xs text-chart-1 font-medium">Investment Thesis</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-lg border border-chart-2/20">
                <AlertTriangle className="w-6 h-6 text-chart-2 mx-auto mb-2" />
                <p className="text-xs text-chart-2 font-medium">Risk Analysis</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-lg border border-chart-3/20">
                <CheckCircle className="w-6 h-6 text-chart-3 mx-auto mb-2" />
                <p className="text-xs text-chart-3 font-medium">Recommendations</p>
              </div>
            </div>
          </CardContent>
        )}

        {loading && (
          <CardContent className="text-center py-12">
            <div className="relative">
              <Brain className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing {assetData.name}</h3>
            <p className="text-muted-foreground mb-4">
              Processing market data, fundamentals, and sentiment analysis...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Estimated completion: ~15 seconds</span>
            </div>
          </CardContent>
        )}

        {insight && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-profit/20 to-profit/10 text-profit border-profit/30 px-3 py-1.5 font-medium">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Analysis Complete
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Generated {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="touch-target"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-profit" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadInsight}
                  className="touch-target"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20">
              <Textarea
                value={insight}
                readOnly
                className="min-h-[400px] bg-transparent border-none resize-none focus:ring-0 text-sm leading-relaxed"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Disclaimer */}
      <Alert className="border-destructive/20 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          <strong>Not Financial Advice:</strong> This AI-generated analysis is for informational purposes only. 
          Always consult with qualified financial advisors and conduct your own research before making investment decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}