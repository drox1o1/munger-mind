'use client';

import { useEffect, useState } from 'react';
import { useJournal } from '@/lib/store/useJournal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type JournalEntry = {
  id?: string;
  symbol: string;
  body: string;
  created_at?: string;
};

export function JournalGrid({ symbol }: { symbol: string }) {
  const { entries, hydrate, add, remove } = useJournal();
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      await add({ symbol, body: newEntry.trim() });
      setNewEntry('');
      toast.success('Journal entry added');
    } catch {
      toast.error('Failed to add journal entry');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Journal entry removed');
    } catch {
      toast.error('Failed to remove journal entry');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your thoughts about this security..."
          value={newEntry}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEntry(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={!newEntry.trim()}>
          Add Entry
        </Button>
      </form>

      <div className="grid gap-4">
        {entries
          .filter((e: JournalEntry) => e.symbol === symbol)
          .map((entry: JournalEntry) => (
            <Card key={entry.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {new Date(entry.created_at!).toLocaleString()}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => entry.id && handleDelete(entry.id)}
                >
                  Delete
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {entry.body}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
} 