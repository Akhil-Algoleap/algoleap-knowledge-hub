'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const S = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fontSize = S * 0.80;
  const gap = S * 0.35;
  const totalWidth = S + gap + fontSize * 4.6;
  const strokeW = S * 0.07; // border thickness
  const green = '#3A7D44';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${S}`}
      height={S}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Outlined rounded square — white fill, green border */}
      <rect
        x={strokeW / 2}
        y={strokeW / 2}
        width={S - strokeW}
        height={S - strokeW}
        rx={S * 0.24}
        ry={S * 0.24}
        fill="white"
        stroke={green}
        strokeWidth={strokeW}
      />

      {/* Green play triangle */}
      <polygon
        points={`
          ${S * 0.20},${S * 0.22}
          ${S * 0.62},${S * 0.50}
          ${S * 0.20},${S * 0.78}
        `}
        fill={green}
      />

      {/* Green vertical bar */}
      <rect
        x={S * 0.65}
        y={S * 0.22}
        width={S * 0.14}
        height={S * 0.56}
        rx={S * 0.03}
        fill={green}
      />

      {/* algoleap text */}
      <text
        x={S + gap}
        y={S * 0.755}
        fontFamily="'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        fill={green}
        letterSpacing="-0.8"
      >
        algoleap
      </text>
    </svg>
  );
}
