import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, TrendingUp, Home, PieChart, Calculator, FileText, DollarSign, AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { triggerHapticFeedback } from '../utils/mobileUtils';

interface QueryInterfaceProps {
  initialQuery?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'suggestion';
}

interface InvestmentCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  query: string;
}

export function QueryInterface({ initialQuery = '' }: QueryInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI investment advisor. I can help you with market analysis, portfolio optimization, investment strategies, and financial planning. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const investmentCategories: InvestmentCategory[] = [
    {
      id: 'start-investing',
      title: 'Start Investing',
      subtitle: 'New to investing?',
      icon: TrendingUp,
      color: 'emerald',
      query: 'I\'m new to investing and want to get started. Can you guide me through the basics and help me create my first investment plan?'
    },
    {
      id: 'buy-vs-rent',
      title: 'Buy vs Rent',
      subtitle: 'Property decisions',
      icon: Home,
      color: 'blue',
      query: 'I\'m trying to decide whether to buy or rent a property. Can you help me analyze the financial implications and what would work best for my situation?'
    },
    {
      id: 'portfolio-review',
      title: 'Portfolio Review',
      subtitle: 'Optimize allocation',
      icon: PieChart,
      color: 'purple',
      query: 'I\'d like to review my current investment portfolio and optimize my asset allocation. Can you help me analyze my holdings and suggest improvements?'
    },
    {
      id: 'tax-planning',
      title: 'Tax Planning',
      subtitle: 'Optimize taxes',
      icon: Calculator,
      color: 'amber',
      query: 'I want to optimize my tax strategy for this financial year. Can you help me with tax-efficient investment options and planning strategies?'
    }
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSubmit(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (query?: string) => {
    const messageContent = query || inputValue.trim();
    if (!messageContent || isLoading) return;

    triggerHapticFeedback('medium');

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: getResponseType(messageContent)
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCategoryClick = (category: InvestmentCategory) => {
    triggerHapticFeedback('light');
    handleSubmit(category.query);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('start') && lowerQuery.includes('invest')) {
      return `Great choice to start investing! Here's a beginner-friendly roadmap:

🎯 **Step 1: Emergency Fund**
Build 6-12 months of expenses in a savings account first.

📊 **Step 2: Understand Your Goals**
- Short-term (1-3 years): Debt funds, FDs
- Medium-term (3-7 years): Balanced funds, SIPs
- Long-term (7+ years): Equity funds, stocks

💡 **Step 3: Start Simple**
Begin with:
- Nifty 50 Index Fund (40%)
- Mid & Small Cap Fund (20%)
- International Fund (20%)
- Debt Fund (20%)

🔄 **Step 4: SIP Strategy**
Start with ₹5,000-10,000 monthly SIP across these categories.

Would you like me to help you choose specific funds or calculate how much to invest based on your income?`;
    }
    
    if (lowerQuery.includes('buy') && lowerQuery.includes('rent')) {
      return `Let me help you analyze Buy vs Rent decision:

🏠 **Buying Makes Sense When:**
- You plan to stay 7+ years
- Home price < 20x annual rent
- You have 25% down payment ready
- EMI < 40% of monthly income

🏢 **Renting Makes Sense When:**
- You might relocate in 3-5 years
- Home price > 25x annual rent
- You can invest the down payment for better returns
- You want flexibility

📊 **Financial Analysis:**
For a ₹1 Cr property in Bangalore:
- EMI: ~₹80,000 (20 years, 8.5%)
- Equivalent rent: ₹30,000-40,000
- Down payment: ₹25 lakhs

**Recommendation:** If you can invest that ₹25L + rent difference in equity (12% returns), renting might be better financially.

Want me to run numbers for your specific situation?`;
    }
    
    if (lowerQuery.includes('portfolio') && lowerQuery.includes('review')) {
      return `Let's optimize your portfolio! Here's my analysis framework:

📈 **Current Portfolio Health Check:**
1. Asset allocation vs age-appropriate targets
2. Overlap analysis between funds
3. Expense ratio optimization
4. Performance vs benchmarks

🎯 **Ideal Allocation (assuming age 30-40):**
- Large Cap Equity: 40-50%
- Mid/Small Cap: 20-30%
- International: 10-15%
- Debt/Gold: 15-20%

⚖️ **Rebalancing Strategy:**
- Review quarterly, rebalance annually
- Book profits from outperformers
- Add to underperformers

🔍 **Red Flags to Check:**
- More than 5 equity funds (overlap risk)
- Expense ratio > 1.5% in equity funds
- No international diversification

Share your current holdings and I'll provide personalized recommendations!`;
    }
    
    if (lowerQuery.includes('tax') && lowerQuery.includes('planning')) {
      return `Smart tax planning can save you lakhs! Here's your strategy:

💰 **80C Investments (₹1.5L limit):**
- ELSS Mutual Funds (best returns)
- EPF contribution
- PPF (15-year lock-in)
- ULIP (if insurance needed)

🏥 **Health Insurance (80D):**
- ₹25K for self (₹50K if age 60+)
- ₹25K for parents (₹50K if age 60+)
- Additional ₹5K preventive health checkup

📚 **Other Deductions:**
- 80CCD(1B): ₹50K for NPS
- 80E: Education loan interest
- 80EEA: Home loan interest up to ₹1.5L

💡 **Advanced Strategies:**
- Capital gains tax planning
- Debt fund taxation post-2023
- International fund taxation benefits

🎯 **Recommended Approach:**
ELSS SIPs throughout the year > Last-minute tax saving

Want me to create a month-wise tax planning calendar for you?`;
    }

    // Default responses for other queries
    const responses = [
      `Based on current market conditions, here's my analysis: The Nifty 50 is showing strong momentum with a 12-month target of 24,500. Consider accumulating quality large-cap stocks on dips.`,
      `Your question about ${query.split(' ').slice(0, 3).join(' ')} is interesting. Let me provide a comprehensive analysis with specific recommendations tailored to current market dynamics.`,
      `For this investment scenario, I'd recommend a diversified approach. Consider allocating 60% to equity funds, 25% to debt instruments, and 15% to international markets for optimal risk-adjusted returns.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getResponseType = (query: string): 'text' | 'analysis' | 'suggestion' => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('analyze') || lowerQuery.includes('review')) return 'analysis';
    if (lowerQuery.includes('suggest') || lowerQuery.includes('recommend')) return 'suggestion';
    return 'text';
  };

  const getCategoryColors = (color: string) => {
    const colorMap = {
      emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-950 dark:to-emerald-900 dark:border-emerald-800 dark:text-emerald-200',
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800 hover:from-blue-100 hover:to-blue-200 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 dark:text-blue-200',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-800 hover:from-purple-100 hover:to-purple-200 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800 dark:text-purple-200',
      amber: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-800 hover:from-amber-100 hover:to-amber-200 dark:from-amber-950 dark:to-amber-900 dark:border-amber-800 dark:text-amber-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColors = (color: string) => {
    const iconColorMap = {
      emerald: 'text-emerald-600 dark:text-emerald-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      amber: 'text-amber-600 dark:text-amber-400'
    };
    return iconColorMap[color as keyof typeof iconColorMap] || iconColorMap.blue;
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Investment Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-primary" />
          Quick Start Investment Guidance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {investmentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`p-4 rounded-2xl border backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-left touch-target ${getCategoryColors(category.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 ${getIconColors(category.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-tight mb-1">
                      {category.title}
                    </h4>
                    <p className="text-xs opacity-80 leading-tight">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Investment Advisor</CardTitle>
                <CardDescription className="text-sm">
                  Get personalized investment advice and market insights
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 px-3 py-1.5 font-medium">
              <CheckCircle className="w-3 h-3 mr-2" />
              Online
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground'
                      : 'bg-gradient-to-r from-secondary via-secondary to-secondary/90 text-secondary-foreground border border-border/60'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0 text-primary-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.type && message.type !== 'text' && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {message.type === 'analysis' && <FileText className="w-2 h-2 mr-1" />}
                            {message.type === 'suggestion' && <Lightbulb className="w-2 h-2 mr-1" />}
                            {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-secondary via-secondary to-secondary/90 text-secondary-foreground border border-border/60 rounded-2xl px-4 py-3 flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Analyzing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t border-border/60 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Ask about investments, market analysis, portfolio advice..."
                  className="pr-12 bg-input border-input-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => setIsListening(!isListening)}
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 touch-target"
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-destructive" />
                  ) : (
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 rounded-xl px-4 py-2 touch-target"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Press Enter to send • Click mic for voice input</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Response time: ~2s</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}