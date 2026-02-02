import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  unit?: string;
  status?: 'healthy' | 'warning' | 'critical' | 'info';
  isLive?: boolean;
  trend?: 'up' | 'down' | 'stable';
  progress?: number;
  className?: string;
  delay?: number;
}

export function MetricCard({
  icon,
  value,
  label,
  unit,
  status = 'info',
  isLive,
  trend,
  progress,
  className,
  delay = 0,
}: MetricCardProps) {
  const statusColors = {
    healthy: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
    info: 'text-info',
  };

  const statusBgColors = {
    healthy: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
    critical: 'from-destructive/20 to-destructive/5',
    info: 'from-info/20 to-info/5',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <div
      className={cn(
        'glass-card hover-lift p-5 fade-in-up',
        `delay-${delay}`,
        className
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-30', statusBgColors[status])} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn('text-2xl', statusColors[status])}>
            {icon}
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Live</span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-2 mb-1">
          <span className={cn('metric-value', statusColors[status])}>
            {value}
          </span>
          {unit && (
            <span className="text-lg text-muted-foreground mb-1">{unit}</span>
          )}
          {trend && (
            <span className={cn(
              'text-lg mb-1',
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {trendIcons[trend]}
            </span>
          )}
        </div>

        <p className="metric-label">{label}</p>

        {progress !== undefined && (
          <div className="progress-bar mt-3">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
