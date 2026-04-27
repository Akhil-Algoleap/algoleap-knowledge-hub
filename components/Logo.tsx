'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const heights: Record<string, number> = { sm: 28, md: 36, lg: 48 };
  const h = heights[size];
  const iconSize = h;
  const fontSize = h * 0.78;
  const gap = h * 0.3;
  const totalWidth = iconSize + gap + fontSize * 4.8; // approx text width

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} ${h}`}
      height={h}
      width={totalWidth}
      className={cn('select-none flex-shrink-0', className)}
      aria-label="Algoleap"
    >
      {/* Green rounded square background */}
      <rect
        x="0"
        y="0"
        width={iconSize}
        height={iconSize}
        rx={iconSize * 0.22}
        ry={iconSize * 0.22}
        fill="#3A7D44"
      />

      {/* White play/next icon inside the square */}
      {/* Triangle (play button) */}
      <polygon
        points={`
          ${iconSize * 0.26},${iconSize * 0.27}
          ${iconSize * 0.62},${iconSize * 0.50}
          ${iconSize * 0.26},${iconSize * 0.73}
        `}
        fill="#EEF0DC"
      />
      {/* Vertical bar (skip line) */}
      <rect
        x={iconSize * 0.65}
        y={iconSize * 0.27}
        width={iconSize * 0.09}
        height={iconSize * 0.46}
        rx={iconSize * 0.02}
        fill="#EEF0DC"
      />

      {/* "algoleap" text */}
      <text
        x={iconSize + gap}
        y={h * 0.77}
        fontFamily="'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="700"
        fontSize={fontSize}
        fill="#3A7D44"
        letterSpacing="-0.5"
      >
        algoleap
      </text>
    </svg>
  );
}
