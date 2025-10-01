import { DominantSemaphore } from "@/components/DominantSemaphore";
import { EssentialMetrics } from "@/components/EssentialMetrics";
import { DistributionChart } from "@/components/DistributionChart";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function Dashboard() {
  // Get real portfolio data
  const portfolioData = usePortfolioData();

  const distributionData = [
    { name: 'Ações', value: portfolioData.allocation.stocks, color: 'hsl(207 90% 54%)' },
    { name: 'FIIs', value: portfolioData.allocation.reits, color: 'hsl(142 91% 43%)' },
    { name: 'RF', value: portfolioData.allocation.fixedIncome, color: 'hsl(45 80% 52%)' },
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] animate-fade-in gap-6 py-6">
      {/* Dominant Semaphore - 40% (with increased top margin) */}
      <div className="flex-[0.4] flex items-center justify-center mt-12 md:mt-16">
        <DominantSemaphore
          status={portfolioData.status}
          value={portfolioData.totalValue}
          targetAllocation={portfolioData.goalProgress}
          goalValue={portfolioData.goalValue}
        />
      </div>

      {/* Essential Metrics - 30% (4 cards) */}
      <div className="flex-[0.3] flex items-center justify-center px-4">
        <EssentialMetrics
          return1M={portfolioData.performance.oneMonth}
          return12M={portfolioData.performance.twelveMonth}
          cdiComparison={portfolioData.performance.cdiComparison}
          monthlyDividends={portfolioData.dividends.currentMonth}
          stocksAllocation={portfolioData.allocation.stocks}
        />
      </div>

      {/* Distribution Chart - 30% */}
      <div className="flex-[0.3] flex items-center justify-center pb-8">
        <DistributionChart data={distributionData} />
      </div>
    </div>
  );
}
