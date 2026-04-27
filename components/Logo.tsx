'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  // Map sizes to height values
  const h = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/logo.png" 
        alt="Algoleap" 
        style={{ height: h, width: 'auto' }}
        className="block object-contain"
      />
    </div>
  );
}
