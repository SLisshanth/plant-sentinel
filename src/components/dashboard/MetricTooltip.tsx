import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricTooltipProps {
  title: string;
  description: string;
  formula?: string;
  useCase: string;
  children: React.ReactNode;
  className?: string;
}

export function MetricTooltip({
  title,
  description,
  formula,
  useCase,
  children,
  className,
}: MetricTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("cursor-help", className)}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-4 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">{title}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
            {formula && (
              <div className="bg-secondary/50 rounded-md px-2 py-1 mt-2">
                <code className="text-xs font-mono text-primary">{formula}</code>
              </div>
            )}
            <div className="pt-2 border-t border-border/50">
              <span className="text-xs text-accent font-medium">Why it matters: </span>
              <span className="text-xs text-muted-foreground">{useCase}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Metric tooltip content definitions
export const METRIC_TOOLTIPS = {
  heatStressIndex: {
    title: "Heat Stress Index (HSI)",
    description: "Combines temperature and humidity to measure thermal stress on plants. High values indicate the plant is experiencing heat-related stress.",
    formula: "HSI = Temperature + (0.1 × Humidity)",
    useCase: "Early warning for heat damage. Plants under heat stress may wilt, have reduced growth, or suffer cellular damage.",
  },
  soilDryness: {
    title: "Soil Dryness Percentage",
    description: "Inverse of soil moisture - shows how dry the soil is. Higher values mean drier soil requiring attention.",
    formula: "Dryness = 100 - (Moisture / 1023 × 100)",
    useCase: "Irrigation timing optimization. Prevents both overwatering and underwatering.",
  },
  vibrationStress: {
    title: "Vibration Stress Score",
    description: "Measures mechanical disturbance to the plant. High vibration can damage roots and stress the plant.",
    formula: "Score = Vibration × 1.5",
    useCase: "Detecting wind damage, construction nearby, or physical disturbance to the plant.",
  },
  bioSignalStability: {
    title: "Bio-Signal Stability",
    description: "Measures how stable the plant's electrical activity is compared to baseline. Unstable signals often indicate internal stress.",
    formula: "Stability = 100 - |Signal - Baseline| × 0.2",
    useCase: "Early disease detection. Bio-signals change before visible symptoms appear.",
  },
  plantStressIndex: {
    title: "Plant Stress Index (PSI)",
    description: "The primary health indicator. Weighted combination of all stress factors to give an overall plant health score.",
    formula: "PSI = (Temp×0.25) + (Humidity×0.15) + (Soil×0.3) + (Vibration×0.15) + (Bio×0.15)",
    useCase: "Single metric for quick health assessment. Low PSI = healthy plant, High PSI = needs attention.",
  },
  stressCauses: {
    title: "Stress Cause Breakdown",
    description: "Analyzes which sensors are triggering stress alerts. Helps identify the root cause of plant distress.",
    formula: "Threshold-based analysis of each sensor",
    useCase: "Targeted intervention - knowing what's wrong helps apply the right fix.",
  },
  confidenceScore: {
    title: "Stress Confidence Score",
    description: "How certain we are about the stress diagnosis. Higher scores mean more sensors are confirming the stress.",
    formula: "Confidence = (Stressed Sensors / Total Sensors) × 100",
    useCase: "Reduces false alarms. Low confidence means isolated readings, high confidence means consistent stress signals.",
  },
  suitabilityScore: {
    title: "Environmental Suitability",
    description: "How well the current environment matches optimal growing conditions for the plant.",
    formula: "Score = 100 - |Temp-25|×3 - |Humidity-60|×2",
    useCase: "Environment optimization. Helps adjust growing conditions for maximum plant health.",
  },
  stressDuration: {
    title: "Stress Duration",
    description: "How long the plant has been experiencing stress. Prolonged stress leads to permanent damage.",
    formula: "Duration = Current Time - Stress Start Time",
    useCase: "Urgency assessment. Short stress may resolve naturally, prolonged stress needs intervention.",
  },
  recoveryRate: {
    title: "Recovery Rate",
    description: "Trend of PSI over time. Positive values mean improving health, negative means worsening.",
    formula: "Rate = ΔPSI / Δtime (per hour)",
    useCase: "Evaluating if interventions are working. Positive rate = plant is recovering.",
  },
  diseaseRisk: {
    title: "Disease Risk Score",
    description: "Predictive metric based on bio-signal instability. High risk indicates possible infection or disease.",
    formula: "Risk = (100 - Bio Stability) × 1.5",
    useCase: "Preventive care. High risk warrants closer inspection and potential treatment.",
  },
  irrigationRecommendation: {
    title: "Irrigation Recommendation",
    description: "Smart watering advice based on soil moisture and temperature conditions.",
    formula: "IF soil < 200 AND temp > 30 → IMMEDIATE, IF soil < 400 → SOON, ELSE → OPTIMAL",
    useCase: "Automated watering guidance. Prevents both drought stress and root rot from overwatering.",
  },
} as const;
