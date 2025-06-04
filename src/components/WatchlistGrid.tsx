import { useWatchlist, WatchItem } from '@/lib/store/useWatchlist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export function WatchlistGrid() {
  const { items, remove } = useWatchlist();

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Your watchlist is empty. Search for stocks to add them.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item: WatchItem) => (
        <Card key={item.symbol}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Link href={`/scrip/${item.symbol}`} className="hover:underline">
                {item.symbol}
              </Link>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove(item.symbol)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 