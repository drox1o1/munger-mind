import { create } from 'zustand';
import { JournalEntry } from '@/types/journal';
import { supabaseBrowser } from '@/utils/supabase/client';

interface JournalStore {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: (scripId: string) => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

type JournalState = Pick<JournalStore, "entries" | "isLoading" | "error">;
type JournalActions = Omit<JournalStore, keyof JournalState>;

export const useJournalStore = create<JournalStore>((set: (fn: (state: JournalState) => JournalState) => void, get: () => JournalState & JournalActions) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async (scripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseBrowser()
        .from('journal_entries')
        .select('*')
        .eq('scrip_id', scripId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ entries: data as JournalEntry[], isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addEntry: async (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseBrowser()
        .from('journal_entries')
        .insert([
          {
            scrip_id: entry.scripId,
            type: entry.type,
            content: entry.content,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      set((state: JournalState) => ({
        entries: [data as JournalEntry, ...state.entries],
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateEntry: async (id: string, entry: Partial<JournalEntry>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabaseBrowser()
        .from('journal_entries')
        .update({
          type: entry.type,
          content: entry.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state: JournalState) => ({
        entries: state.entries.map((e: JournalEntry) => (e.id === id ? (data as JournalEntry) : e)),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteEntry: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabaseBrowser()
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state: JournalState) => ({
        entries: state.entries.filter((e: JournalEntry) => e.id !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
})); 