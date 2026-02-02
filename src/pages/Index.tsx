import { usePlantHealth } from '@/hooks/usePlantHealth';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RawDataSection } from '@/components/dashboard/RawDataSection';
import { IntelligentMetricsSection } from '@/components/dashboard/IntelligentMetricsSection';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const { latestData, historicalData, derivedMetrics, loading, error, refetch } = usePlantHealth();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl custom-scrollbar">
        <DashboardHeader 
          onRefresh={refetch} 
          lastUpdated={latestData?.created_at ?? null} 
        />

        {loading && !latestData ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card p-5 h-32 shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <RawDataSection data={latestData} />
            <IntelligentMetricsSection metrics={derivedMetrics} />
            <ChartsSection data={historicalData} />
          </>
        )}

        {/* Empty state for no data */}
        {!loading && !latestData && !error && (
          <div className="glass-card p-12 text-center mt-8">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Plant Data Yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect your plant sensors to start monitoring. The dashboard will automatically update as data flows in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
