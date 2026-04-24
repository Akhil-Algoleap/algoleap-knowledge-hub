'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="relative flex-shrink-0">
        <img 
          src="/logo.png" 
          alt="Algoleap Logo" 
          className={cn("h-10 w-auto object-contain", !showText && "h-8")}
        />
      </div>
    </div>
  );
}
