import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface WeatherWidgetProps {
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className = "" }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call - in real app, use actual weather service
    const fetchWeather = async () => {
      try {
        // Mock weather data - replace with actual API call
        const mockWeather: WeatherData = {
          location: "Mumbai",
          temperature: 28,
          condition: "Partly Cloudy",
          humidity: 68,
          windSpeed: 12,
          icon: "partly-cloudy"
        };
        
        setTimeout(() => {
          setWeather(mockWeather);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'partly cloudy':
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-4 h-4 text-blue-300" />;
      default:
        return <Cloud className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-secondary/40 to-secondary/20 px-3 py-2 rounded-lg border border-border/60 backdrop-blur-sm animate-pulse ${className}`}>
        <div className="h-4 bg-muted rounded w-16 mb-1"></div>
        <div className="h-3 bg-muted rounded w-12"></div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-secondary/40 to-secondary/20 px-3 py-2 rounded-lg border border-border/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
      <div className="flex items-center space-x-2">
        {getWeatherIcon(weather.condition)}
        <div className="text-right">
          <p className="text-xs font-medium text-foreground">{weather.location}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Thermometer className="w-2 h-2 mr-1" />
            <span>{weather.temperature}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};