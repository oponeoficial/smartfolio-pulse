import { DominantSemaphore } from "@/components/DominantSemaphore";
import { EssentialMetrics } from "@/components/EssentialMetrics";
import { DistributionChart } from "@/components/DistributionChart";

export default function Dashboard() {
  // Mock data - in production this would come from API/state
  const portfolioData = {
    status: 'healthy' as const, // 'healthy' | 'attention' | 'urgent'
    value: 250000,
    targetAllocation: 50,
    goalValue: 500000,
  };

  const metricsData = {
    return1M: 2.5,
    return12M: 15.2,
    cdiComparison: 3.2,
    monthlyDividends: 1250,
  };

  const distributionData = [
    { name: 'Ações', value: 50, color: 'hsl(207 90% 54%)' },
    { name: 'FIIs', value: 30, color: 'hsl(142 91% 43%)' },
    { name: 'RF', value: 20, color: 'hsl(45 80% 52%)' },
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] animate-fade-in gap-6 py-6">
      {/* Dominant Semaphore - 40% */}
      <div className="flex-[0.4] flex items-center justify-center">
        <DominantSemaphore
          status={portfolioData.status}
          value={portfolioData.value}
          targetAllocation={portfolioData.targetAllocation}
          goalValue={portfolioData.goalValue}
        />
      </div>

      {/* Essential Metrics - 30% */}
      <div className="flex-[0.3] flex items-center justify-center px-4">
        <EssentialMetrics
          return1M={metricsData.return1M}
          return12M={metricsData.return12M}
          cdiComparison={metricsData.cdiComparison}
          monthlyDividends={metricsData.monthlyDividends}
        />
      </div>

      {/* Distribution Chart - 30% */}
      <div className="flex-[0.3] flex items-center justify-center pb-8">
        <DistributionChart data={distributionData} />
      </div>
    </div>
  );
}
