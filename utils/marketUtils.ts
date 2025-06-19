// Enhanced market utilities with holiday and event awareness

export interface MarketEvent {
  type: 'holiday' | 'earnings' | 'fed-meeting' | 'economic-data' | 'special-event';
  name: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface ThemedMessage {
  message: string;
  context: string;
  emoji: string;
  tone: 'sarcastic' | 'witty' | 'motivational' | 'cautionary';
}

export const getMarketEvents = (): MarketEvent[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  return [
    {
      type: 'holiday',
      name: 'Diwali',
      date: new Date(currentYear, 10, 12), // November 12
      impact: 'high',
      description: 'Markets closed for Diwali celebrations'
    },
    {
      type: 'holiday',
      name: 'Christmas',
      date: new Date(currentYear, 11, 25), // December 25
      impact: 'medium',
      description: 'Light trading expected around Christmas'
    },
    {
      type: 'economic-data',
      name: 'RBI Monetary Policy',
      date: new Date(currentYear, 11, 8), // December 8
      impact: 'high',
      description: 'Reserve Bank of India announces policy rates'
    },
    {
      type: 'earnings',
      name: 'Q3 Earnings Season',
      date: new Date(currentYear, 0, 15), // January 15
      impact: 'high',
      description: 'Quarterly earnings announcements begin'
    }
  ];
};

export const getThemedMarketMessage = (currentTime: Date): ThemedMessage => {
  const hour = currentTime.getHours();
  const day = currentTime.getDay();
  const month = currentTime.getMonth();
  const date = currentTime.getDate();
  
  // Holiday and special event messages
  const holidayMessages: Record<string, ThemedMessage> = {
    'diwali': {
      message: "Markets are as bright as Diwali lights, but your portfolio might need some crackers",
      context: "Festival season typically brings good cheer to markets",
      emoji: "🪔",
      tone: 'witty'
    },
    'christmas': {
      message: "Santa's checking his portfolio twice, maybe you should too",
      context: "Year-end portfolio rebalancing season",
      emoji: "🎄",
      tone: 'motivational'
    },
    'newyear': {
      message: "New year, same market chaos - at least the calendar changed",
      context: "Fresh start for investment planning",
      emoji: "🎊",
      tone: 'sarcastic'
    },
    'valentine': {
      message: "Markets and relationships both need patience and commitment",
      context: "Long-term thinking pays off in both",
      emoji: "💝",
      tone: 'witty'
    }
  };

  // Check for holidays
  if (month === 10 && date >= 10 && date <= 15) { // Diwali season
    return holidayMessages.diwali;
  }
  if (month === 11 && date >= 20) { // Christmas season
    return holidayMessages.christmas;
  }
  if (month === 0 && date <= 7) { // New Year
    return holidayMessages.newyear;
  }
  if (month === 1 && date === 14) { // Valentine's Day
    return holidayMessages.valentine;
  }

  // Time-based messages
  const timeBasedMessages: ThemedMessage[] = [
    // Early morning (5-9 AM)
    {
      message: "Markets opening with the enthusiasm of a Monday morning meeting",
      context: "Pre-market analysis time",
      emoji: "🌅",
      tone: 'sarcastic'
    },
    // Market hours (9 AM - 3:30 PM)
    {
      message: "The market's mood swings make teenagers look emotionally stable",
      context: "Active trading session",
      emoji: "📈",
      tone: 'witty'
    },
    // Post-market (3:30 PM - 6 PM)
    {
      message: "Markets closed, time to pretend you understand what happened today",
      context: "Post-market analysis time",
      emoji: "📊",
      tone: 'sarcastic'
    },
    // Evening (6 PM - 10 PM)
    {
      message: "Evening reflection: Did I invest or just gamble with extra steps?",
      context: "Time for portfolio review",
      emoji: "🤔",
      tone: 'cautionary'
    }
  ];

  // Weekend messages
  const weekendMessages: ThemedMessage[] = [
    {
      message: "Markets are closed, but your investment anxiety isn't",
      context: "Weekend market downtime",
      emoji: "😴",
      tone: 'sarcastic'
    },
    {
      message: "Weekend reading: How to explain crypto to your grandmother",
      context: "Education and research time",
      emoji: "📚",
      tone: 'witty'
    }
  ];

  // Market volatility messages
  const volatilityMessages: ThemedMessage[] = [
    {
      message: "Today's volatility sponsored by people who panic-sell at red candles",
      context: "High volatility period",
      emoji: "🎢",
      tone: 'sarcastic'
    },
    {
      message: "Remember: Time in the market beats timing the market (allegedly)",
      context: "Buffett's wisdom for volatile times",
      emoji: "⏰",
      tone: 'motivational'
    },
    {
      message: "Markets doing their best impression of a mood ring today",
      context: "Unpredictable market movement",
      emoji: "🌈",
      tone: 'witty'
    }
  ];

  // Select appropriate message based on time and context
  if (day === 0 || day === 6) { // Weekend
    return weekendMessages[Math.floor(Math.random() * weekendMessages.length)];
  }

  if (hour >= 5 && hour < 9) {
    return timeBasedMessages[0];
  } else if (hour >= 9 && hour < 15.5) {
    return timeBasedMessages[1];
  } else if (hour >= 15.5 && hour < 18) {
    return timeBasedMessages[2];
  } else {
    return timeBasedMessages[3];
  }
};

export const getMarketSentiment = () => {
  // Mock sentiment analysis - in real app, connect to sentiment APIs
  const sentiments = [
    { label: 'Extremely Fearful', value: 20, color: 'red-500', description: 'Maximum pessimism' },
    { label: 'Fearful', value: 35, color: 'red-400', description: 'High anxiety' },
    { label: 'Neutral', value: 50, color: 'gray-500', description: 'Balanced sentiment' },
    { label: 'Greedy', value: 75, color: 'green-400', description: 'Optimistic outlook' },
    { label: 'Extremely Greedy', value: 90, color: 'green-500', description: 'Maximum euphoria' }
  ];
  
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};

export const getWatchlistEvents = (watchlistSymbols: string[]) => {
  // Mock events affecting watchlist stocks
  const mockEvents = [
    {
      symbol: 'RELIANCE',
      event: 'Q3 Earnings Announcement',
      impact: 'high' as const,
      date: new Date(),
      description: 'Quarterly results expected to beat estimates',
      sentiment: 'positive' as const
    },
    {
      symbol: 'TCS',
      event: 'Client Deal Announcement',
      impact: 'medium' as const,
      date: new Date(),
      description: 'New multi-year contract with major US bank',
      sentiment: 'positive' as const
    },
    {
      symbol: 'HDFC',
      event: 'RBI Policy Impact',
      impact: 'high' as const,
      date: new Date(),
      description: 'Interest rate changes affecting banking sector',
      sentiment: 'neutral' as const
    }
  ];
  
  return mockEvents.filter(event => 
    watchlistSymbols.some(symbol => 
      symbol.toUpperCase().includes(event.symbol)
    )
  );
};