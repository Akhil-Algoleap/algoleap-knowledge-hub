'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const S = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  // Increase font size slightly to match the pic better
  const fontSize = S * 0.82;
  const gap = S * 0.35;
  const textWidth = fontSize * 4.4;
  const totalWidth = S + gap + textWidth;
  
  const green = '#3A7D44';
  const symbolCream = '#EEF2D1'; 
  const strokeWidth = S * 0.11; // Thicker border for the triangle

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
        Triangle is expanded further to touch the edges more closely.
      */}
      <g>
        {/* Massive Triangle outline - Starts at 6% width, height from 10% to 90% */}
        <path 
          d={`
            M ${S * 0.06} ${S * 0.10}
            L ${S * 0.60} ${S * 0.50}
            L ${S * 0.06} ${S * 0.90}
            Z
          `} 
          fill="none"
          stroke={symbolCream}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* SOLID Vertical Bar - Touches triangle apex exactly */}
        <rect 
          x={S * 0.60}
          y={S * 0.10}
          width={S * 0.24}
          height={S * 0.80}
          rx={S * 0.05}
          fill={symbolCream}
        />
      </g>

      {/* 
        algoleap text - Using a more "Logo-accurate" alignment and font stack.
        The user wants it to NOT look like generic "text format".
        We tighten the tracking and use a rounded font stack.
      */}
      <text
        x={S + gap}
        y={S * 0.52}
        dominantBaseline="middle"
        fontFamily="'Outfit', 'Montserrat', 'Lexend', 'Segoe UI Variable', 'Segoe UI', Arial, sans-serif"
        fontWeight="900"
        fontSize={fontSize}
        fill={green}
        letterSpacing="-1.2"
        style={{ fontVariantLigatures: 'none' }}
      >
        algoleap
      </text>
    </svg>
  );
}
