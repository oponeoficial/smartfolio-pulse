import { JourneyHero } from "@/components/JourneyHero";
import { ProgressCastle } from "@/components/ProgressCastle";
import { PerformanceStory } from "@/components/PerformanceStory";
import { IncomeGarden } from "@/components/IncomeGarden";
import { StrategyBalance } from "@/components/StrategyBalance";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export default function Dashboard() {
  // Get real portfolio data
  const portfolioData = usePortfolioData();

  // Map status from portfolio data to component status types
  const heroStatus: "growing" | "stable" | "alert" = 
    portfolioData.status === "healthy" ? "growing" : 
    portfolioData.status === "attention" ? "stable" : "alert";

  const strategyStatus: "balanced" | "rebalance" | "alert" =
    portfolioData.status === "healthy" ? "balanced" :
    portfolioData.status === "attention" ? "rebalance" : "alert";

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 animate-fade-in max-w-7xl">
      {/* Section 1: Journey Hero - The Hero's Overview */}
      <JourneyHero
        currentValue={portfolioData.totalValue}
        goalValue={portfolioData.goalValue}
        status={heroStatus}
      />

      {/* Section 2: Progress Castle - The Goal */}
      <ProgressCastle
        currentValue={portfolioData.totalValue}
        goalValue={portfolioData.goalValue}
      />

      {/* Section 3: Performance Story - The Battle */}
      <PerformanceStory
        return1M={portfolioData.performance.oneMonth}
        return12M={portfolioData.performance.twelveMonth}
        cdiComparison={portfolioData.performance.cdiComparison}
      />

      {/* Section 4: Income Garden - The Harvest */}
      <IncomeGarden
        monthlyDividends={portfolioData.dividends.currentMonth}
      />

      {/* Section 5: Strategy Balance - The Equilibrium */}
      <StrategyBalance
        status={strategyStatus}
        stocksAllocation={portfolioData.allocation.stocks}
        reitsAllocation={portfolioData.allocation.reits}
        fixedIncomeAllocation={portfolioData.allocation.fixedIncome}
      />
    </div>
  );
}
