import { create, StateCreator } from 'zustand';
import { supabaseBrowser } from '@/utils/supabase/client';

type JournalEntry = {
  id?: string;
  symbol: string;
  body: string;
  created_at?: string;
};

interface JournalState {
  entries: JournalEntry[];
  hydrate: () => Promise<void>;
  add: (entry: JournalEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

type JournalStore = StateCreator<JournalState>;

export const useJournal = create<JournalState>((set: JournalStore['setState']) => ({
  entries: [],
  hydrate: async () => {
    const { data } = await supabaseBrowser()
      .from('journal')
      .select('*')
      .order('created_at', { ascending: false });
    set({ entries: data ?? [] });
  },
  add: async (entry: JournalEntry) => {
    const { data, error } = await supabaseBrowser()
      .from('journal')
      .insert(entry)
      .select()
      .single();
    if (!error) set((state: JournalState) => ({ entries: [data!, ...state.entries] }));
  },
  remove: async (id: string) => {
    await supabaseBrowser().from('journal').delete().eq('id', id);
    set((state: JournalState) => ({ entries: state.entries.filter((e: JournalEntry) => e.id !== id) }));
  },
})); 