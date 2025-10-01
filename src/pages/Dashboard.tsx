import { GiantSemaphore } from "@/components/GiantSemaphore";
import { EssentialMetrics } from "@/components/EssentialMetrics";

export default function Dashboard() {
  // Mock data - in production this would come from API/state
  const portfolioData = {
    status: 'healthy' as const, // 'healthy' | 'attention' | 'urgent'
    value: 250000,
    targetAllocation: 85,
  };

  const metricsData = {
    yearlyReturn: 15.2,
    cdiComparison: 'Acima do CDI',
    monthlyDividends: 1250,
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] animate-fade-in">
      {/* Giant Semaphore - 80% */}
      <div className="flex-[0.8]">
        <GiantSemaphore
          status={portfolioData.status}
          value={portfolioData.value}
          targetAllocation={portfolioData.targetAllocation}
        />
      </div>

      {/* Essential Metrics - 20% */}
      <div className="flex-[0.2] flex items-center justify-center pb-8">
        <EssentialMetrics
          yearlyReturn={metricsData.yearlyReturn}
          cdiComparison={metricsData.cdiComparison}
          monthlyDividends={metricsData.monthlyDividends}
        />
      </div>
    </div>
  );
}
