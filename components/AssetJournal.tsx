import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetJournalProps {
  slug: string;
  assetName: string;
}

export function AssetJournal({ slug, assetName }: AssetJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    loadEntries();
  }, [slug]);

  const loadEntries = () => {
    // In production, load from Supabase
    const savedEntries = localStorage.getItem(`journal-${slug}`);
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      })));
    }
  };

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    localStorage.setItem(`journal-${slug}`, JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
  };

  const addEntry = () => {
    if (!newEntry.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: newEntry,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedEntries = [entry, ...entries];
    saveEntries(updatedEntries);
    setNewEntry('');
    setIsEditing(false);
  };

  const updateEntry = (id: string, content: string) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id
        ? { ...entry, content, updatedAt: new Date() }
        : entry
    );
    saveEntries(updatedEntries);
    setEditingId(null);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border border-card-border/80 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-chart-3/30 to-chart-3/10 rounded-xl border border-chart-3/20">
              <BookOpen className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <CardTitle className="text-lg">Investment Journal</CardTitle>
              <CardDescription className="text-sm">
                Track your thoughts and analysis for {assetName}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* New Entry Form */}
        {isEditing && (
          <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, analysis, or observations about this investment..."
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="min-h-[120px] bg-background border-input-border focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex items-center space-x-3">
                <Button
                  onClick={addEntry}
                  disabled={!newEntry.trim()}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setNewEntry('');
                  }}
                  variant="outline"
                  size="sm"
                  className="touch-target"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Start Your Investment Journal</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Document your investment thesis, track your decision-making process, and reflect on your journey with {assetName}.
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/20 touch-target"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            </div>
          ) : (
            entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                isEditing={editingId === entry.id}
                onEdit={() => setEditingId(entry.id)}
                onSave={(content) => updateEntry(entry.id, content)}
                onCancel={() => setEditingId(null)}
                onDelete={() => deleteEntry(entry.id)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>

        {/* Entry Statistics */}
        {entries.length > 0 && (
          <div className="pt-6 border-t border-border/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gradient-to-br from-chart-1/10 to-chart-1/5 rounded-lg border border-chart-1/20">
                <p className="text-lg font-semibold text-chart-1">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Total Entries</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-lg border border-chart-2/20">
                <p className="text-lg font-semibold text-chart-2">
                  {Math.round(entries.reduce((acc, entry) => acc + entry.content.length, 0) / entries.length)}
                </p>
                <p className="text-xs text-muted-foreground">Avg Length</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-3/10 to-chart-3/5 rounded-lg border border-chart-3/20">
                <p className="text-lg font-semibold text-chart-3">
                  {Math.round((Date.now() - entries[entries.length - 1]?.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-xs text-muted-foreground">Days Tracking</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-chart-4/10 to-chart-4/5 rounded-lg border border-chart-4/20">
                <p className="text-lg font-semibold text-chart-4">
                  {entries.filter(entry => 
                    Date.now() - entry.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function JournalEntryCard({
  entry,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  formatDate
}: {
  entry: JournalEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (content: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  formatDate: (date: Date) => string;
}) {
  const [editContent, setEditContent] = useState(entry.content);

  useEffect(() => {
    setEditContent(entry.content);
  }, [entry.content, isEditing]);

  if (isEditing) {
    return (
      <div className="p-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20">
        <div className="space-y-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[120px] bg-background border-input-border focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => onSave(editContent)}
              disabled={!editContent.trim()}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="touch-target"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl border border-secondary/20 hover:shadow-lg transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {formatDate(entry.createdAt)}
            </Badge>
            {entry.updatedAt > entry.createdAt && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-chart-3/10 text-chart-3 border-chart-3/30">
                Edited
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-secondary touch-target"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive touch-target"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{entry.content.length} characters</span>
          {entry.updatedAt > entry.createdAt && (
            <span className="ml-4">Last updated: {formatDate(entry.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}