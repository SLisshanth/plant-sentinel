import { IrrigationStatus } from '@/types/plantHealth';
import { cn } from '@/lib/utils';
import { Droplets, CheckCircle, AlertTriangle } from 'lucide-react';

interface IrrigationButtonProps {
  status: IrrigationStatus;
  className?: string;
}

export function IrrigationButton({ status, className }: IrrigationButtonProps) {
  const config = {
    optimal: {
      icon: CheckCircle,
      text: 'Optimal',
      description: 'No irrigation needed',
      className: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
    },
    water_soon: {
      icon: Droplets,
      text: 'Water Soon',
      description: 'Consider irrigation today',
      className: 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30',
    },
    immediate: {
      icon: AlertTriangle,
      text: 'IMMEDIATE IRRIGATION',
      description: 'Critical water needed!',
      className: 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 animate-pulse',
    },
  };

  const { icon: Icon, text, description, className: statusClassName } = config[status];

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200',
        statusClassName,
        className
      )}
    >
      <Icon className="w-8 h-8" />
      <div className="text-left">
        <div className="font-semibold">{text}</div>
        <div className="text-xs opacity-70">{description}</div>
      </div>
    </button>
  );
}
