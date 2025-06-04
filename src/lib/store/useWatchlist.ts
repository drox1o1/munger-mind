import { create } from 'zustand';
import { supabaseBrowser } from '@/utils/supabase/client';

type Item = { id?: string; symbol: string; name: string; added_at?: string };

export const useWatchlist = create<{
  items: Item[];
  hydrate: () => void;
  add: (i: Item) => void;
  remove: (symbol: string) => void;
}>((set) => ({
  items: [],
  hydrate: async () => {
    const { data } = await supabaseBrowser()
      .from('watchlist')
      .select('*')
      .order('added_at', { ascending: false });
    set({ items: data ?? [] });
  },
  add: async (i) => {
    const { data, error } = await supabaseBrowser()
      .from('watchlist')
      .insert(i)
      .select()
      .single();
    if (!error) set((s) => ({ items: [data!, ...s.items] }));
  },
  remove: async (symbol) => {
    await supabaseBrowser().from('watchlist').delete().eq('symbol', symbol);
    set((s) => ({ items: s.items.filter((w) => w.symbol !== symbol) }));
  },
})); 