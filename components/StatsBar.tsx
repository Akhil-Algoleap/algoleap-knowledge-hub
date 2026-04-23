'use client';

import { Artifact } from '@/lib/types';
import { useMemo } from 'react';

interface StatsBarProps {
  artifacts: Artifact[];
  isAdmin?: boolean;
}

export function StatsBar({ artifacts, isAdmin }: StatsBarProps) {
  const stats = useMemo(() => {
    const total = artifacts.length;
    
    // Added this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const addedThisMonth = artifacts.filter(
      a => new Date(a.created_at) >= firstDayOfMonth
    ).length;
    
    // Active
    const active = artifacts.filter(a => a.status === 'current').length;
    
    // Needs review
    const needsReview = artifacts.filter(a => a.status === 'needs-update').length;

    return { total, addedThisMonth, active, needsReview };
  }, [artifacts]);

  const cards = [
    { label: 'Total Artifacts', value: stats.total, color: 'text-slate-800', show: true },
    { label: 'Added This Month', value: stats.addedThisMonth, color: 'text-slate-800', show: true },
    { label: 'Active', value: stats.active, color: 'text-[#19593A]', show: isAdmin },
    { label: 'Needs Review', value: stats.needsReview, color: 'text-amber-600', show: isAdmin },
  ].filter(c => c.show);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="glass-card p-5 flex flex-col justify-center sm:justify-start hover:-translate-y-1 transition-transform">
          <h3 className={`text-[32px] leading-none font-bold tracking-tight mb-2 ${card.color}`}>{card.value}</h3>
          <p className="text-[13px] text-gray-500 font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
