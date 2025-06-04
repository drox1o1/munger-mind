import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJournalStore } from '@/store/journal';
import { JournalEntry, JournalEntryType } from '@/types/journal';

interface JournalEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scripId: string;
  entry?: JournalEntry;
}

export function JournalEntryDialog({
  open,
  onOpenChange,
  scripId,
  entry,
}: JournalEntryDialogProps) {
  const { addEntry, updateEntry } = useJournalStore();
  const [type, setType] = useState<JournalEntryType>("analysis");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setContent(entry.content);
    } else {
      setType("analysis");
      setContent("");
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (entry) {
      await updateEntry(entry.id, { type, content });
    } else {
      await addEntry({ scripId, type, content });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Entry" : "Add Entry"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value: string) => setType(value as JournalEntryType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="trade">Trade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Write your journal entry..."
              className="min-h-[200px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {entry ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 