import { PlantHealthLog } from '@/types/plantHealth';
import { MetricCard } from './MetricCard';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  Activity, 
  Zap, 
  TreePine, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

interface RawDataSectionProps {
  data: PlantHealthLog | null;
}

export function RawDataSection({ data }: RawDataSectionProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card p-5 h-32 shimmer" />
        ))}
      </div>
    );
  }

  const formatLastUpdated = () => {
    const date = new Date(data.created_at);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  };

  const getTempStatus = (temp: number) => {
    if (temp > 40 || temp < 10) return 'critical';
    if (temp > 32 || temp < 15) return 'warning';
    return 'healthy';
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 90 || humidity < 20) return 'critical';
    if (humidity > 80 || humidity < 35) return 'warning';
    return 'healthy';
  };

  const getSoilStatus = (moisture: number) => {
    if (moisture < 200) return 'critical';
    if (moisture < 400) return 'warning';
    return 'healthy';
  };

  const getVibrationStatus = (vibration: number) => {
    if (vibration > 60) return 'critical';
    if (vibration > 30) return 'warning';
    return 'healthy';
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Raw Sensor Data
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <MetricCard
          icon={<Thermometer />}
          value={(data.temperature ?? 0).toFixed(1)}
          unit="°C"
          label="Ambient Temperature"
          status={getTempStatus(data.temperature ?? 25)}
          isLive
          delay={1}
        />
        <MetricCard
          icon={<Droplets />}
          value={(data.humidity ?? 0).toFixed(0)}
          unit="%"
          label="Relative Humidity"
          status={getHumidityStatus(data.humidity ?? 60)}
          isLive
          delay={2}
        />
        <MetricCard
          icon={<Sprout />}
          value={data.soil_moisture ?? 0}
          label="Soil Moisture Level"
          status={getSoilStatus(data.soil_moisture ?? 512)}
          progress={(data.soil_moisture ?? 0) / 1023 * 100}
          isLive
          delay={3}
        />
        <MetricCard
          icon={<Activity />}
          value={data.vibration ?? 0}
          unit="units"
          label="Vibration Intensity"
          status={getVibrationStatus(data.vibration ?? 0)}
          delay={4}
        />

        {/* Row 2 */}
        <MetricCard
          icon={<Zap />}
          value={(data.bio_signal ?? 0).toFixed(0)}
          unit="μV"
          label="Plant Electrical Activity"
          status="info"
          delay={5}
        />
        <MetricCard
          icon={<TreePine />}
          value={data.plant_id || 'Unknown'}
          label="Plant Identifier"
          status="healthy"
          delay={6}
        />
        <MetricCard
          icon={<AlertTriangle />}
          value={data.stress_type || 'None'}
          label="Current Stress"
          status={data.stress_type ? 'warning' : 'healthy'}
          delay={7}
        />
        <MetricCard
          icon={<Clock />}
          value={formatLastUpdated()}
          unit="ago"
          label="Last Sensor Reading"
          status="info"
          delay={8}
        />
      </div>
    </section>
  );
}
