import { cn } from "@/lib/utils";

interface HumidityDropletProps {
  value: number;
  className?: string;
}

export function HumidityDroplets({ value, className }: HumidityDropletProps) {
  // Show 1-5 droplets based on humidity level
  const dropletCount = Math.max(1, Math.min(5, Math.ceil(value / 20)));
  
  const getDropletOpacity = (index: number) => {
    const baseOpacity = value / 100;
    return Math.max(0.2, baseOpacity - (4 - index) * 0.15);
  };

  return (
    <div className={cn("flex items-end gap-0.5 h-6", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-2 rounded-full bg-info transition-all duration-500",
            i < dropletCount ? "animate-pulse" : ""
          )}
          style={{
            height: `${12 + (i * 3)}px`,
            opacity: i < dropletCount ? getDropletOpacity(i) : 0.1,
          }}
        />
      ))}
    </div>
  );
}
