import { getQuote, getDaily } from '@/lib/alphaClient';
import { PriceChart } from '@/components/PriceChart';
import { InsightDialog } from '@/components/InsightDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageProps {
  params: {
    symbol: string;
  };
}

export default async function ScripPage({ params }: PageProps) {
  const [quote, daily] = await Promise.all([
    getQuote(params.symbol),
    getDaily(params.symbol),
  ]);

  const chartData = {
    dates: Object.keys(daily).slice(0, 30).reverse(),
    prices: Object.values(daily)
      .slice(0, 30)
      .reverse()
      .map((day: any) => parseFloat(day['4. close'])),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{params.symbol}</h1>
          <p className="text-muted-foreground">
            ${quote.price.toFixed(2)} ({quote.change > 0 ? '+' : ''}
            {quote.change.toFixed(2)}%)
          </p>
        </div>
        <InsightDialog topic={params.symbol} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart data={chartData} />
        </CardContent>
      </Card>

      <Tabs defaultValue="fundamentals">
        <TabsList>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>
        <TabsContent value="fundamentals">
          <Card>
            <CardHeader>
              <CardTitle>Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(daily[Object.keys(daily)[0]]).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sentiment analysis coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 