import { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { useWatchlist } from '@/lib/store/useWatchlist';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function CommandSearch() {
  const [query, setQuery] = useState('');
  const { results } = useSearch(query);
  const { add } = useWatchlist();

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="I want to invest in..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Results">
          {results.map((result) => (
            <CommandItem
              key={result.symbol}
              value={result.symbol}
              onSelect={() => {
                add(result);
                setQuery('');
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-medium">{result.symbol}</p>
                  <p className="text-sm text-muted-foreground">{result.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    add(result);
                    setQuery('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
} 