import { cn } from '@/lib/utils';

interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  showValue?: boolean;
  className?: string;
}

export function CircularGauge({
  value,
  max = 100,
  size = 140,
  strokeWidth = 10,
  label,
  status,
  showValue = true,
  className,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  const statusColors = {
    healthy: { stroke: 'hsl(160, 84%, 39%)', glow: 'hsl(160, 84%, 39%)' },
    warning: { stroke: 'hsl(38, 92%, 50%)', glow: 'hsl(38, 92%, 50%)' },
    critical: { stroke: 'hsl(0, 84%, 60%)', glow: 'hsl(0, 84%, 60%)' },
  };

  const statusTextColors = {
    healthy: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(217, 33%, 22%)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={statusColors[status].stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="gauge-ring"
            style={{
              filter: `drop-shadow(0 0 8px ${statusColors[status].glow})`,
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', statusTextColors[status])}>
              {Math.round(value)}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
