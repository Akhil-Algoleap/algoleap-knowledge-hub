'use client';

import { Artifact } from '@/lib/types';
import { ArtifactCard } from './ArtifactCard';
import { FilterState } from './FilterSidebar';
import { useMemo } from 'react';
import { FolderSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtifactGridProps {
  artifacts: Artifact[];
  filters: FilterState;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  onSelectArtifact: (artifact: Artifact) => void;
  isAdmin?: boolean;
}

export function ArtifactGrid({ artifacts, filters, searchQuery, viewMode, onSelectArtifact, isAdmin }: ArtifactGridProps) {
  
  const filtered = artifacts;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center glass-card border-dashed">
        <div className="p-4 rounded-full bg-white/5 mb-4 text-algoleap-muted">
          <FolderSearch className="h-12 w-12" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No artifacts found</h3>
        <p className="text-algoleap-muted max-w-md">
          We couldn't find any artifacts matching your current search and filters. 
          Try adjusting your criteria or clearing filters.
        </p>
      </div>
    );
  }

  return (
    <div 
      className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "flex flex-col gap-3"
      }
    >
      <AnimatePresence>
        {filtered.map(artifact => (
          <motion.div
            key={artifact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ArtifactCard 
              artifact={artifact} 
              onSelect={onSelectArtifact} 
              viewMode={viewMode}
              isAdmin={isAdmin}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
