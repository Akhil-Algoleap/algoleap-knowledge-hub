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

  // Symbol fill: light lime-green/cream matching reference image
  const symbolColor = '#C5E09A';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${h}`}
      height={h}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Green rounded square - more rounded corners like image 1 */}
      <rect
        x="0" y="0"
        width={iconSize} height={iconSize}
        rx={iconSize * 0.24} ry={iconSize * 0.24}
        fill="#3A7D44"
      />

      {/* Large play triangle - fills most of the icon like image 1 */}
      <polygon
        points={`
          ${iconSize * 0.15},${iconSize * 0.18}
          ${iconSize * 0.63},${iconSize * 0.50}
          ${iconSize * 0.15},${iconSize * 0.82}
        `}
        fill={symbolColor}
      />

      {/* Thick vertical bar on the right */}
      <rect
        x={iconSize * 0.66}
        y={iconSize * 0.18}
        width={iconSize * 0.16}
        height={iconSize * 0.64}
        rx={iconSize * 0.03}
        fill={symbolColor}
      />

      {/* algoleap text */}
      <text
        x={iconSize + gap}
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
