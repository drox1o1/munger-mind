import React from 'react';
import { Home, TrendingUp, CheckCircle, XCircle, MapPin, IndianRupee, BarChart3, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RealEstateData } from '../services/investmentSearch';

interface RealEstateAnalysisProps {
  realEstateData: RealEstateData;
  onExploreMore?: () => void;
  onCalculateEMI?: () => void;
}

export function RealEstateAnalysis({ realEstateData, onExploreMore, onCalculateEMI }: RealEstateAnalysisProps) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy': return 'bg-profit/10 text-profit border-profit/30';
      case 'Wait': return 'bg-chart-3/10 text-chart-3 border-chart-3/30';
      case 'Avoid': return 'bg-loss/10 text-loss border-loss/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy': return <CheckCircle className="w-4 h-4" />;
      case 'Wait': return <AlertCircle className="w-4 h-4" />;
      case 'Avoid': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {realEstateData.location}
              </h2>
              <p className="text-muted-foreground">Real Estate Investment Analysis</p>
            </div>
          </div>
          <Badge className={getRecommendationColor(realEstateData.recommendation)} size="lg">
            {getRecommendationIcon(realEstateData.recommendation)}
            <span className="ml-2">{realEstateData.recommendation}</span>
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 bg-secondary/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-chart-1/20 rounded-lg">
                <IndianRupee className="w-4 h-4 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Price</p>
                <p className="text-xl font-semibold text-foreground">{realEstateData.averagePrice}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-profit/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-profit" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price Appreciation</p>
                <p className="text-xl font-semibold text-profit">{realEstateData.priceAppreciation}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-chart-3/20 rounded-lg">
                <BarChart3 className="w-4 h-4 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Status</p>
                <p className="text-xl font-semibold text-foreground">
                  {realEstateData.recommendation === 'Buy' ? 'Favorable' : 
                   realEstateData.recommendation === 'Wait' ? 'Cautious' : 'Unfavorable'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Trends */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-profit" />
            Current Market Trends
          </h3>
          <div className="space-y-2">
            {realEstateData.marketTrends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-secondary/30 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-profit mt-2 flex-shrink-0" />
                <p className="text-sm text-foreground">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Pros and Cons Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-profit" />
            Advantages
          </h3>
          <div className="space-y-3">
            {realEstateData.pros.map((pro, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-profit/5 rounded-lg border border-profit/20">
                <CheckCircle className="w-4 h-4 text-profit mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{pro}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-loss" />
            Considerations
          </h3>
          <div className="space-y-3">
            {realEstateData.cons.map((con, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-loss/5 rounded-lg border border-loss/20">
                <XCircle className="w-4 h-4 text-loss mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground">{con}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Investment Recommendation */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Investment Recommendation
        </h3>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            realEstateData.recommendation === 'Buy' 
              ? 'bg-profit/10 border-profit/30 text-profit'
              : realEstateData.recommendation === 'Wait'
              ? 'bg-chart-3/10 border-chart-3/30 text-chart-3'
              : 'bg-loss/10 border-loss/30 text-loss'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {getRecommendationIcon(realEstateData.recommendation)}
              <span className="font-semibold">Our Recommendation: {realEstateData.recommendation}</span>
            </div>
            <p className="text-sm text-foreground">
              {realEstateData.recommendation === 'Buy' 
                ? `${realEstateData.location} shows strong fundamentals with good appreciation potential. Consider investing if you have long-term horizon and proper financial planning.`
                : realEstateData.recommendation === 'Wait'
                ? `While ${realEstateData.location} has potential, current market conditions suggest waiting for better entry points or more favorable market conditions.`
                : `Current market conditions in ${realEstateData.location} present significant challenges. Consider alternative investment options or different locations.`
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Long-term Investment
            </Badge>
            <Badge variant="outline" className="text-xs">
              Location Research Required
            </Badge>
            <Badge variant="outline" className="text-xs">
              Financial Planning Essential
            </Badge>
            <Badge variant="outline" className="text-xs">
              Legal Due Diligence
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={onCalculateEMI}
          className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary"
        >
          <IndianRupee className="w-4 h-4 mr-2" />
          Calculate EMI & Affordability
        </Button>
        <Button 
          onClick={onExploreMore}
          variant="outline"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Explore Other Locations
        </Button>
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Compare with Other Cities
        </Button>
      </div>
    </div>
  );
}