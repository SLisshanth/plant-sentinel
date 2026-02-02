import { cn } from "@/lib/utils";

interface SoilMoistureGaugeProps {
  value: number;
  max?: number;
  className?: string;
}

export function SoilMoistureGauge({ value, max = 1023, className }: SoilMoistureGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getStatus = () => {
    if (percentage < 20) return { color: 'bg-destructive', label: 'Critical', textColor: 'text-destructive' };
    if (percentage < 40) return { color: 'bg-warning', label: 'Low', textColor: 'text-warning' };
    if (percentage < 70) return { color: 'bg-success', label: 'Good', textColor: 'text-success' };
    return { color: 'bg-info', label: 'Wet', textColor: 'text-info' };
  };

  const status = getStatus();

  return (
    <div className={cn("space-y-1", className)}>
      {/* Soil layers visualization */}
      <div className="relative h-8 w-full rounded-lg overflow-hidden bg-secondary">
        {/* Soil texture pattern */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-muted-foreground/20"
              style={{
                width: `${8 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 4}px`,
                left: `${i * 12 + Math.random() * 8}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
        {/* Moisture level */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out",
            status.color
          )}
          style={{ 
            height: `${percentage}%`,
            opacity: 0.6,
          }}
        />
        {/* Water droplets animation */}
        {percentage > 30 && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-info/60 animate-pulse"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + Math.random() * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className={cn("text-xs font-medium", status.textColor)}>{status.label}</span>
        <span className="text-xs text-muted-foreground font-mono">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
