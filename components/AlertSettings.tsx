import React, { useState } from 'react';
import { Bell, Smartphone, Mail, MessageCircle, Clock, TrendingUp, Newspaper, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

interface AlertConfig {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channels: {
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
  frequency?: string;
  threshold?: string;
}

export function AlertSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('investor@example.com');
  const [isWhatsappVerified, setIsWhatsappVerified] = useState(false);

  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([
    {
      id: 'daily-summary',
      title: 'Daily Market Summary',
      description: 'Get a daily digest of your watchlist performance and key market news',
      enabled: true,
      channels: { whatsapp: true, email: true, push: false },
      frequency: '6:00 PM daily',
    },
    {
      id: 'price-alerts',
      title: 'Price Movement Alerts',
      description: 'Alerts when your watchlist stocks move beyond set thresholds',
      enabled: true,
      channels: { whatsapp: true, email: false, push: true },
      threshold: '±5%',
    },
    {
      id: 'breaking-news',
      title: 'Breaking Market News',
      description: 'Important market-moving news and announcements',
      enabled: true,
      channels: { whatsapp: true, email: true, push: true },
    },
    {
      id: 'sector-updates',
      title: 'Sector Performance Updates',
      description: 'Weekly updates on sector performance and trends',
      enabled: false,
      channels: { whatsapp: false, email: true, push: false },
      frequency: 'Weekly',
    },
    {
      id: 'earnings-calendar',
      title: 'Earnings Calendar',
      description: 'Upcoming earnings announcements for your watchlist companies',
      enabled: true,
      channels: { whatsapp: false, email: true, push: false },
      frequency: 'Weekly',
    },
    {
      id: 'macro-events',
      title: 'Macro Economic Events',
      description: 'RBI meetings, GDP releases, inflation data, and other macro events',
      enabled: true,
      channels: { whatsapp: true, email: true, push: false },
    },
    {
      id: 'portfolio-review',
      title: 'Portfolio Review Reminders',
      description: 'Monthly reminders to review and rebalance your portfolio',
      enabled: false,
      channels: { whatsapp: true, email: false, push: false },
      frequency: 'Monthly',
    },
  ]);

  const updateAlertConfig = (id: string, updates: Partial<AlertConfig>) => {
    setAlertConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const toggleAlert = (id: string) => {
    updateAlertConfig(id, { enabled: !alertConfigs.find(c => c.id === id)?.enabled });
  };

  const toggleChannel = (id: string, channel: keyof AlertConfig['channels']) => {
    const config = alertConfigs.find(c => c.id === id);
    if (config) {
      updateAlertConfig(id, {
        channels: {
          ...config.channels,
          [channel]: !config.channels[channel],
        },
      });
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      default: return null;
    }
  };

  const getChannelColor = (channel: string, enabled: boolean) => {
    if (!enabled) return 'bg-muted/30 text-muted-foreground border-border';
    switch (channel) {
      case 'whatsapp': return 'bg-profit/10 text-profit border-profit/20';
      case 'email': return 'bg-primary/10 text-primary border-primary/20';
      case 'push': return 'bg-chart-5/10 text-chart-5 border-chart-5/20';
      default: return 'bg-muted/30 text-muted-foreground border-border';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-chart-3/10 rounded-xl">
          <Bell className="w-6 h-6 text-chart-3" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Alert Settings</h2>
          <p className="text-muted-foreground">Configure your notifications to stay updated on market movements</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-6 text-foreground">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              WhatsApp Number
            </label>
            <div className="flex space-x-3">
              <Input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="flex-1 bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
              />
              <Button 
                onClick={() => setIsWhatsappVerified(!isWhatsappVerified)}
                className={isWhatsappVerified ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
              >
                {isWhatsappVerified ? 'Verified' : 'Verify'}
              </Button>
            </div>
            {isWhatsappVerified && (
              <p className="text-sm text-profit mt-2 flex items-center">
                <MessageCircle className="w-3 h-3 mr-1" />
                WhatsApp alerts are enabled
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Quick Setup */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-6 border-2 border-primary/20">
        <h3 className="font-semibold text-lg mb-6 text-foreground">Quick Setup Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-auto p-6 flex flex-col items-center space-y-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0"
            onClick={() => {
              updateAlertConfig('daily-summary', { enabled: true, channels: { whatsapp: true, email: true, push: false } });
              updateAlertConfig('price-alerts', { enabled: true, channels: { whatsapp: true, email: false, push: true } });
              updateAlertConfig('breaking-news', { enabled: true, channels: { whatsapp: true, email: false, push: true } });
            }}
          >
            <div className="font-medium">Essential Alerts</div>
            <div className="text-sm text-muted-foreground text-center">Daily summary + price alerts + breaking news</div>
          </Button>

          <Button 
            className="h-auto p-6 flex flex-col items-center space-y-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0"
            onClick={() => {
              alertConfigs.forEach(config => {
                updateAlertConfig(config.id, { enabled: true, channels: { whatsapp: true, email: true, push: true } });
              });
            }}
          >
            <div className="font-medium">All Alerts</div>
            <div className="text-sm text-muted-foreground text-center">Enable all notification types</div>
          </Button>

          <Button 
            className="h-auto p-6 flex flex-col items-center space-y-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0"
            onClick={() => {
              alertConfigs.forEach(config => {
                updateAlertConfig(config.id, { enabled: false, channels: { whatsapp: false, email: false, push: false } });
              });
            }}
          >
            <div className="font-medium">Disable All</div>
            <div className="text-sm text-muted-foreground text-center">Turn off all notifications</div>
          </Button>
        </div>
      </div>

      {/* Alert Configurations */}
      <div className="space-y-4">
        {alertConfigs.map((config) => (
          <div key={config.id} className={`bg-card border rounded-lg shadow-sm p-6 transition-all duration-200 ${config.enabled ? 'border-primary/30 shadow-md' : 'border-card-border hover:shadow-md'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h4 className="font-medium text-foreground">{config.title}</h4>
                  {config.frequency && (
                    <Badge className="text-xs bg-background/50 text-muted-foreground border-border">
                      <Clock className="w-3 h-3 mr-1" />
                      {config.frequency}
                    </Badge>
                  )}
                  {config.threshold && (
                    <Badge className="text-xs bg-background/50 text-muted-foreground border-border">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {config.threshold}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={() => toggleAlert(config.id)}
              />
            </div>

            {config.enabled && (
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">Delivery Channels</span>
                  <div className="flex space-x-2">
                    {Object.entries(config.channels).map(([channel, enabled]) => (
                      <button
                        key={channel}
                        onClick={() => toggleChannel(config.id, channel as keyof AlertConfig['channels'])}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${getChannelColor(channel, enabled)} hover:scale-105`}
                      >
                        {getChannelIcon(channel)}
                        <span className="capitalize">{channel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {config.id === 'price-alerts' && (
                  <div className="bg-muted/30 rounded-lg border border-border p-4">
                    <h5 className="font-medium text-sm mb-3 text-foreground">Price Alert Settings</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Default Threshold</label>
                        <select className="w-full text-sm p-2 bg-input border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          <option>±5%</option>
                          <option>±3%</option>
                          <option>±10%</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Frequency Limit</label>
                        <select className="w-full text-sm p-2 bg-input border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          <option>Max 5 per day</option>
                          <option>Max 10 per day</option>
                          <option>No limit</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sample Alert Preview */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-6 text-foreground">Sample Alert Preview</h3>
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-profit/30 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <MessageCircle className="w-4 h-4 text-profit" />
              <span className="text-sm font-medium text-profit">WhatsApp Alert</span>
            </div>
            <div className="text-sm text-foreground">
              <strong>📈 Daily Market Update</strong><br />
              Your watchlist is up 2.1% today. TCS (+3.2%) and Reliance (+2.8%) led gains.<br />
              <strong>Top News:</strong> RBI keeps rates unchanged; IT sector rallies on positive earnings.<br />
              <em>InvestIQ - Your Smart Investment Assistant</em>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg border border-primary/30 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Email Alert</span>
            </div>
            <div className="text-sm text-foreground">
              <strong>Subject:</strong> Price Alert: TCS crosses ₹4,100<br />
              TCS has moved +5.2% to ₹4,125. This crosses your alert threshold of +5%.<br />
              Recent news: Strong Q3 earnings, digital transformation demand growing.
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Reset to Defaults
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}