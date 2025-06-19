import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Tag, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  category: 'decision' | 'reflection' | 'research' | 'goal';
  relatedStock?: string;
}

export function InvestmentJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: 1,
      title: 'Initial Investment Strategy',
      content: 'Starting my investment journey with a focus on large-cap stocks and index funds. Planning to invest ₹25,000 monthly through SIP. Goal is to build a corpus for house down payment in 5 years.',
      date: new Date('2025-06-10'),
      tags: ['strategy', 'goals', 'sip'],
      category: 'goal',
    },
    {
      id: 2,
      title: 'TCS Investment Decision',
      content: 'Considering TCS after strong Q3 results. P/E at 28x seems reasonable given consistent growth. Digital transformation demand should drive future growth. Will start with small position.',
      date: new Date('2025-06-12'),
      tags: ['tcs', 'technology', 'research'],
      category: 'research',
      relatedStock: 'TCS',
    },
    {
      id: 3,
      title: 'Market Correction Reflection',
      content: 'Market fell 8% this week due to global tensions. Stayed calm and continued SIP. This taught me the importance of staying invested during volatility. Added extra ₹10k during the dip.',
      date: new Date('2025-06-14'),
      tags: ['market-correction', 'psychology', 'discipline'],
      category: 'reflection',
    },
  ]);

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    category: 'decision' as JournalEntry['category'],
    tags: '',
    relatedStock: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Entries', color: 'gray' },
    { id: 'decision', label: 'Decisions', color: 'blue' },
    { id: 'reflection', label: 'Reflections', color: 'green' },
    { id: 'research', label: 'Research', color: 'purple' },
    { id: 'goal', label: 'Goals', color: 'orange' },
  ];

  const getCategoryColor = (category: string) => {
    const categoryMap = {
      decision: 'bg-primary/10 text-primary border-primary/20',
      reflection: 'bg-profit/10 text-profit border-profit/20',
      research: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
      goal: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    };
    return categoryMap[category as keyof typeof categoryMap] || 'bg-muted text-muted-foreground border-border';
  };

  const addEntry = () => {
    if (newEntry.title.trim() && newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Date.now(),
        title: newEntry.title,
        content: newEntry.content,
        date: new Date(),
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        category: newEntry.category,
        relatedStock: newEntry.relatedStock || undefined,
      };

      setEntries([entry, ...entries]);
      setNewEntry({
        title: '',
        content: '',
        category: 'decision',
        tags: '',
        relatedStock: '',
      });
      setIsAddingEntry(false);
    }
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const journalPrompts = [
    "Why did I make this investment decision?",
    "What emotions am I feeling about this investment?",
    "What did I learn from this market movement?",
    "How does this align with my long-term goals?",
    "What would I do differently next time?",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-profit/10 rounded-xl">
            <BookOpen className="w-6 h-6 text-profit" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Investment Journal</h2>
            <p className="text-muted-foreground">Record your investment thoughts and track your decision-making journey</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddingEntry(true)} 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Entry */}
      {isAddingEntry && (
        <div className="bg-card border border-card-border rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-6 text-foreground">New Journal Entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <Input
                type="text"
                placeholder="Enter a title for your entry..."
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                className="bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({...newEntry, category: e.target.value as JournalEntry['category']})}
                  className="w-full bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="decision">Investment Decision</option>
                  <option value="reflection">Market Reflection</option>
                  <option value="research">Stock Research</option>
                  <option value="goal">Financial Goal</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Related Stock (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g., TCS, RELIANCE"
                  value={newEntry.relatedStock}
                  onChange={(e) => setNewEntry({...newEntry, relatedStock: e.target.value})}
                  className="bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tags (comma-separated)</label>
              <Input
                type="text"
                placeholder="e.g., technology, long-term, volatility"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                className="bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Content</label>
              <Textarea
                placeholder="Write about your investment thoughts, decisions, or reflections..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                rows={6}
                className="bg-input border border-input-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground"
              />
            </div>

            <div className="bg-muted/30 rounded-lg border border-border p-4">
              <h4 className="font-medium text-primary mb-3">💡 Journal Prompts</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                {journalPrompts.map((prompt, index) => (
                  <li key={index} className="cursor-pointer hover:text-foreground transition-colors" onClick={() => {
                    if (!newEntry.content.includes(prompt)) {
                      setNewEntry({...newEntry, content: newEntry.content + (newEntry.content ? '\n\n' : '') + prompt + '\n'});
                    }
                  }}>
                    • {prompt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={addEntry}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Entry
              </Button>
              <Button 
                onClick={() => setIsAddingEntry(false)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-card border border-card-border rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No journal entries found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start documenting your investment journey'}
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button 
                onClick={() => setIsAddingEntry(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write First Entry
              </Button>
            )}
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-card border border-card-border rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg text-foreground">{entry.title}</h3>
                  <Badge className={`text-xs ${getCategoryColor(entry.category)}`}>
                    {entry.category}
                  </Badge>
                  {entry.relatedStock && (
                    <Badge className="text-xs bg-background/50 text-muted-foreground border-border">
                      <Tag className="w-3 h-3 mr-1" />
                      {entry.relatedStock}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{formatDate(entry.date)}</span>
                  </div>
                  <Button 
                    onClick={() => deleteEntry(entry.id)}
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-foreground whitespace-pre-wrap mb-4 leading-relaxed">{entry.content}</p>

              {entry.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <div className="flex space-x-2">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} className="text-xs bg-background/50 text-muted-foreground border-border">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Journal Statistics */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm p-6 border-2 border-primary/20">
        <h3 className="font-semibold text-lg mb-6 text-foreground">Journal Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center bg-muted/30 rounded-lg border border-border p-4">
            <p className="text-2xl font-semibold text-primary">{entries.length}</p>
            <p className="text-sm text-muted-foreground">Total Entries</p>
          </div>
          <div className="text-center bg-muted/30 rounded-lg border border-border p-4">
            <p className="text-2xl font-semibold text-profit">
              {entries.filter(e => e.category === 'decision').length}
            </p>
            <p className="text-sm text-muted-foreground">Decisions Recorded</p>
          </div>
          <div className="text-center bg-muted/30 rounded-lg border border-border p-4">
            <p className="text-2xl font-semibold text-chart-5">
              {entries.filter(e => e.category === 'research').length}
            </p>
            <p className="text-sm text-muted-foreground">Research Notes</p>
          </div>
          <div className="text-center bg-muted/30 rounded-lg border border-border p-4">
            <p className="text-2xl font-semibold text-chart-3">
              {new Set(entries.flatMap(e => e.tags)).size}
            </p>
            <p className="text-sm text-muted-foreground">Unique Tags</p>
          </div>
        </div>
      </div>
    </div>
  );
}