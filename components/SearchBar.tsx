'use client';

import { Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export function SearchBar({ searchQuery, setSearchQuery, viewMode, setViewMode }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#19593A] focus:border-[#19593A] sm:text-sm transition-all shadow-sm"
          placeholder="Search artifacts by title, description, or tech tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm h-[46px] self-end sm:self-auto shrink-0">
        <button
          onClick={() => setViewMode('grid')}
          className={cn(
            "p-2 rounded-lg flex items-center justify-center transition-all",
            viewMode === 'grid' 
              ? "bg-[#19593A] text-white shadow-sm" 
              : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={cn(
            "p-2 rounded-lg flex items-center justify-center transition-all",
            viewMode === 'list' 
              ? "bg-[#19593A] text-white shadow-sm" 
              : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
          )}
          aria-label="List view"
        >
          <List className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
