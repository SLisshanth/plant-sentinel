import { DerivedMetrics } from '@/types/plantHealth';
import { MetricCard } from './MetricCard';
import { CircularGauge } from './CircularGauge';
import { StressCauseBadges } from './StressCauseBadges';
import { IrrigationButton } from './IrrigationButton';
import { 
  Flame, 
  Droplet, 
  Vibrate, 
  HeartPulse, 
  Brain, 
  Target, 
  Smile, 
  Timer, 
  TrendingUp, 
  Bug, 
  Droplets 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntelligentMetricsSectionProps {
  metrics: DerivedMetrics | null;
}

export function IntelligentMetricsSection({ metrics }: IntelligentMetricsSectionProps) {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="glass-card p-5 h-40 shimmer" />
        ))}
      </div>
    );
  }

  const getHeatStatus = (hsi: number): 'healthy' | 'warning' | 'critical' => {
    if (hsi > 45) return 'critical';
    if (hsi > 35) return 'warning';
    return 'healthy';
  };

  const getSoilDrynessStatus = (dryness: number): 'healthy' | 'warning' | 'critical' => {
    if (dryness > 80) return 'critical';
    if (dryness > 60) return 'warning';
    return 'healthy';
  };

  const getVibrationStatus = (score: number): 'healthy' | 'warning' | 'critical' => {
    if (score > 60) return 'critical';
    if (score > 30) return 'warning';
    return 'healthy';
  };

  const getBioStabilityStatus = (stability: number): 'healthy' | 'warning' | 'critical' => {
    if (stability < 30) return 'critical';
    if (stability < 50) return 'warning';
    return 'healthy';
  };

  const getPSIStatus = (psi: number): 'healthy' | 'warning' | 'critical' => {
    if (psi > 70) return 'critical';
    if (psi > 30) return 'warning';
    return 'healthy';
  };

  const getDiseaseRiskStatus = (risk: number): 'healthy' | 'warning' | 'critical' => {
    if (risk > 50) return 'critical';
    if (risk > 20) return 'warning';
    return 'healthy';
  };

  const getSmiley = (score: number) => {
    if (score > 70) return '😊';
    if (score > 40) return '😐';
    return '😰';
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <Brain className="w-5 h-5 text-accent" />
        Intelligent Metrics
      </h2>

      {/* Level 1: Direct Calculations */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Level 1 — Direct Calculations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Flame />}
            value={metrics.heatStressIndex.toFixed(1)}
            label="Heat Stress Index"
            status={getHeatStatus(metrics.heatStressIndex)}
            delay={1}
          />
          <MetricCard
            icon={<Droplet />}
            value={metrics.soilDryness.toFixed(0)}
            unit="%"
            label="Soil Dryness"
            status={getSoilDrynessStatus(metrics.soilDryness)}
            progress={metrics.soilDryness}
            delay={2}
          />
          <MetricCard
            icon={<Vibrate />}
            value={metrics.vibrationStressScore.toFixed(0)}
            label="Vibration Stress Score"
            status={getVibrationStatus(metrics.vibrationStressScore)}
            delay={3}
          />
          <MetricCard
            icon={<HeartPulse />}
            value={metrics.bioSignalStability.toFixed(0)}
            unit="%"
            label="Bio-Signal Stability"
            status={getBioStabilityStatus(metrics.bioSignalStability)}
            delay={4}
          />
        </div>
      </div>

      {/* Level 2: Composite Intelligence */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Level 2 — Composite Intelligence
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Hero PSI Card */}
          <div className="glass-card-glow p-6 lg:col-span-1 flex flex-col items-center justify-center fade-in-up delay-1">
            <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider text-center">
              Plant Stress Index
            </h4>
            <CircularGauge
              value={metrics.plantStressIndex}
              max={100}
              size={160}
              strokeWidth={12}
              label="PSI"
              status={getPSIStatus(metrics.plantStressIndex)}
            />
            <span className={cn(
              'mt-3 text-sm font-semibold',
              getPSIStatus(metrics.plantStressIndex) === 'healthy' ? 'text-success' :
              getPSIStatus(metrics.plantStressIndex) === 'warning' ? 'text-warning' : 'text-destructive'
            )}>
              {metrics.plantStressIndex < 30 ? 'Healthy' : metrics.plantStressIndex < 70 ? 'Mild Stress' : 'Severe Stress'}
            </span>
          </div>

          {/* Stress Cause Breakdown */}
          <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Stress Causes
            </h4>
            <StressCauseBadges causes={metrics.stressCauses} className="mt-2" />
          </div>

          {/* Confidence & Suitability */}
          <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-3">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              Stress Confidence
            </h4>
            <div className="text-3xl font-bold text-primary mb-2">
              {metrics.confidenceScore.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              How certain we are about detected stress
            </p>
            <div className="progress-bar mt-3">
              <div
                className="progress-fill"
                style={{ width: `${metrics.confidenceScore}%` }}
              />
            </div>
          </div>

          <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
              <Smile className="w-4 h-4" />
              Environmental Suitability
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getSmiley(metrics.suitabilityScore)}</span>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {metrics.suitabilityScore.toFixed(0)}/100
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.suitabilityScore > 70 ? 'Excellent conditions' : 
                   metrics.suitabilityScore > 40 ? 'Acceptable conditions' : 'Poor conditions'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level 3 & 4: Time-Based & Predictive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 fade-in-up delay-5">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Stress Duration
          </h4>
          <div className="text-3xl font-bold text-warning">
            {metrics.stressDuration}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active stress time
          </p>
        </div>

        <div className="glass-card p-5 fade-in-up delay-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recovery Rate
          </h4>
          <div className={cn(
            'text-3xl font-bold flex items-center gap-2',
            metrics.recoveryRate > 0 ? 'text-success' : metrics.recoveryRate < 0 ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {metrics.recoveryRate > 0 ? '↑' : metrics.recoveryRate < 0 ? '↓' : '→'}
            {Math.abs(metrics.recoveryRate).toFixed(1)}%/hr
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.recoveryRate > 0 ? 'Recovering' : metrics.recoveryRate < 0 ? 'Worsening' : 'Stable'}
          </p>
        </div>

        <div className="glass-card p-5 fade-in-up delay-7">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Disease Risk
          </h4>
          <div className={cn(
            'text-3xl font-bold',
            getDiseaseRiskStatus(metrics.diseaseRisk) === 'healthy' ? 'text-success' :
            getDiseaseRiskStatus(metrics.diseaseRisk) === 'warning' ? 'text-warning' : 'text-destructive'
          )}>
            {metrics.diseaseRisk.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.diseaseRisk < 20 ? 'Low Risk' : metrics.diseaseRisk < 50 ? 'Medium Risk' : 'High Risk'}
          </p>
        </div>

        <div className="glass-card p-5 fade-in-up delay-8">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Irrigation
          </h4>
          <IrrigationButton status={metrics.irrigationRecommendation} />
        </div>
      </div>
    </section>
  );
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
