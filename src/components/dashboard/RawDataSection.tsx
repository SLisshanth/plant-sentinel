import { PlantHealthLog } from '@/types/plantHealth';
import { MetricCard } from './MetricCard';
import { TemperatureBar } from './TemperatureBar';
import { HumidityDroplets } from './HumidityDroplets';
import { SoilMoistureGauge } from './SoilMoistureGauge';
import { VibrationIndicator } from './VibrationIndicator';
import { Waveform } from './Waveform';
import { MiniGauge } from './MiniGauge';
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
          <div key={i} className="glass-card p-5 h-40 shimmer" />
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

  const getBioStatus = (bio: number) => {
    const baseline = 500;
    const deviation = Math.abs(bio - baseline);
    if (deviation > 200) return 'critical';
    if (deviation > 100) return 'warning';
    return 'healthy';
  };

  const temperature = data.temperature ?? 0;
  const humidity = data.humidity ?? 0;
  const soilMoisture = data.soil_moisture ?? 0;
  const vibration = data.vibration ?? 0;
  const bioSignal = data.bio_signal ?? 0;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Raw Sensor Data
        <span className="ml-2 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-medium">
          Real-time Telemetry
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 - Primary Environmental Sensors */}
        <div className="glass-card hover-lift p-5 fade-in-up delay-1">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${getTempStatus(temperature) === 'healthy' ? 'text-success' : getTempStatus(temperature) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              <Thermometer />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Live</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className={`metric-value font-mono ${getTempStatus(temperature) === 'healthy' ? 'text-success' : getTempStatus(temperature) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {temperature.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground mb-1 font-medium">°C</span>
          </div>
          <p className="metric-label mb-3">Ambient Temperature</p>
          <TemperatureBar value={temperature} min={0} max={50} />
        </div>

        <div className="glass-card hover-lift p-5 fade-in-up delay-2">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${getHumidityStatus(humidity) === 'healthy' ? 'text-info' : getHumidityStatus(humidity) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              <Droplets />
            </div>
            <HumidityDroplets value={humidity} />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="metric-value font-mono text-info">
              {humidity.toFixed(0)}
            </span>
            <span className="text-lg text-muted-foreground mb-1 font-medium">%</span>
          </div>
          <p className="metric-label mb-3">Relative Humidity</p>
          <div className="progress-bar">
            <div className="progress-fill bg-gradient-to-r from-info to-primary" style={{ width: `${humidity}%` }} />
          </div>
        </div>

        <div className="glass-card hover-lift p-5 fade-in-up delay-3">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${getSoilStatus(soilMoisture) === 'healthy' ? 'text-success' : getSoilStatus(soilMoisture) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              <Sprout />
            </div>
            <MiniGauge 
              value={soilMoisture} 
              max={1023} 
              size={40} 
              status={getSoilStatus(soilMoisture) as 'healthy' | 'warning' | 'critical'}
            />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className={`metric-value font-mono ${getSoilStatus(soilMoisture) === 'healthy' ? 'text-success' : getSoilStatus(soilMoisture) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {soilMoisture}
            </span>
            <span className="text-xs text-muted-foreground mb-2 font-medium">/1023</span>
          </div>
          <p className="metric-label mb-2">Soil Moisture Level</p>
          <SoilMoistureGauge value={soilMoisture} />
        </div>

        <div className="glass-card hover-lift p-5 fade-in-up delay-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${getVibrationStatus(vibration) === 'healthy' ? 'text-success' : getVibrationStatus(vibration) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              <Activity />
            </div>
            <VibrationIndicator value={vibration} />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className={`metric-value font-mono ${getVibrationStatus(vibration) === 'healthy' ? 'text-success' : getVibrationStatus(vibration) === 'warning' ? 'text-warning' : 'text-destructive'}`}>
              {vibration}
            </span>
            <span className="text-lg text-muted-foreground mb-1 font-medium">units</span>
          </div>
          <p className="metric-label">Vibration Intensity</p>
          <div className="mt-3 text-xs text-muted-foreground">
            {vibration > 60 ? '⚠️ Mechanical stress detected' : vibration > 30 ? '⚡ Moderate disturbance' : '✓ Stable environment'}
          </div>
        </div>

        {/* Row 2 - Secondary Sensors */}
        <div className="glass-card hover-lift p-5 fade-in-up delay-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl text-accent">
              <Zap />
            </div>
            <Waveform 
              value={bioSignal} 
              min={0} 
              max={1000} 
              status={getBioStatus(bioSignal) as 'healthy' | 'warning' | 'critical'}
            />
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="metric-value font-mono text-accent">
              {bioSignal.toFixed(0)}
            </span>
            <span className="text-lg text-muted-foreground mb-1 font-medium">μV</span>
          </div>
          <p className="metric-label">Plant Electrical Activity</p>
          <div className="mt-2 text-xs text-muted-foreground">
            Baseline: 500μV | Deviation: {Math.abs(bioSignal - 500).toFixed(0)}μV
          </div>
        </div>

        <MetricCard
          icon={<TreePine />}
          value={data.plant_id || 'Unknown'}
          label="Plant Identifier"
          status="healthy"
          delay={6}
          visualIndicator={
            <div className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">
              Active
            </div>
          }
        />

        <div className="glass-card hover-lift p-5 fade-in-up delay-7">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-2xl ${data.stress_type ? 'text-warning' : 'text-success'}`}>
              <AlertTriangle />
            </div>
            {data.stress_type && (
              <div className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full font-medium animate-pulse">
                Active
              </div>
            )}
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className={`text-2xl font-bold font-mono ${data.stress_type ? 'text-warning' : 'text-success'}`}>
              {data.stress_type || 'None'}
            </span>
          </div>
          <p className="metric-label">Current Stress Type</p>
          {data.stress_type && (
            <div className="mt-3 px-2 py-1 bg-warning/10 rounded-lg border border-warning/20">
              <span className="text-xs text-warning">⚠️ Intervention may be required</span>
            </div>
          )}
        </div>

        <div className="glass-card hover-lift p-5 fade-in-up delay-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl text-muted-foreground">
              <Clock />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-spin-slow" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Synced</span>
            </div>
          </div>
          <div className="flex items-end gap-2 mb-1">
            <span className="metric-value font-mono text-foreground">
              {formatLastUpdated()}
            </span>
            <span className="text-lg text-muted-foreground mb-1 font-medium">ago</span>
          </div>
          <p className="metric-label">Last Sensor Reading</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {new Date(data.created_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </section>
  );
}
