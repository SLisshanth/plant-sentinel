export interface PlantHealthLog {
  id: number;
  created_at: string;
  plant_id: string | null;
  bio_signal: number | null;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  vibration: number | null;
  stress_type: string | null;
}

export interface DerivedMetrics {
  heatStressIndex: number;
  soilDryness: number;
  vibrationStressScore: number;
  bioSignalStability: number;
  plantStressIndex: number;
  stressCauses: StressCause[];
  confidenceScore: number;
  suitabilityScore: number;
  stressDuration: string;
  recoveryRate: number;
  diseaseRisk: number;
  irrigationRecommendation: IrrigationStatus;
}

export interface StressCause {
  type: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
}

export type IrrigationStatus = 'optimal' | 'water_soon' | 'immediate';

export type StatusLevel = 'healthy' | 'warning' | 'critical';

export function getStatusLevel(value: number, thresholds: { warning: number; critical: number }): StatusLevel {
  if (value >= thresholds.critical) return 'critical';
  if (value >= thresholds.warning) return 'warning';
  return 'healthy';
}

export function getStatusColor(status: StatusLevel): string {
  switch (status) {
    case 'healthy': return 'text-success';
    case 'warning': return 'text-warning';
    case 'critical': return 'text-destructive';
  }
}
