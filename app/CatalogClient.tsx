'use client';

import { useState, useEffect } from 'react';
import { Artifact } from '@/lib/types';
import { StatsBar } from '@/components/StatsBar';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import { ArtifactGrid } from '@/components/ArtifactGrid';
import { ArtifactDrawer } from '@/components/ArtifactDrawer';
import { Logo } from '@/components/Logo';
import { useSearchParams, useRouter } from 'next/navigation';

import { Settings, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArtifactForm } from '@/components/ArtifactForm';

export function CatalogClient({ initialArtifacts, isAdmin }: { initialArtifacts: Artifact[], isAdmin?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [artifactsList, setArtifactsList] = useState<Artifact[]>(initialArtifacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Sync server data to client state when 'initialArtifacts' updates via router.refresh()
  useEffect(() => {
    setArtifactsList(initialArtifacts);
  }, [initialArtifacts]);

  const [filters, setFilters] = useState<FilterState>({
    type: searchParams.get('type') ?? '',
    sl: searchParams.get('sl') ?? '',
    aud: searchParams.get('aud') ?? '',
    status: searchParams.get('status') ?? '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    // Determine the new state: clear everything else but the current key
    const newFilters: FilterState = { type: '', sl: '', aud: '', status: '' };
    if (value) newFilters[key] = value;
    
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (value) params.set(key, value);
    
    router.push('?' + params.toString(), { scroll: false });
  };

  const clearFilters = () => {
    setFilters({ type: '', sl: '', aud: '', status: '' });
    setSearchQuery('');
    router.push('/', { scroll: false });
  };

  const filteredArtifacts = useMemo(() => {
    return artifactsList.filter(artifact => {
      // Search logic
      const matchesSearch = !searchQuery || [
        artifact.title,
        artifact.description || '',
        artifact.artifact_type,
        artifact.owner_name || '',
        ...artifact.service_line,
        ...artifact.industry,
        ...artifact.audience,
        ...artifact.tech_tags
      ].some(field => field && field.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter logic
      const matchesType = !filters.type || artifact.artifact_type === filters.type;
      const matchesSL = !filters.sl || artifact.service_line.includes(filters.sl);
      const matchesAud = !filters.aud || artifact.audience.includes(filters.aud);
      const matchesStatus = !filters.status || artifact.status === filters.status;

      return matchesSearch && matchesType && matchesSL && matchesAud && matchesStatus;
    });
  }, [artifactsList, searchQuery, filters]);

  const handleSuccess = () => {
    setIsFormOpen(false);
    router.refresh(); // Tell Next.js Server to re-fetch the database and trigger our useEffect
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center w-full shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Logo className="h-8" showText={false} />
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <span className="font-bold text-gray-800 text-[16px] hidden sm:block tracking-tight">Knowledge Hub</span>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-[#3A7D44] transition-colors text-sm font-bold mr-2">
                <Settings className="w-4 h-4" /> Admin
              </Link>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-1 bg-[#3A7D44] hover:bg-[#2E6336] text-white font-bold px-4 py-1.5 text-sm rounded transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Artifact
              </button>
            </>
          )}
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="ml-2 text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar 
            artifacts={artifactsList} 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onClearFilters={clearFilters}
            isAdmin={isAdmin}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow min-w-0 flex flex-col w-full">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            viewMode={viewMode}
            setViewMode={setViewMode}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          
          <StatsBar artifacts={filteredArtifacts} isAdmin={isAdmin} />
          
          <ArtifactGrid 
            artifacts={filteredArtifacts}
            filters={filters}
            searchQuery={searchQuery}
            viewMode={viewMode}
            onSelectArtifact={setSelectedArtifact}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      <ArtifactDrawer 
        artifact={selectedArtifact} 
        onClose={() => setSelectedArtifact(null)} 
        isAdmin={isAdmin}
      />

      <ArtifactForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
