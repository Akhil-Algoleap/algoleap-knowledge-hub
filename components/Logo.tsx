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
  const strokeWidth = S * 0.08;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${S}`}
      height={S}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Solid green square */}
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
        Symbol: Outlined triangle and bar connected.
        We move the triangle tip (apex) so it touches the vertical bar exactly.
      */}
      <g 
        fill="none" 
        stroke={symbolCream} 
        strokeWidth={strokeWidth} 
        strokeLinejoin="round" 
        strokeLinecap="round"
      >
        {/* Triangle outline - Apex moved to S * 0.64 to touch the bar */}
        <path d={`
          M ${S * 0.22} ${S * 0.26}
          L ${S * 0.64} ${S * 0.50}
          L ${S * 0.22} ${S * 0.74}
          Z
        `} />
        
        {/* Vertical Bar outline - Starts at S * 0.64 (touching triangle apex) */}
        <path d={`
          M ${S * 0.64} ${S * 0.26}
          L ${S * 0.76} ${S * 0.26}
          L ${S * 0.76} ${S * 0.74}
          L ${S * 0.64} ${S * 0.74}
          Z
        `} />
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
