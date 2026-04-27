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
  const symbolCream = '#EEF2D1'; // The cream/light-lime color from image 2

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${S}`}
      height={S}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Solid green square with very rounded corners (approx 28% radius) */}
      <rect
        x="0"
        y="0"
        width={S}
        height={S}
        rx={S * 0.28}
        ry={S * 0.28}
        fill={green}
      />

      {/* Symbol: Triangle (Play) - slightly rounded tips */}
      <path
        d={`
          M ${S * 0.24} ${S * 0.26}
          L ${S * 0.60} ${S * 0.50}
          L ${S * 0.24} ${S * 0.74}
          Z
        `}
        fill={symbolCream}
      />

      {/* Symbol: Vertical Bar - slightly rounded */}
      <rect
        x={S * 0.64}
        y={S * 0.26}
        width={S * 0.12}
        height={S * 0.48}
        rx={S * 0.03}
        fill={symbolCream}
      />

      {/* algoleap text - Bold, green, tight tracking */}
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
