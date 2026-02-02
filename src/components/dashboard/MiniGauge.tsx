import { cn } from "@/lib/utils";

interface MiniGaugeProps {
  value: number;
  max?: number;
  size?: number;
  status?: 'healthy' | 'warning' | 'critical' | 'info';
  className?: string;
}

export function MiniGauge({
  value,
  max = 100,
  size = 48,
  status = 'info',
  className,
}: MiniGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const statusColors = {
    healthy: 'stroke-success',
    warning: 'stroke-warning',
    critical: 'stroke-destructive',
    info: 'stroke-primary',
  };

  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-secondary"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(statusColors[status], "transition-all duration-500")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground font-mono">
        {Math.round(percentage)}
      </span>
    </div>
  );
}
