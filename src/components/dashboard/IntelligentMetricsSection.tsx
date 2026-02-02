import { DerivedMetrics } from '@/types/plantHealth';
import { MetricCard } from './MetricCard';
import { CircularGauge } from './CircularGauge';
import { StressCauseBadges } from './StressCauseBadges';
import { IrrigationButton } from './IrrigationButton';
import { MetricTooltip, METRIC_TOOLTIPS } from './MetricTooltip';
import { MiniGauge } from './MiniGauge';
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
  Droplets,
  AlertTriangle
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

  const statusColors = {
    healthy: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
        <Brain className="w-5 h-5 text-accent" />
        Intelligent Metrics
        <span className="ml-2 text-xs text-muted-foreground bg-accent/20 px-2 py-0.5 rounded-full font-medium">
          AI-Powered Analysis
        </span>
      </h2>

      {/* Level 1: Direct Calculations */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
          Direct Calculations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTooltip {...METRIC_TOOLTIPS.heatStressIndex}>
            <div className="glass-card hover-lift p-5 fade-in-up delay-1">
              <div className="flex items-center justify-between mb-3">
                <Flame className={cn("w-6 h-6", statusColors[getHeatStatus(metrics.heatStressIndex)])} />
                <MiniGauge value={metrics.heatStressIndex} max={60} status={getHeatStatus(metrics.heatStressIndex)} />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className={cn("metric-value font-mono", statusColors[getHeatStatus(metrics.heatStressIndex)])}>
                  {metrics.heatStressIndex.toFixed(1)}
                </span>
              </div>
              <p className="metric-label">Heat Stress Index</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {getHeatStatus(metrics.heatStressIndex) === 'healthy' ? '✓ Normal range' : 
                 getHeatStatus(metrics.heatStressIndex) === 'warning' ? '⚡ Elevated heat stress' : '🔥 Critical heat exposure'}
              </div>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.soilDryness}>
            <div className="glass-card hover-lift p-5 fade-in-up delay-2">
              <div className="flex items-center justify-between mb-3">
                <Droplet className={cn("w-6 h-6", statusColors[getSoilDrynessStatus(metrics.soilDryness)])} />
                <MiniGauge value={metrics.soilDryness} max={100} status={getSoilDrynessStatus(metrics.soilDryness)} />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className={cn("metric-value font-mono", statusColors[getSoilDrynessStatus(metrics.soilDryness)])}>
                  {metrics.soilDryness.toFixed(0)}
                </span>
                <span className="text-lg text-muted-foreground mb-1">%</span>
              </div>
              <p className="metric-label">Soil Dryness</p>
              <div className="progress-bar mt-2">
                <div className="progress-fill" style={{ width: `${metrics.soilDryness}%` }} />
              </div>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.vibrationStress}>
            <div className="glass-card hover-lift p-5 fade-in-up delay-3">
              <div className="flex items-center justify-between mb-3">
                <Vibrate className={cn("w-6 h-6", statusColors[getVibrationStatus(metrics.vibrationStressScore)])} />
                <MiniGauge value={metrics.vibrationStressScore} max={100} status={getVibrationStatus(metrics.vibrationStressScore)} />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className={cn("metric-value font-mono", statusColors[getVibrationStatus(metrics.vibrationStressScore)])}>
                  {metrics.vibrationStressScore.toFixed(0)}
                </span>
              </div>
              <p className="metric-label">Vibration Stress Score</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {getVibrationStatus(metrics.vibrationStressScore) === 'healthy' ? '✓ Stable' : 
                 getVibrationStatus(metrics.vibrationStressScore) === 'warning' ? '⚡ Disturbance' : '🚨 Mechanical stress'}
              </div>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.bioSignalStability}>
            <div className="glass-card hover-lift p-5 fade-in-up delay-4">
              <div className="flex items-center justify-between mb-3">
                <HeartPulse className={cn("w-6 h-6", statusColors[getBioStabilityStatus(metrics.bioSignalStability)])} />
                <MiniGauge value={metrics.bioSignalStability} max={100} status={getBioStabilityStatus(metrics.bioSignalStability)} />
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className={cn("metric-value font-mono", statusColors[getBioStabilityStatus(metrics.bioSignalStability)])}>
                  {metrics.bioSignalStability.toFixed(0)}
                </span>
                <span className="text-lg text-muted-foreground mb-1">%</span>
              </div>
              <p className="metric-label">Bio-Signal Stability</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {getBioStabilityStatus(metrics.bioSignalStability) === 'healthy' ? '💚 Stable signals' : 
                 getBioStabilityStatus(metrics.bioSignalStability) === 'warning' ? '💛 Unstable signals' : '❤️ Critical instability'}
              </div>
            </div>
          </MetricTooltip>
        </div>
      </div>

      {/* Level 2: Composite Intelligence */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</span>
          Composite Intelligence
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Hero PSI Card */}
          <MetricTooltip {...METRIC_TOOLTIPS.plantStressIndex}>
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
                'mt-3 text-sm font-semibold px-3 py-1 rounded-full',
                getPSIStatus(metrics.plantStressIndex) === 'healthy' ? 'text-success bg-success/20' :
                getPSIStatus(metrics.plantStressIndex) === 'warning' ? 'text-warning bg-warning/20' : 'text-destructive bg-destructive/20'
              )}>
                {metrics.plantStressIndex < 30 ? '🌱 Healthy' : metrics.plantStressIndex < 70 ? '⚡ Mild Stress' : '🚨 Severe Stress'}
              </span>
            </div>
          </MetricTooltip>

          {/* Stress Cause Breakdown */}
          <MetricTooltip {...METRIC_TOOLTIPS.stressCauses}>
            <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Stress Causes
              </h4>
              <StressCauseBadges causes={metrics.stressCauses} className="mt-2" />
              {metrics.stressCauses.length === 0 && (
                <div className="text-success text-sm flex items-center gap-2 mt-2">
                  <span>✓</span> No stress factors detected
                </div>
              )}
            </div>
          </MetricTooltip>

          {/* Confidence Score */}
          <MetricTooltip {...METRIC_TOOLTIPS.confidenceScore}>
            <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4" />
                Stress Confidence
              </h4>
              <div className="flex items-center gap-3">
                <MiniGauge value={metrics.confidenceScore} max={100} size={56} status="info" />
                <div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {metrics.confidenceScore.toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Diagnosis certainty
                  </p>
                </div>
              </div>
              <div className="progress-bar mt-3">
                <div className="progress-fill" style={{ width: `${metrics.confidenceScore}%` }} />
              </div>
            </div>
          </MetricTooltip>

          {/* Environmental Suitability */}
          <MetricTooltip {...METRIC_TOOLTIPS.suitabilityScore}>
            <div className="glass-card p-5 lg:col-span-1 fade-in-up delay-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Smile className="w-4 h-4" />
                Environmental Suitability
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getSmiley(metrics.suitabilityScore)}</span>
                <div>
                  <div className="text-2xl font-bold text-foreground font-mono">
                    {metrics.suitabilityScore.toFixed(0)}<span className="text-lg text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.suitabilityScore > 70 ? '🌟 Excellent conditions' : 
                     metrics.suitabilityScore > 40 ? '👍 Acceptable conditions' : '⚠️ Poor conditions'}
                  </p>
                </div>
              </div>
            </div>
          </MetricTooltip>
        </div>
      </div>

      {/* Level 3 & 4: Time-Based & Predictive */}
      <div className="mb-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-warning/20 text-warning flex items-center justify-center text-xs font-bold">3</span>
          Time-Based & Predictive
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTooltip {...METRIC_TOOLTIPS.stressDuration}>
            <div className="glass-card p-5 fade-in-up delay-5">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Stress Duration
              </h4>
              <div className="text-3xl font-bold text-warning font-mono">
                {metrics.stressDuration}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active stress time
              </p>
              <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.recoveryRate}>
            <div className="glass-card p-5 fade-in-up delay-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recovery Rate
              </h4>
              <div className={cn(
                'text-3xl font-bold flex items-center gap-2 font-mono',
                metrics.recoveryRate > 0 ? 'text-success' : metrics.recoveryRate < 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                <span className="text-2xl">{metrics.recoveryRate > 0 ? '↑' : metrics.recoveryRate < 0 ? '↓' : '→'}</span>
                {Math.abs(metrics.recoveryRate).toFixed(1)}%<span className="text-lg text-muted-foreground">/hr</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.recoveryRate > 0 ? '🌱 Recovering' : metrics.recoveryRate < 0 ? '📉 Worsening' : '➡️ Stable'}
              </p>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.diseaseRisk}>
            <div className="glass-card p-5 fade-in-up delay-7">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Disease Risk
              </h4>
              <div className="flex items-center gap-3">
                <MiniGauge 
                  value={metrics.diseaseRisk} 
                  max={100} 
                  size={56} 
                  status={getDiseaseRiskStatus(metrics.diseaseRisk)} 
                />
                <div>
                  <div className={cn('text-2xl font-bold font-mono', statusColors[getDiseaseRiskStatus(metrics.diseaseRisk)])}>
                    {metrics.diseaseRisk.toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.diseaseRisk < 20 ? '✓ Low Risk' : metrics.diseaseRisk < 50 ? '⚠️ Medium Risk' : '🚨 High Risk'}
                  </p>
                </div>
              </div>
            </div>
          </MetricTooltip>

          <MetricTooltip {...METRIC_TOOLTIPS.irrigationRecommendation}>
            <div className="glass-card p-5 fade-in-up delay-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Irrigation
              </h4>
              <IrrigationButton status={metrics.irrigationRecommendation} />
            </div>
          </MetricTooltip>
        </div>
      </div>
    </section>
  );
}
