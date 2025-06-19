import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  MessageCircle,
  BookOpen,
  Settings,
  Home,
  BarChart3,
  Newspaper,
  Bell,
  Sun,
  Moon,
  Zap,
  Target,
  PieChart,
  DollarSign,
  Activity,
  Briefcase,
  Menu,
  X,
  Brain,
  Cloud,
  Thermometer,
  AlertTriangle,
  TrendingDown as TrendingDownIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IntelligentSearch } from "@/components/IntelligentSearch";
import { MarketOverview } from "@/components/MarketOverview";
import { Watchlist } from "@/components/Watchlist";
import { NewsFeed } from "@/components/NewsFeed";
import { QueryInterface } from "@/components/QueryInterface";
import { InvestmentJournal } from "@/components/InvestmentJournal";
import { AlertSettings } from "@/components/AlertSettings";
import { BehavioralInsights } from "@/components/BehavioralInsights";
import { AssetDetail } from "@/components/AssetDetail";
import {
  getThemedMarketMessage,
  getMarketSentiment,
  getWatchlistEvents,
  type ThemedMessage,
} from "@/utils/marketUtils";
import {
  addSwipeGestureListeners,
  addPullToRefreshListener,
  triggerHapticFeedback,
  optimizeForDevice,
  isMobile,
  isIOS,
} from "@/utils/mobileUtils";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState("Alex"); // This could come from user preferences/login
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themedMessage, setThemedMessage] = useState<ThemedMessage | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentRoute, setCurrentRoute] = useState<string>("/dashboard");
  const [assetSlug, setAssetSlug] = useState<string | null>(null);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Initialize device optimizations
    optimizeForDevice();
  }, []);

  // Update time every minute and refresh themed messages
  useEffect(() => {
    const updateTimeAndMessages = () => {
      const now = new Date();
      setCurrentTime(now);
      setThemedMessage(getThemedMarketMessage(now));
      setMarketSentiment(getMarketSentiment());
    };

    updateTimeAndMessages();
    const timer = setInterval(updateTimeAndMessages, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mobile gesture handlers
  useEffect(() => {
    if (!isMobile() || !cardsRef.current) return;

    const cards = ["market", "watchlist", "portfolio", "news", "actions", "insights"];

    const handleSwipeLeft = () => {
      triggerHapticFeedback("light");
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    };

    const handleSwipeRight = () => {
      triggerHapticFeedback("light");
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const cleanup = addSwipeGestureListeners(
      cardsRef.current,
      handleSwipeLeft,
      handleSwipeRight
    );

    return cleanup;
  }, []);

  // Pull to refresh functionality
  useEffect(() => {
    if (!mainContentRef.current || !isMobile()) return;

    const handleRefresh = async () => {
      setIsRefreshing(true);
      triggerHapticFeedback("medium");

      // Simulate data refresh
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update data
      setThemedMessage(getThemedMarketMessage(new Date()));
      setMarketSentiment(getMarketSentiment());

      setIsRefreshing(false);
      triggerHapticFeedback("light");
    };

    const cleanup = addPullToRefreshListener(mainContentRef.current, handleRefresh);
    return cleanup;
  }, []);

  const toggleDarkMode = () => {
    triggerHapticFeedback("light");
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearchSubmit = (query: string) => {
    triggerHapticFeedback("medium");
    setSearchQuery(query);
    setActiveTab("chat");
  };

  // Handle asset navigation
  const handleAssetClick = (slug: string) => {
    triggerHapticFeedback("medium");
    setAssetSlug(slug);
    setCurrentRoute(`/asset/${slug}`);
    setActiveTab("asset-detail");
  };

  // Handle back navigation
  const handleBackToDashboard = () => {
    triggerHapticFeedback("light");
    setAssetSlug(null);
    setCurrentRoute("/dashboard");
    setActiveTab("dashboard");
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Format current date and time
  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return currentTime.toLocaleDateString("en-US", options);
  };

  // Get sentiment badge classes - fixes the template literal issue
  const getSentimentBadgeClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      "red-500": "bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-500 border-red-500/30",
      "red-400": "bg-gradient-to-r from-red-400/20 to-red-400/10 text-red-400 border-red-400/30",
      "orange-500": "bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-500 border-orange-500/30",
      "yellow-500": "bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-500 border-yellow-500/30",
      "green-400": "bg-gradient-to-r from-green-400/20 to-green-400/10 text-green-400 border-green-400/30",
      "green-500": "bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-500 border-green-500/30",
      "blue-500": "bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-500 border-blue-500/30",
      "gray-500": "bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-500 border-gray-500/30",
      "purple-500": "bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-500 border-purple-500/30",
    };

    return (
      colorMap[color] ||
      "bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-500 border-gray-500/30"
    );
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "markets", label: "Markets", icon: BarChart3 },
    { id: "news", label: "News", icon: Newspaper },
    { id: "chat", label: "AI Assistant", icon: MessageCircle },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    triggerHapticFeedback("light");
    setActiveTab(tabId);
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
    
    // Reset asset detail state when navigating away
    if (tabId !== "asset-detail") {
      setAssetSlug(null);
      setCurrentRoute(`/${tabId}`);
    }
  };

  // Sidebar content component for reuse
  const SidebarContent = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Logo Section */}
      <div className="p-4 sm:p-6 border-b border-border/60">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-primary/20">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">MungerMind</h1>
            <p className="text-xs text-muted-foreground">Rational Investment Thinking</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`group w-full flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm font-medium transition-all duration-200 touch-target ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/30 border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-secondary/60 hover:to-secondary/40 hover:shadow-lg transition-all duration-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${activeTab === item.id ? "scale-110" : "group-hover:scale-105"}`}
              />
              <span className="truncate">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Section */}
      <div className="p-3 sm:p-4 border-t border-border/60">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-chart-3/10 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <h4 className="font-semibold text-xs sm:text-sm text-foreground">Upgrade to Pro</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Unlock real-time data, advanced analytics, and AI-powered insights
          </p>
          <Button
            className="w-full text-xs py-2 sm:py-2.5 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
            onClick={() => triggerHapticFeedback("medium")}
          >
            <Target className="w-3 h-3 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 mobile-safe-area">
      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-primary/90 text-primary-foreground text-center py-2 text-sm font-medium animate-pulse">
          🔄 Refreshing market data...
        </div>
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-72 bg-gradient-to-b from-card/95 via-card to-card/90 backdrop-blur-xl border-r border-border/60 shadow-2xl relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-3/5 pointer-events-none" />
          <div className="relative z-10 w-full">
            <SidebarContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile/Tablet Header */}
          <header className="lg:hidden bg-gradient-to-r from-card/95 via-card to-card/90 backdrop-blur-xl border-b border-border/60 px-4 py-3 shadow-lg mobile-safe-area">
            <div className="flex items-center justify-between">
              {/* Mobile Logo and Menu */}
              <div className="flex items-center space-x-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden touch-target"
                      onClick={() => triggerHapticFeedback("light")}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="p-0 w-80 bg-gradient-to-b from-card/95 via-card to-card/90 backdrop-blur-xl border-r border-border/60"
                  >
                    <SidebarContent />
                  </SheetContent>
                </Sheet>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg border border-primary/20">
                    <BarChart3 className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">MungerMind</h1>
                  </div>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleDarkMode}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 touch-target"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <Badge className="bg-gradient-to-r from-profit/20 to-profit/10 text-profit border-profit/30 px-2 py-1 text-xs font-medium">
                  <Activity className="w-2 h-2 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </header>

          {/* Header for non-dashboard pages */}
          {activeTab !== "dashboard" && activeTab !== "asset-detail" && (
            <header className="hidden lg:block bg-gradient-to-r from-card/95 via-card to-card/90 backdrop-blur-xl border-b border-border/60 px-6 py-4 shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <IntelligentSearch onQuerySubmit={handleSearchSubmit} />

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={toggleDarkMode}
                    className="p-3 bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-border/60 backdrop-blur-sm"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Badge className="bg-gradient-to-r from-profit/20 to-profit/10 text-profit border-profit/30 px-4 py-2 font-medium shadow-lg">
                    <Activity className="w-3 h-3 mr-2" />
                    Markets Open
                  </Badge>

                  <div className="text-right bg-gradient-to-r from-secondary/40 to-secondary/20 px-4 py-2 rounded-xl border border-border/60 backdrop-blur-sm">
                    <p className="text-sm font-medium text-foreground">Nifty 50</p>
                    <div className="flex items-center text-sm text-profit font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      22,475.85 (+1.2%)
                    </div>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Content Area */}
          <main
            ref={mainContentRef}
            className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 mobile-scroll-container"
          >
            {/* Asset Detail View */}
            {activeTab === "asset-detail" && assetSlug && (
              <AssetDetail slug={assetSlug} onBack={handleBackToDashboard} />
            )}

            {/* Dashboard View */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Personalized Header Section */}
                <div className="flex flex-col gap-4 sm:gap-6 animate-greeting">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                    <div className="flex-1">
                      {/* Main Greeting */}
                      <div className="mb-3 sm:mb-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text mb-1 sm:mb-2 leading-tight">
                          {getGreeting()}, {userName}
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-muted-foreground">
                          <p className="text-sm sm:text-base md:text-lg font-medium">{formatDateTime()}</p>
                          <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
                          <Badge className="bg-gradient-to-r from-profit/20 to-profit/10 text-profit border-profit/30 px-3 py-1.5 font-medium w-fit animate-pulse">
                            <Activity className="w-3 h-3 mr-2" />
                            Markets Open
                          </Badge>
                          {marketSentiment && (
                            <React.Fragment>
                              <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
                              <Badge
                                className={`${getSentimentBadgeClasses(marketSentiment.color)} px-3 py-1.5 font-medium w-fit`}
                              >
                                <Brain className="w-3 h-3 mr-2" />
                                {marketSentiment.label}
                              </Badge>
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
                      <Button
                        onClick={toggleDarkMode}
                        className="hidden lg:flex p-3 bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-border/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      </Button>

                      <div className="text-center lg:text-right bg-gradient-to-r from-secondary/40 to-secondary/20 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-border/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 min-w-[120px] sm:min-w-[140px]">
                        <p className="text-xs sm:text-sm font-medium text-foreground">Nifty 50</p>
                        <div className="flex items-center justify-center lg:justify-end text-xs sm:text-sm text-profit font-semibold">
                          <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          <span>22,475.85</span>
                        </div>
                        <p className="text-xs text-profit font-medium">+1.2% today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prominent Search Section */}
                <div className="text-center py-8 sm:py-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-3/5 rounded-2xl sm:rounded-3xl" />
                  <div className="relative z-10">
                    <IntelligentSearch isProminent={true} onQuerySubmit={handleSearchSubmit} />
                  </div>
                </div>

                {/* Dashboard Content Layout */}
                <div
                  ref={cardsRef}
                  className={`space-y-4 sm:space-y-6 ${isMobile() ? "mobile-swipe-container" : ""}`}
                >
                  {/* Main Dashboard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Market Overview - Large Card */}
                    <div
                      className={`md:col-span-2 lg:col-span-5 min-h-[400px] lg:min-h-[500px] ${isMobile() && currentCardIndex !== 0 ? "hidden" : ""}`}
                    >
                      <MarketOverview onAssetClick={handleAssetClick} />
                    </div>

                    {/* Watchlist - Medium Card */}
                    <div
                      className={`md:col-span-1 lg:col-span-3 min-h-[400px] lg:min-h-[500px] ${isMobile() && currentCardIndex !== 1 ? "hidden" : ""}`}
                    >
                      <Watchlist onAssetClick={handleAssetClick} />
                    </div>

                    {/* Portfolio Summary - Medium Card */}
                    <div
                      className={`md:col-span-1 lg:col-span-4 min-h-[400px] lg:min-h-[500px] ${isMobile() && currentCardIndex !== 2 ? "hidden" : ""}`}
                    >
                      <Card className="h-full bg-gradient-to-br from-profit/10 via-card to-chart-2/5 backdrop-blur-sm border border-profit/20 shadow-xl">
                        <CardHeader className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-profit/30 to-profit/10 rounded-lg sm:rounded-xl border border-profit/20">
                              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-profit" />
                            </div>
                            <div>
                              <CardTitle className="text-base sm:text-lg">Portfolio</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">Your investment summary</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
                          <div className="text-center">
                            <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">₹2,45,678</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
                          </div>

                          <div className="space-y-3 sm:space-y-4">
                            <div className="flex justify-between items-center p-2 sm:p-3 bg-profit/5 rounded-lg sm:rounded-xl border border-profit/10">
                              <span className="text-xs sm:text-sm text-muted-foreground">Today's Change</span>
                              <div className="text-right">
                                <span className="text-xs sm:text-sm text-profit font-semibold">+₹3,456</span>
                                <p className="text-xs text-profit">+1.4%</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 sm:p-3 bg-profit/5 rounded-lg sm:rounded-xl border border-profit/10">
                              <span className="text-xs sm:text-sm text-muted-foreground">Total Return</span>
                              <div className="text-right">
                                <span className="text-xs sm:text-sm text-profit font-semibold">+₹45,678</span>
                                <p className="text-xs text-profit">+22.8%</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-2 sm:p-3 bg-secondary/10 rounded-lg sm:rounded-xl border border-secondary/20">
                              <span className="text-xs sm:text-sm text-muted-foreground">Invested</span>
                              <div className="text-right">
                                <span className="text-xs sm:text-sm text-foreground font-semibold">₹2,00,000</span>
                                <p className="text-xs text-muted-foreground">Principal</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              className="text-xs sm:text-sm bg-gradient-to-r from-profit/20 to-profit/10 text-profit hover:from-profit/30 hover:to-profit/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-profit/20 touch-target"
                              onClick={() => triggerHapticFeedback("light")}
                            >
                              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Details
                            </Button>
                            <Button
                              className="text-xs sm:text-sm bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
                              onClick={() => handleTabChange("chat")}
                            >
                              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                              Rebalance
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* News Feed - Large Card */}
                    <div
                      className={`md:col-span-2 lg:col-span-6 min-h-[400px] lg:min-h-[450px] ${isMobile() && currentCardIndex !== 3 ? "hidden" : ""}`}
                    >
                      <NewsFeed />
                    </div>

                    {/* Quick Actions - Medium Card */}
                    <div
                      className={`md:col-span-1 lg:col-span-3 min-h-[400px] lg:min-h-[450px] ${isMobile() && currentCardIndex !== 4 ? "hidden" : ""}`}
                    >
                      <Card className="h-full bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
                        <CardHeader className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-chart-1/30 to-chart-1/10 rounded-lg sm:rounded-xl border border-chart-1/20">
                              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1" />
                            </div>
                            <div>
                              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">
                                Explore investment opportunities
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 sm:space-y-3 pb-4 sm:pb-6">
                          <Button
                            className="w-full justify-start text-xs sm:text-sm bg-gradient-to-r from-secondary/60 to-secondary/40 text-secondary-foreground hover:from-secondary/80 hover:to-secondary/60 shadow-lg hover:shadow-xl transition-all duration-200 border border-border/60 touch-target"
                            onClick={() => handleSearchSubmit("I want to invest in technology sector")}
                          >
                            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                            Explore Tech Sector
                          </Button>
                          <Button
                            className="w-full justify-start text-xs sm:text-sm bg-gradient-to-r from-secondary/60 to-secondary/40 text-secondary-foreground hover:from-secondary/80 hover:to-secondary/60 shadow-lg hover:shadow-xl transition-all duration-200 border border-border/60 touch-target"
                            onClick={() => handleSearchSubmit("Should I buy a house in Bangalore?")}
                          >
                            <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                            Real Estate Analysis
                          </Button>
                          <Button
                            className="w-full justify-start text-xs sm:text-sm bg-gradient-to-r from-secondary/60 to-secondary/40 text-secondary-foreground hover:from-secondary/80 hover:to-secondary/60 shadow-lg hover:shadow-xl transition-all duration-200 border border-border/60 touch-target"
                            onClick={() => handleTabChange("journal")}
                          >
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                            Add Journal Entry
                          </Button>
                          <Button
                            className="w-full justify-start text-xs sm:text-sm bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
                            onClick={() => handleTabChange("chat")}
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                            Ask AI Assistant
                          </Button>
                          <Button
                            className="w-full justify-start text-xs sm:text-sm bg-gradient-to-r from-chart-3/20 to-chart-3/10 text-chart-3 hover:from-chart-3/30 hover:to-chart-3/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-chart-3/20 touch-target"
                            onClick={() => handleTabChange("alerts")}
                          >
                            <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                            Setup Alerts
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Placeholder for alignment on desktop */}
                    <div className="hidden lg:block lg:col-span-3"></div>
                  </div>

                  {/* Behavioral Insights - Now at Bottom */}
                  <div className={`${isMobile() && currentCardIndex !== 5 ? "hidden" : ""}`}>
                    <BehavioralInsights />
                  </div>
                </div>

                {/* Mobile Card Navigation Indicators */}
                {isMobile() && (
                  <div className="flex justify-center space-x-2 pt-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <button
                        key={index}
                        onClick={() => {
                          triggerHapticFeedback("light");
                          setCurrentCardIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          currentCardIndex === index ? "bg-primary scale-125" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tab content */}
            <div className="max-w-full">
              {activeTab === "markets" && <MarketOverview onAssetClick={handleAssetClick} />}
              {activeTab === "news" && <NewsFeed />}
              {activeTab === "chat" && <QueryInterface initialQuery={searchQuery} />}
              {activeTab === "journal" && <InvestmentJournal />}
              {activeTab === "alerts" && <AlertSettings />}
              {activeTab === "settings" && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">Settings</h2>
                  <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <Button
                            onClick={() => !isDarkMode && toggleDarkMode()}
                            className={`text-xs sm:text-sm touch-target ${!isDarkMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                          >
                            <Sun className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Light
                          </Button>
                          <Button
                            onClick={() => isDarkMode && toggleDarkMode()}
                            className={`text-xs sm:text-sm touch-target ${isDarkMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                          >
                            <Moon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Dark
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Default Market Focus</label>
                        <select className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                          <option>India (NSE/BSE)</option>
                          <option>Global Markets</option>
                          <option>US Markets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Risk Profile</label>
                        <select className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground">
                          <option>Conservative</option>
                          <option>Moderate</option>
                          <option>Aggressive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Haptic Feedback</label>
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerHapticFeedback("light")}
                            className="touch-target"
                          >
                            Test Light
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerHapticFeedback("medium")}
                            className="touch-target"
                          >
                            Test Medium
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerHapticFeedback("heavy")}
                            className="touch-target"
                          >
                            Test Heavy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}