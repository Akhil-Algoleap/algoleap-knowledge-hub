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
        {/* Rounded Green Box */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#3A7D44" />
          {/* Play Icon / Triangle */}
          <path d="M12 11L24 20L12 29V11Z" fill="#FDFCF0" />
          {/* Vertical Bar */}
          <rect x="26" y="11" width="3" height="18" rx="1" fill="#FDFCF0" />
        </svg>
      </div>
      
      {showText && (
        <span className="text-[28px] font-bold tracking-tight text-[#3A7D44]">
          algoleap
        </span>
      )}
    </div>
  );
}
