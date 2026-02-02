import { StressCause } from '@/types/plantHealth';
import { cn } from '@/lib/utils';

interface StressCauseBadgesProps {
  causes: StressCause[];
  className?: string;
}

export function StressCauseBadges({ causes, className }: StressCauseBadgesProps) {
  if (causes.length === 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-success/20 text-success border border-success/30">
          ✓ No Stress Detected
        </span>
      </div>
    );
  }

  const severityIcons = {
    low: '●',
    medium: '●●',
    high: '●●●',
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {causes.map((cause, index) => (
        <span
          key={index}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
            cause.severity === 'high' 
              ? 'bg-destructive/20 text-destructive border border-destructive/30'
              : cause.severity === 'medium'
              ? 'bg-warning/20 text-warning border border-warning/30'
              : 'bg-info/20 text-info border border-info/30'
          )}
        >
          <span className="text-xs opacity-70">{severityIcons[cause.severity]}</span>
          {cause.type}
        </span>
      ))}
    </div>
  );
}
