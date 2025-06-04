import { useState, useEffect } from 'react';
import { useJournalStore } from '@/store/journal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { JournalEntry, JournalEntryType } from '@/types/journal';
import { JournalEntryDialog } from './JournalEntryDialog';

interface JournalGridProps {
  scripId: string;
}

export function JournalGrid({ scripId }: JournalGridProps) {
  const { entries, isLoading, error, fetchEntries, deleteEntry } = useJournalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<JournalEntryType | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>();

  useEffect(() => {
    fetchEntries(scripId);
  }, [scripId, fetchEntries]);

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || entry.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleAddEntry = () => {
    setSelectedEntry(undefined);
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = async (entry: JournalEntry) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(entry.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Journal Entries</h2>
        <Button onClick={handleAddEntry}>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={(value: string) => setFilterType(value as JournalEntryType | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="analysis">Analysis</SelectItem>
            <SelectItem value="trade">Trade</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value: string) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEntry(entry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(entry.createdAt), 'MMM d, yyyy')}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <JournalEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        scripId={scripId}
        entry={selectedEntry}
      />
    </div>
  );
} 