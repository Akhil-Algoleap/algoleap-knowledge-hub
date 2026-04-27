'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fontSize = iconSize * 0.80;
  const gap = iconSize * 0.35;
  const textWidth = fontSize * 4.6;
  const totalWidth = iconSize + gap + textWidth;
  const h = iconSize;
  const S = iconSize; // shorthand

  // Light lime-green matching the reference image icon exactly
  const sym = '#A8D870';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${h}`}
      height={h}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Very rounded green square — matches reference */}
      <rect
        x="0" y="0"
        width={S} height={S}
        rx={S * 0.27} ry={S * 0.27}
        fill="#3D8B46"
      />

      {/* Large play triangle */}
      <polygon
        points={`
          ${S * 0.17},${S * 0.19}
          ${S * 0.61},${S * 0.50}
          ${S * 0.17},${S * 0.81}
        `}
        fill={sym}
      />

      {/* Bold vertical bar */}
      <rect
        x={S * 0.64}
        y={S * 0.19}
        width={S * 0.18}
        height={S * 0.62}
        rx={S * 0.04}
        fill={sym}
      />

      {/* algoleap text */}
      <text
        x={S + gap}
        y={h * 0.755}
        fontFamily="'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        fill="#3A7D44"
        letterSpacing="-0.8"
      >
        algoleap
      </text>
    </svg>
  );
}
