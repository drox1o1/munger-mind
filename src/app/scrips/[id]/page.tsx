import { JournalGrid } from '@/components/journal/JournalGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface ScripDetailPageProps {
  params: {
    id: string;
  };
}

export default function ScripDetailPage({ params }: ScripDetailPageProps) {
  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scrip Details</h1>
          <p className="text-gray-600 mt-2">ID: {params.id}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="icon">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search in journal entries..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Journal Entries */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Journal Entries</h2>
              <Button>Add Entry</Button>
            </div>
            <JournalGrid scripId={params.id} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Watchlist Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price Alert</span>
                <Button variant="outline" size="sm">Set Alert</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Volume Alert</span>
                <Button variant="outline" size="sm">Set Alert</Button>
              </div>
            </div>
          </div>

          {/* Related Scripts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Related Scripts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span>Related Script 1</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span>Related Script 2</span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Mental Models</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Investing</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Psychology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 