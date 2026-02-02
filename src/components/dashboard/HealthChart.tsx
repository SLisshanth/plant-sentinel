import { useMemo } from 'react';
import { Line, Bar, Area, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { PlantHealthLog } from '@/types/plantHealth';
import { cn } from '@/lib/utils';

interface HealthChartProps {
  data: PlantHealthLog[];
  type: 'temperature-humidity' | 'soil-moisture' | 'vibration' | 'composite';
  className?: string;
}

export function HealthChart({ data, type, className }: HealthChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      time: new Date(d.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: d.temperature ?? 0,
      humidity: d.humidity ?? 0,
      soilMoisture: d.soil_moisture ?? 0,
      vibration: d.vibration ?? 0,
      bioSignal: d.bio_signal ?? 0,
      psi: calculatePSI(d),
      soilDryness: 100 - ((d.soil_moisture ?? 0) / 1023 * 100),
    }));
  }, [data]);

  const renderChart = () => {
    switch (type) {
      case 'temperature-humidity':
        return (
          <ComposedChart data={chartData}>
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              yAxisId="temp" 
              stroke="hsl(0, 84%, 60%)" 
              fontSize={10}
              tickLine={false}
              domain={[0, 50]}
            />
            <YAxis 
              yAxisId="humidity" 
              orientation="right" 
              stroke="hsl(217, 91%, 60%)" 
              fontSize={10}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 17%)',
                border: '1px solid hsl(217, 33%, 25%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine yAxisId="temp" y={35} stroke="hsl(38, 92%, 50%)" strokeDasharray="3 3" />
            <Line 
              yAxisId="temp" 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(0, 84%, 60%)" 
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
            />
            <Line 
              yAxisId="humidity" 
              type="monotone" 
              dataKey="humidity" 
              stroke="hsl(217, 91%, 60%)" 
              strokeWidth={2}
              dot={false}
              name="Humidity (%)"
            />
          </ComposedChart>
        );

      case 'soil-moisture':
        return (
          <ComposedChart data={chartData}>
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(160, 84%, 39%)" 
              fontSize={10}
              tickLine={false}
              domain={[0, 1023]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 17%)',
                border: '1px solid hsl(217, 33%, 25%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine y={300} stroke="hsl(38, 92%, 50%)" strokeDasharray="3 3" label="Irrigation Threshold" />
            <Area 
              type="monotone" 
              dataKey="soilMoisture" 
              fill="hsl(160, 84%, 39%)" 
              fillOpacity={0.3}
              stroke="hsl(160, 84%, 39%)" 
              strokeWidth={2}
              name="Soil Moisture"
            />
          </ComposedChart>
        );

      case 'vibration':
        return (
          <ComposedChart data={chartData}>
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(259, 82%, 65%)" 
              fontSize={10}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 17%)',
                border: '1px solid hsl(217, 33%, 25%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <ReferenceLine y={30} stroke="hsl(0, 84%, 60%)" strokeDasharray="3 3" label="Stress Level" />
            <Bar 
              dataKey="vibration" 
              fill="hsl(259, 82%, 65%)" 
              name="Vibration"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        );

      case 'composite':
        return (
          <ComposedChart data={chartData}>
            <XAxis 
              dataKey="time" 
              stroke="hsl(215, 20%, 65%)" 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(191, 91%, 57%)" 
              fontSize={10}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(217, 33%, 17%)',
                border: '1px solid hsl(217, 33%, 25%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="psi" 
              stroke="hsl(191, 91%, 57%)" 
              strokeWidth={3}
              dot={false}
              name="Plant Stress Index"
            />
            <Line 
              type="monotone" 
              dataKey="soilDryness" 
              stroke="hsl(38, 92%, 50%)" 
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              name="Soil Dryness %"
            />
          </ComposedChart>
        );
    }
  };

  const titles = {
    'temperature-humidity': 'Temperature & Humidity Trend',
    'soil-moisture': 'Soil Moisture Timeline',
    'vibration': 'Vibration Analysis',
    'composite': 'Plant Health Composite',
  };

  return (
    <div className={cn('glass-card p-5', className)}>
      <h3 className="text-lg font-semibold mb-4 text-foreground">{titles[type]}</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function calculatePSI(data: PlantHealthLog): number {
  const OPTIMAL_TEMP = 25;
  const OPTIMAL_HUMIDITY = 60;
  const SOIL_MOISTURE_MAX = 1023;
  const BIO_SIGNAL_BASELINE = 500;

  const temp = data.temperature ?? 25;
  const humidity = data.humidity ?? 60;
  const soilMoisture = data.soil_moisture ?? 512;
  const vibration = data.vibration ?? 0;
  const bioSignal = data.bio_signal ?? BIO_SIGNAL_BASELINE;

  const normalizedTemp = Math.min(100, Math.abs(temp - OPTIMAL_TEMP) * 4);
  const normalizedHumidity = Math.min(100, Math.abs(humidity - OPTIMAL_HUMIDITY) * 2);
  const normalizedSoil = 100 - (soilMoisture / SOIL_MOISTURE_MAX * 100);
  const normalizedVibration = Math.min(100, vibration * 1.5);
  const bioStability = Math.max(0, 100 - Math.abs(bioSignal - BIO_SIGNAL_BASELINE) * 0.2);
  const normalizedBio = 100 - bioStability;

  return (
    normalizedTemp * 0.25 +
    normalizedHumidity * 0.15 +
    normalizedSoil * 0.3 +
    normalizedVibration * 0.15 +
    normalizedBio * 0.15
  );
}
