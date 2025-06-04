import useSWR from 'swr';
import { WatchItem } from '@/lib/store/useWatchlist';

export function useSearch(query: string) {
  const { data, error, isLoading } = useSWR<{ results: WatchItem[] }>(
    query.length < 3 ? null : `/api/search?q=${encodeURIComponent(query)}`
  );

  return {
    results: data?.results || [],
    isLoading,
    error,
  };
} 