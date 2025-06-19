import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Building2, Globe, Target, Shield, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SectorData, Company } from '../services/investmentSearch';

interface SectorAnalysisProps {
  sectorData: SectorData;
  onAddToWatchlist?: (company: Company) => void;
  onViewDetails?: (company: Company) => void;
}

export function SectorAnalysis({ sectorData, onAddToWatchlist, onViewDetails }: SectorAnalysisProps) {
  const getMarketCapColor = (category: string) => {
    switch (category) {
      case 'Large Cap': return 'bg-chart-1/10 text-chart-1 border-chart-1/30';
      case 'Mid Cap': return 'bg-chart-3/10 text-chart-3 border-chart-3/30';
      case 'Small Cap': return 'bg-chart-4/10 text-chart-4 border-chart-4/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getGrowthPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'bg-profit/10 text-profit border-profit/30';
      case 'Medium': return 'bg-chart-3/10 text-chart-3 border-chart-3/30';
      case 'Low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-loss/10 text-loss border-loss/30';
      case 'Medium': return 'bg-chart-3/10 text-chart-3 border-chart-3/30';
      case 'Low': return 'bg-profit/10 text-profit border-profit/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sector Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{sectorData.name} Sector</h2>
              <p className="text-muted-foreground">Investment Analysis & Opportunities</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getGrowthPotentialColor(sectorData.growthPotential)}>
              <Target className="w-3 h-3 mr-1" />
              {sectorData.growthPotential} Growth
            </Badge>
            <Badge className={getRiskLevelColor(sectorData.riskLevel)}>
              <Shield className="w-3 h-3 mr-1" />
              {sectorData.riskLevel} Risk
            </Badge>
          </div>
        </div>

        {/* Market Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-profit" />
              Current Market Trends
            </h3>
            <div className="space-y-2">
              {sectorData.marketTrends.map((trend, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-profit mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-chart-3" />
              Macro Economic Factors
            </h3>
            <div className="space-y-2">
              {sectorData.macroFactors.map((factor, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-secondary/30 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Companies List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Top Companies in {sectorData.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {sectorData.companies[0]?.region} Market
          </Badge>
        </div>

        <div className="space-y-4">
          {sectorData.companies.map((company, index) => (
            <Card key={company.symbol} className="p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-foreground">{company.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {company.symbol}
                    </Badge>
                    <Badge className={getMarketCapColor(company.marketCapCategory)}>
                      {company.marketCapCategory}
                    </Badge>
                    <Badge className={getGrowthPotentialColor(company.growthPotential)}>
                      {company.growthPotential} Growth
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Market Cap: </span>
                      <span className="font-medium text-foreground">{company.marketCap}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price: </span>
                      <span className="font-medium text-foreground">{company.price}</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      company.isPositive ? 'text-profit' : 'text-loss'
                    }`}>
                      {company.isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="font-medium">{company.changePercent}</span>
                      <span className="text-xs">({company.change})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => onViewDetails?.(company)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button
                    onClick={() => onAddToWatchlist?.(company)}
                    size="sm"
                    className="text-xs bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary"
                  >
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Investment Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-1 h-20 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Investment Summary
            </h3>
            <p className="text-foreground mb-3 leading-relaxed">
              The {sectorData.name.toLowerCase()} sector shows <strong>{sectorData.growthPotential.toLowerCase()} growth potential</strong> with <strong>{sectorData.riskLevel.toLowerCase()} risk levels</strong>. 
              Consider diversifying across different market cap companies and monitoring macro economic factors that could impact sector performance.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                Diversification Recommended
              </Badge>
              <Badge variant="outline" className="text-xs">
                Monitor Macro Trends
              </Badge>
              <Badge variant="outline" className="text-xs">
                Long-term Investment Horizon
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}