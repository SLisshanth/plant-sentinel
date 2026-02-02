import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface WaveformProps {
  value: number;
  min?: number;
  max?: number;
  status?: 'healthy' | 'warning' | 'critical' | 'info';
  className?: string;
  animate?: boolean;
}

export function Waveform({
  value,
  min = 0,
  max = 1000,
  status = 'info',
  className,
  animate = true,
}: WaveformProps) {
  const [offset, setOffset] = useState(0);
  
  // Normalize value to 0-1 range
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const amplitude = 8 + normalized * 12; // 8-20 amplitude based on value
  const frequency = 0.15 + normalized * 0.1; // Slightly faster at higher values
  
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setOffset(prev => (prev + 2) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, [animate]);

  const statusColors = {
    healthy: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    info: '#22d3ee',
  };

  const generatePath = () => {
    const points: string[] = [];
    const width = 80;
    const height = 32;
    const centerY = height / 2;
    
    for (let x = 0; x <= width; x += 2) {
      const y = centerY + Math.sin((x + offset) * frequency) * amplitude * (0.5 + Math.random() * 0.3);
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={cn("relative", className)}>
      <svg width="80" height="32" className="overflow-visible">
        {/* Glow effect */}
        <defs>
          <filter id={`glow-${status}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Waveform line */}
        <path
          d={generatePath()}
          fill="none"
          stroke={statusColors[status]}
          strokeWidth="2"
          strokeLinecap="round"
          filter={`url(#glow-${status})`}
          className="transition-all duration-100"
        />
        {/* Center line */}
        <line
          x1="0"
          y1="16"
          x2="80"
          y2="16"
          stroke={statusColors[status]}
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
