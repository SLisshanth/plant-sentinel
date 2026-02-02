import { RefreshCw, Leaf } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  lastUpdated: string | null;
}

export function DashboardHeader({ onRefresh, lastUpdated }: DashboardHeaderProps) {
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const date = new Date(lastUpdated);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20 text-primary">
          <Leaf className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            Plant Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time plant monitoring & intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Last update: {formatLastUpdated()}</span>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
