import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlantHealthLog, DerivedMetrics, StressCause, IrrigationStatus } from '@/types/plantHealth';

const OPTIMAL_TEMP = 25;
const OPTIMAL_HUMIDITY = 60;
const SOIL_MOISTURE_MAX = 1023;
const BIO_SIGNAL_BASELINE = 500;

export function usePlantHealth() {
  const [latestData, setLatestData] = useState<PlantHealthLog | null>(null);
  const [historicalData, setHistoricalData] = useState<PlantHealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestData = useCallback(async () => {
    const { data, error } = await supabase
      .from('plant_health_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      setLatestData(data as PlantHealthLog);
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('plant_health_logs')
      .select('*')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    setHistoricalData((data || []) as PlantHealthLog[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLatestData();
    fetchHistoricalData();

    // Set up realtime subscription
    const channel = supabase
      .channel('plant-health-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plant_health_logs',
        },
        (payload) => {
          const newData = payload.new as PlantHealthLog;
          setLatestData(newData);
          setHistoricalData(prev => [...prev, newData].slice(-288)); // Keep last 24h (5-min intervals)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLatestData, fetchHistoricalData]);

  const calculateMetrics = useCallback((): DerivedMetrics | null => {
    if (!latestData) return null;

    const temp = latestData.temperature ?? 25;
    const humidity = latestData.humidity ?? 60;
    const soilMoisture = latestData.soil_moisture ?? 512;
    const vibration = latestData.vibration ?? 0;
    const bioSignal = latestData.bio_signal ?? BIO_SIGNAL_BASELINE;

    // Level 1: Direct calculations
    const heatStressIndex = temp + (0.1 * humidity);
    const soilDryness = 100 - (soilMoisture / SOIL_MOISTURE_MAX * 100);
    const vibrationStressScore = vibration * 1.5;
    const bioSignalStability = Math.max(0, 100 - Math.abs(bioSignal - BIO_SIGNAL_BASELINE) * 0.2);

    // Level 2: Composite metrics
    const normalizedTemp = Math.min(100, Math.abs(temp - OPTIMAL_TEMP) * 4);
    const normalizedHumidity = Math.min(100, Math.abs(humidity - OPTIMAL_HUMIDITY) * 2);
    const normalizedSoil = soilDryness;
    const normalizedVibration = Math.min(100, vibrationStressScore);
    const normalizedBio = 100 - bioSignalStability;

    const plantStressIndex = (
      normalizedTemp * 0.25 +
      normalizedHumidity * 0.15 +
      normalizedSoil * 0.3 +
      normalizedVibration * 0.15 +
      normalizedBio * 0.15
    );

    // Stress causes analysis
    const stressCauses: StressCause[] = [];
    if (heatStressIndex > 35) {
      stressCauses.push({
        type: 'Heat Stress',
        severity: heatStressIndex > 45 ? 'high' : 'medium',
        color: 'hsl(0, 84%, 60%)',
      });
    }
    if (soilDryness > 60) {
      stressCauses.push({
        type: 'Water Stress',
        severity: soilDryness > 80 ? 'high' : 'medium',
        color: 'hsl(38, 92%, 50%)',
      });
    }
    if (vibrationStressScore > 30) {
      stressCauses.push({
        type: 'Mechanical Stress',
        severity: vibrationStressScore > 60 ? 'high' : 'medium',
        color: 'hsl(259, 82%, 65%)',
      });
    }
    if (bioSignalStability < 50 && stressCauses.length === 0) {
      stressCauses.push({
        type: 'Disease Suspected',
        severity: bioSignalStability < 30 ? 'high' : 'medium',
        color: 'hsl(300, 70%, 50%)',
      });
    }

    const stressedSensors = [
      heatStressIndex > 35,
      soilDryness > 60,
      vibrationStressScore > 30,
      bioSignalStability < 50,
    ].filter(Boolean).length;

    const confidenceScore = (stressedSensors / 4) * 100;

    const suitabilityScore = Math.max(0, 100 - (Math.abs(temp - OPTIMAL_TEMP) * 3) - (Math.abs(humidity - OPTIMAL_HUMIDITY) * 2));

    // Level 3: Time-based
    const stressDuration = latestData.stress_type ? calculateStressDuration() : '0h 0m';

    const recoveryRate = calculateRecoveryRate();

    // Level 4: Predictive
    const diseaseRisk = Math.min(100, (100 - bioSignalStability) * 1.5);

    let irrigationRecommendation: IrrigationStatus = 'optimal';
    if (soilMoisture < 200 && temp > 30) {
      irrigationRecommendation = 'immediate';
    } else if (soilMoisture < 400) {
      irrigationRecommendation = 'water_soon';
    }

    return {
      heatStressIndex,
      soilDryness,
      vibrationStressScore,
      bioSignalStability,
      plantStressIndex,
      stressCauses,
      confidenceScore,
      suitabilityScore,
      stressDuration,
      recoveryRate,
      diseaseRisk,
      irrigationRecommendation,
    };
  }, [latestData]);

  const calculateStressDuration = (): string => {
    if (historicalData.length === 0) return '0h 0m';
    
    const stressStart = historicalData.findIndex(d => d.stress_type);
    if (stressStart === -1) return '0h 0m';

    const startTime = new Date(historicalData[stressStart].created_at).getTime();
    const now = Date.now();
    const duration = now - startTime;
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const calculateRecoveryRate = (): number => {
    if (historicalData.length < 2) return 0;

    const recent = historicalData.slice(-6);
    if (recent.length < 2) return 0;

    const firstPSI = calculateSinglePSI(recent[0]);
    const lastPSI = calculateSinglePSI(recent[recent.length - 1]);

    return Math.round((firstPSI - lastPSI) / (recent.length * 5 / 60)); // per hour
  };

  const calculateSinglePSI = (data: PlantHealthLog): number => {
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
  };

  const derivedMetrics = calculateMetrics();

  return {
    latestData,
    historicalData,
    derivedMetrics,
    loading,
    error,
    refetch: () => {
      fetchLatestData();
      fetchHistoricalData();
    },
  };
}
