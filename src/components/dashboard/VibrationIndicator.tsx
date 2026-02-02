import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface VibrationIndicatorProps {
  value: number;
  max?: number;
  className?: string;
}

export function VibrationIndicator({ value, max = 100, className }: VibrationIndicatorProps) {
  const [shake, setShake] = useState(false);
  const intensity = Math.min(1, value / max);
  
  useEffect(() => {
    if (value > 20) {
      const interval = setInterval(() => {
        setShake(true);
        setTimeout(() => setShake(false), 100);
      }, 500 - intensity * 300);
      
      return () => clearInterval(interval);
    }
  }, [value, intensity]);

  const barCount = 5;
  
  return (
    <div className={cn("flex items-end gap-0.5 h-6", className, shake && "animate-pulse")}>
      {Array.from({ length: barCount }).map((_, i) => {
        const barActive = (i + 1) / barCount <= intensity;
        const barHeight = 8 + i * 4;
        
        return (
          <div
            key={i}
            className={cn(
              "w-1.5 rounded-full transition-all duration-300",
              barActive 
                ? intensity > 0.6 
                  ? "bg-destructive" 
                  : intensity > 0.3 
                    ? "bg-warning" 
                    : "bg-success"
                : "bg-secondary"
            )}
            style={{
              height: `${barHeight}px`,
              transform: shake && barActive ? `translateX(${Math.random() * 2 - 1}px)` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
