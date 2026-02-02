import { cn } from "@/lib/utils";

interface TemperatureBarProps {
  value: number;
  min?: number;
  max?: number;
  className?: string;
}

export function TemperatureBar({
  value,
  min = 0,
  max = 50,
  className,
}: TemperatureBarProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Gradient from blue (cold) to green (optimal) to red (hot)
  const getGradientColor = () => {
    if (value < 15) return 'from-blue-500 to-blue-400';
    if (value < 22) return 'from-blue-400 to-success';
    if (value < 28) return 'from-success to-success';
    if (value < 35) return 'from-success to-warning';
    return 'from-warning to-destructive';
  };

  return (
    <div className={cn("relative h-2 w-full rounded-full bg-secondary overflow-hidden", className)}>
      {/* Temperature scale markers */}
      <div className="absolute inset-0 flex justify-between px-1">
        <div className="w-px h-full bg-border/30" />
        <div className="w-px h-full bg-border/30" />
        <div className="w-px h-full bg-border/30" />
        <div className="w-px h-full bg-border/30" />
        <div className="w-px h-full bg-border/30" />
      </div>
      {/* Temperature fill */}
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
          getGradientColor()
        )}
        style={{ width: `${percentage}%` }}
      />
      {/* Current value marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background shadow-lg transition-all duration-500"
        style={{ left: `calc(${percentage}% - 6px)` }}
      />
    </div>
  );
}
