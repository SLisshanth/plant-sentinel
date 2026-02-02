import { PlantHealthLog } from '@/types/plantHealth';
import { HealthChart } from './HealthChart';
import { LineChart } from 'lucide-react';

interface ChartsSectionProps {
  data: PlantHealthLog[];
}

export function ChartsSection({ data }: ChartsSectionProps) {
  if (data.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
          <LineChart className="w-5 h-5 text-info" />
          24-Hour Trends
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-[280px] shimmer" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <LineChart className="w-5 h-5 text-info" />
        24-Hour Trends
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthChart 
          data={data} 
          type="temperature-humidity" 
          className="fade-in-up delay-1" 
        />
        <HealthChart 
          data={data} 
          type="soil-moisture" 
          className="fade-in-up delay-2" 
        />
        <HealthChart 
          data={data} 
          type="vibration" 
          className="fade-in-up delay-3" 
        />
        <HealthChart 
          data={data} 
          type="composite" 
          className="fade-in-up delay-4" 
        />
      </div>
    </section>
  );
}
