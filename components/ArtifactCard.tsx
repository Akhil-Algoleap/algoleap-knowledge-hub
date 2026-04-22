'use client';

import { Artifact } from '@/lib/types';
import { ExternalLink, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

interface ArtifactCardProps {
  artifact: Artifact;
  onSelect: (artifact: Artifact) => void;
  viewMode: 'grid' | 'list';
}

const typeColors: Record<string, string> = {
  'Pitch Deck': 'bg-blue-50 text-blue-700 border-blue-200',
  'Demo Video': 'bg-amber-50 text-amber-700 border-amber-200',
  'Case Study': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Architecture Doc': 'bg-purple-50 text-purple-700 border-purple-200',
  'Template': 'bg-sky-50 text-sky-700 border-sky-200',
  'Process Doc': 'bg-pink-50 text-pink-700 border-pink-200',
  'Training Material': 'bg-orange-50 text-orange-700 border-orange-200',
};

// Helper for initials
const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
};

export function ArtifactCard({ artifact, onSelect, viewMode }: ArtifactCardProps) {
  const typeStyle = typeColors[artifact.artifact_type] || 'bg-gray-100 text-gray-700 border-gray-200';

  const handleOpen = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(artifact.onedrive_url, '_blank', 'noopener noreferrer');
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onSelect(artifact)}
        className="glass-card p-4 hover:border-algoleap-dark cursor-pointer flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", typeStyle)}>
              {artifact.artifact_type}
            </span>
            {artifact.is_client_safe && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-[#19593A] border-green-200">
                Client Safe
              </span>
            )}
          </div>
          <div className="min-w-0 flex-grow">
            <h3 className="text-gray-900 font-bold truncate group-hover:text-[#19593A] transition-colors">
              {artifact.title}
            </h3>
            <p className="text-sm text-gray-500 truncate mt-0.5" suppressHydrationWarning>
              {artifact.owner_name} • {new Date(artifact.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          {artifact.status === 'needs-update' && (
            <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0 font-medium">
              Needs Review
            </span>
          )}
          <button 
            onClick={handleOpen}
            className="flex items-center gap-1.5 py-1.5 px-3 text-sm font-semibold text-[#19593A] bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            Open <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelect(artifact)}
      className="glass-card flex flex-col h-[290px] hover:border-algoleap-dark cursor-pointer group hover:-translate-y-0.5 transition-transform"
    >
      <div className="p-5 pb-3 flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={cn("px-3 py-1 rounded-full text-[11px] tracking-wide font-bold border", typeStyle)}>
              {artifact.artifact_type}
            </span>
            {artifact.is_client_safe && (
              <span className="px-3 py-1 rounded-full text-[11px] tracking-wide font-bold border bg-green-50 text-[#19593A] border-green-200">
                Client Safe
              </span>
            )}
          </div>
          {artifact.status === 'needs-update' && (
            <button className="p-1.5 border border-gray-200 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </button>
          )}
        </div>
        
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#19593A] transition-colors pt-1">
          {artifact.title}
        </h3>
        
        <p className="text-[13px] text-gray-600 line-clamp-2 overflow-hidden mb-4 flex-grow leading-relaxed">
          {artifact.description || 'No description provided for this artifact. Please update details.'}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {artifact.service_line.slice(0, 2).map((sl: string) => (
            <span key={sl} className="flex items-center text-[11px] font-medium px-2.5 py-1 border border-gray-200 rounded-full text-gray-600 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              {sl}
            </span>
          ))}
          {artifact.service_line.length > 2 && (
            <span className="text-[11px] font-medium px-2 py-1 border border-gray-100 rounded-full text-gray-500 bg-gray-50">
              +{artifact.service_line.length - 2} more
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center mt-auto bg-gray-50/50 rounded-b-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-[10px] font-bold">
            {getInitials(artifact.owner_name || '')}
          </div>
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5" suppressHydrationWarning>
              {new Date(artifact.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
            </span>
          </div>
        </div>
        <button 
          onClick={handleOpen}
          className="flex items-center gap-1.5 py-1.5 px-3 text-[13px] font-bold text-[#19593A] bg-green-50 border border-green-200 rounded-lg hover:bg-[#19593A] hover:text-white hover:border-[#19593A] transition-colors"
        >
          Open <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
