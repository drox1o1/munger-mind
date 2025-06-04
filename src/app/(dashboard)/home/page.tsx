import { CommandSearch } from '@/components/CommandSearch';
import { WatchlistGrid } from '@/components/WatchlistGrid';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Markets</h1>
        <CommandSearch />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
        <WatchlistGrid />
      </div>
    </div>
  );
} 