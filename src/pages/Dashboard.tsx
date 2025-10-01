import { DominantSemaphore } from "@/components/DominantSemaphore";
import { EssentialMetrics } from "@/components/EssentialMetrics";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function Dashboard() {
  // Get real portfolio data
  const portfolioData = usePortfolioData();

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] animate-fade-in py-6">
      {/* Dominant Semaphore - 40% (with increased top margin) */}
      <div className="flex-[0.4] flex items-center justify-center mt-12 md:mt-16">
        <DominantSemaphore
          status={portfolioData.status}
          value={portfolioData.totalValue}
          targetAllocation={portfolioData.goalProgress}
          goalValue={portfolioData.goalValue}
        />
      </div>

      {/* Essential Metrics - 60% (4 cards with 15% more spacing) */}
      <div className="flex-[0.6] flex items-center justify-center px-4 mt-12 md:mt-16">
        <EssentialMetrics
          return1M={portfolioData.performance.oneMonth}
          return12M={portfolioData.performance.twelveMonth}
          cdiComparison={portfolioData.performance.cdiComparison}
          monthlyDividends={portfolioData.dividends.currentMonth}
          stocksAllocation={portfolioData.allocation.stocks}
          reitsAllocation={portfolioData.allocation.reits}
          fixedIncomeAllocation={portfolioData.allocation.fixedIncome}
        />
      </div>
    </div>
  );
}
