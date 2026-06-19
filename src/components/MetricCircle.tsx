import React, { useEffect, useState } from 'react';

interface MetricCircleProps {
  value: number; // 0 to 10
  max: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export default function MetricCircle({
  value,
  max,
  label,
  size = 110,
  strokeWidth = 10,
}: MetricCircleProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Keep score clamped between 0 and max
    const clampedVal = Math.min(Math.max(value, 0), max);
    const progress = clampedVal / max;
    const strokeOffset = circumference - progress * circumference;
    // Small timeout to trigger CSS draw animation
    const timer = setTimeout(() => {
      setOffset(strokeOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, max, circumference]);

  // Color selection based on rating level
  const getColorClasses = (val: number) => {
    if (val >= 8) return { stroke: 'url(#grad-success)', glow: 'shadow-emerald-500/10', text: 'text-emerald-400' };
    if (val >= 5) return { stroke: 'url(#grad-warning)', glow: 'shadow-amber-500/10', text: 'text-amber-400' };
    return { stroke: 'url(#grad-danger)', glow: 'shadow-rose-500/10', text: 'text-rose-400' };
  };

  const colors = getColorClasses(value);

  return (
    <div className="flex flex-col items-center">
      <div 
        size-id={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className={`relative flex items-center justify-center rounded-full bg-slate-900/40 p-2 shadow-inner border border-white/5`}
        style={{ width: size + 16, height: size + 16 }}
      >
        {/* SVG circular drawing */}
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            {/* Emerald/Teal gradient */}
            <linearGradient id="grad-success" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            {/* Amber/Orange gradient */}
            <linearGradient id="grad-warning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            {/* Rose/Red gradient */}
            <linearGradient id="grad-danger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Active progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner core display text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-mono text-2xl font-bold tracking-tight ${colors.text}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            / {max}
          </span>
        </div>
      </div>
      
      <span className="mt-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}
