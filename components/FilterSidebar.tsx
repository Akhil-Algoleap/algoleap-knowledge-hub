'use client';

import { Artifact } from '@/lib/types';
import { ARTIFACT_TYPES, SERVICE_LINES, AUDIENCES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import { useMemo } from 'react';

export interface FilterState {
  type: string;
  sl: string;
  aud: string;
  status: string;
}

interface FilterSidebarProps {
  artifacts: Artifact[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  isAdmin?: boolean;
}

export function FilterSidebar({ artifacts, filters, onFilterChange, onClearFilters, isAdmin }: FilterSidebarProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== '');
  
  // Compute counts (Static for now, but including Clear All UI)
  const counts = useMemo(() => {
    const typeCount: Record<string, number> = {};
    const slCount: Record<string, number> = {};
    const audCount: Record<string, number> = {};
    
    ARTIFACT_TYPES.forEach(t => typeCount[t] = 0);
    SERVICE_LINES.forEach(sl => slCount[sl] = 0);
    AUDIENCES.forEach(a => audCount[a] = 0);

    let activeCount = 0;
    let needsUpdateCount = 0;

    artifacts.forEach(item => {
      if (typeCount[item.artifact_type] !== undefined) typeCount[item.artifact_type]++;
      item.service_line.forEach(sl => { if (slCount[sl] !== undefined) slCount[sl]++; });
      item.audience.forEach(a => { if (audCount[a] !== undefined) audCount[a]++; });
      if (item.status === 'current') activeCount++;
      if (item.status === 'needs-update') needsUpdateCount++;
    });

    return { type: typeCount, sl: slCount, aud: audCount, current: activeCount, needsUpdate: needsUpdateCount };
  }, [artifacts]);

  const FilterSection = ({ title, options, filterKey, countMap }: { 
    title: string; 
    options: readonly string[]; 
    filterKey: keyof FilterState; 
    countMap: Record<string, number>; 
  }) => (
    <div className="mb-8">
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      <ul className="space-y-1.5">
        {options.map((opt: string) => {
          const isActive = filters[filterKey] === opt;
          return (
            <li key={opt}>
              <button
                onClick={() => onFilterChange(filterKey, isActive ? '' : opt)}
                className={cn(
                  "w-full text-left flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer",
                  isActive 
                    ? "text-[#3A7D44] bg-green-50" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#3A7D44] shrink-0"></span>}
                  <span className="truncate">{opt}</span>
                </div>
                <span className={cn(
                  "text-[10px] py-0.5 px-2 rounded-full font-bold ml-2",
                  isActive ? "bg-green-100 text-[#3A7D44]" : "bg-gray-100 text-gray-400"
                )}>
                  {countMap[opt] || 0}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="w-full sticky top-6 pt-2 text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3A7D44]" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="text-[11px] font-bold text-[#3A7D44] hover:text-[#2E6336] transition-colors uppercase tracking-wider"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-140px)] pr-4 scrollbar-hide pb-20">
        <FilterSection 
          title="Artifact Type" 
          options={ARTIFACT_TYPES} 
          filterKey="type" 
          countMap={counts.type} 
        />
        <FilterSection 
          title="Service Line" 
          options={SERVICE_LINES} 
          filterKey="sl" 
          countMap={counts.sl} 
        />
        <FilterSection 
          title="Audience" 
          options={AUDIENCES} 
          filterKey="aud" 
          countMap={counts.aud} 
        />
        
        {isAdmin && (
          <div className="mb-8">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Status</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => onFilterChange('status', filters.status === 'current' ? '' : 'current')}
                  className={cn(
                    "w-full text-left flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer",
                    filters.status === 'current' 
                      ? "text-[#3A7D44] bg-green-50" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", filters.status === 'current' ? "bg-[#3A7D44]" : "bg-green-500")}></span>
                    Current
                  </span>
                  <span className={cn("text-[10px] py-0.5 px-2 rounded-full font-bold ml-2", filters.status === 'current' ? "bg-green-100 text-[#3A7D44]" : "bg-gray-100 text-gray-400")}>{counts.current}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onFilterChange('status', filters.status === 'needs-update' ? '' : 'needs-update')}
                  className={cn(
                    "w-full text-left flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer",
                    filters.status === 'needs-update' 
                      ? "text-amber-700 bg-amber-50" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-amber-500"></span>
                    Needs Update
                  </span>
                  <span className={cn("text-[10px] py-0.5 px-2 rounded-full font-bold ml-2", filters.status === 'needs-update' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400")}>{counts.needsUpdate}</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
