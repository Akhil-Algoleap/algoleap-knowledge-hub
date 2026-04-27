'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const fontSize = iconSize * 0.8;
  const gap = iconSize * 0.35;
  const textWidth = fontSize * 4.6;
  const totalWidth = iconSize + gap + textWidth;
  const h = iconSize;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${h}`}
      height={h}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* === ICON: Green rounded square === */}
      <rect
        x="0" y="0"
        width={iconSize} height={iconSize}
        rx={iconSize * 0.20} ry={iconSize * 0.20}
        fill="#3A7D44"
      />

      {/* === ICON: Cream skip-forward symbol === */}
      {/* Left "D" shape: a filled rounded-right shape */}
      {/* Triangle pointing right (play) */}
      <polygon
        points={`
          ${iconSize * 0.22},${iconSize * 0.24}
          ${iconSize * 0.60},${iconSize * 0.50}
          ${iconSize * 0.22},${iconSize * 0.76}
        `}
        fill="#D8E8C8"
      />
      {/* Vertical bar on the right of the triangle */}
      <rect
        x={iconSize * 0.62}
        y={iconSize * 0.24}
        width={iconSize * 0.115}
        height={iconSize * 0.52}
        rx={iconSize * 0.025}
        fill="#D8E8C8"
      />

      {/* === TEXT: algoleap === */}
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
