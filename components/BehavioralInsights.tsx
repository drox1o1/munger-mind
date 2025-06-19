import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Quote, BookOpen, Target, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function BehavioralInsights() {
  const insights = [
    {
      category: 'Market Psychology',
      title: 'Fear & Greed Cycle Alert',
      insight: 'Current market sentiment shows moderate optimism, but watch for overconfidence signals as the Nifty approaches resistance levels.',
      description: 'Fear and greed cycles drive market volatility more than fundamentals in the short term. Stay objective during emotional market phases.',
      type: 'warning',
      icon: AlertTriangle,
      color: 'orange',
      actionText: 'View Sentiment Analysis'
    },
    {
      category: 'Buffett Wisdom',
      title: 'Time in Market vs. Timing Market',
      insight: '"Time is the friend of the wonderful company, the enemy of the mediocre."',
      description: 'Focus on quality companies with sustainable competitive advantages for long-term wealth creation. Consistent investing beats market timing.',
      type: 'wisdom',
      icon: Quote,
      color: 'blue',
      actionText: 'Explore Quality Stocks'
    },
    {
      category: 'Bias Check',
      title: 'Confirmation Bias Detected',
      insight: 'You may be favoring information that confirms your current holdings while ignoring contrary viewpoints.',
      description: 'Try analyzing opposing perspectives on your investments to maintain objectivity and make better decisions.',
      type: 'alert',
      icon: Brain,
      color: 'red',
      actionText: 'Review Portfolio'
    },
    {
      category: 'Investment Strategy',
      title: 'Dollar-Cost Averaging Benefits',
      insight: 'Systematic investing reduces the impact of market timing anxiety and emotional decision-making.',
      description: 'Regular investments help smooth out market volatility and build discipline. Consider setting up SIPs for your equity investments.',
      type: 'tip',
      icon: Target,
      color: 'green',
      actionText: 'Setup SIP'
    },
  ];

  const todaysLesson = {
    title: "The Marshmallow Test & Investing",
    content: "Stanford's famous marshmallow experiment revealed that children who delayed gratification had better life outcomes. The same principle applies to investing - those who can delay immediate pleasures for long-term gains typically build more wealth.",
    practical: "Instead of checking portfolio daily, set monthly review dates. This reduces emotional trading and improves returns.",
    source: "Behavioral Economics Research"
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-800 dark:from-orange-950 dark:to-orange-900 dark:border-orange-800 dark:text-orange-200',
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 dark:text-blue-200',
      red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-800 dark:from-red-950 dark:to-red-900 dark:border-red-800 dark:text-red-200',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-800 dark:from-green-950 dark:to-green-900 dark:border-green-800 dark:text-green-200',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const iconColorMap = {
      orange: 'text-orange-600 dark:text-orange-400',
      blue: 'text-blue-600 dark:text-blue-400',
      red: 'text-red-600 dark:text-red-400',
      green: 'text-green-600 dark:text-green-400',
    };
    return iconColorMap[color as keyof typeof iconColorMap] || iconColorMap.blue;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
      <CardHeader className="pb-6 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-chart-3/30 to-chart-3/10 rounded-xl border border-chart-3/20">
              <Brain className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Behavioral Insights & Market Psychology</CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Enhance your investment decisions with behavioral economics and market wisdom
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-chart-3/20 to-chart-3/10 text-chart-3 border-chart-3/30 px-3 py-1.5 font-medium">
            <BookOpen className="w-3 h-3 mr-2" />
            Live Analysis
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Today's Behavioral Lesson */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-foreground">{todaysLesson.title}</h3>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  <Clock className="w-2 h-2 mr-1" />
                  Today's Lesson
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {todaysLesson.content}
              </p>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm font-medium text-foreground mb-2">💡 Practical Application:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {todaysLesson.practical}
                </p>
              </div>
              <p className="text-xs text-muted-foreground/70 italic">
                Source: {todaysLesson.source}
              </p>
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-chart-1" />
            Current Market Psychology Insights
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${getColorClasses(item.color)}`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${getIconColorClasses(item.color)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs px-2 py-1 mb-2 bg-white/50 dark:bg-black/20">
                            {item.category}
                          </Badge>
                          <h5 className="font-semibold text-sm leading-tight">
                            {item.title}
                          </h5>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <blockquote className="text-sm font-medium leading-relaxed border-l-3 border-current pl-3">
                        {item.insight}
                      </blockquote>
                      <p className="text-xs leading-relaxed opacity-80">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full text-xs bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 border-current/30 hover:border-current/50"
                    >
                      <DollarSign className="w-3 h-3 mr-2" />
                      {item.actionText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warren Buffett Quote Section */}
        <div className="bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-2xl border border-secondary/20 p-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-secondary/40 rounded-xl">
              <Quote className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <h4 className="text-base font-semibold text-foreground">Warren Buffett's Investment Philosophy</h4>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  Oracle of Omaha
                </Badge>
              </div>
              <blockquote className="text-sm font-medium text-foreground leading-relaxed border-l-4 border-primary pl-4">
                "The stock market is designed to transfer money from the Active to the Patient. Time arbitrage is the secret to building wealth through compound interest."
              </blockquote>
              <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Key Insight:</span> Focus on long-term value creation over short-term market movements. 
                  Patient investors who understand business fundamentals consistently outperform those who chase market trends.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground italic">
                  Compound annual returns beat market timing 95% of the time over 20+ year periods
                </p>
                <Button size="sm" variant="outline" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}