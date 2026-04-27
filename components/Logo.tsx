'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const S = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fontSize = S * 0.78;
  const gap = S * 0.32;
  const textWidth = fontSize * 4.6;
  const totalWidth = S + gap + textWidth;
  
  const green = '#3A7D44';
  const symbolCream = '#EEF2D1'; 
  const strokeWidth = S * 0.10; // Extra thick stroke

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${S}`}
      height={S}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Solid green square with very rounded corners */}
      <rect
        x="0"
        y="0"
        width={S}
        height={S}
        rx={S * 0.28}
        ry={S * 0.28}
        fill={green}
      />

      {/* 
        Symbol: MASSIVE Outlined triangle and SOLID wide bar.
      */}
      <g>
        {/* Massive Triangle outline */}
        <path 
          d={`
            M ${S * 0.08} ${S * 0.12}
            L ${S * 0.62} ${S * 0.50}
            L ${S * 0.08} ${S * 0.88}
            Z
          `} 
          fill="none"
          stroke={symbolCream}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Wide SOLID Vertical Bar */}
        <rect 
          x={S * 0.62}
          y={S * 0.12}
          width={S * 0.22}
          height={S * 0.76}
          rx={S * 0.04}
          fill={symbolCream}
        />
      </g>

      {/* algoleap text */}
      <text
        x={S + gap}
        y={S * 0.76}
        fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        fill={green}
        letterSpacing="-0.6"
      >
        algoleap
      </text>
    </svg>
  );
}
