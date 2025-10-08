import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Wallet, Radar, TrendingUp, Menu, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Mercado", path: "/market" },
  { icon: Radar, label: "Radar de Oportunidades", path: "/ai" },
  { icon: Wallet, label: "Carteira", path: "/portfolio" },
  { icon: BookOpen, label: "Educação", path: "/education" },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen glass-card border-r border-border/50 flex flex-col z-10 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header with Logo and Toggle */}
        <div className="p-4 border-b border-gold/20 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-blue-gold flex items-center justify-center shadow-gold">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold gradient-gold">TradeAI</h1>
                  <p className="text-xs text-gold-light">Premium AI Trading</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-gold/10"
              >
                <ChevronLeft className="w-5 h-5 text-gold" />
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="w-10 h-10 rounded-xl bg-gradient-blue-gold flex items-center justify-center shadow-gold">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-gold/10"
              >
                <Menu className="w-5 h-5 text-gold" />
              </Button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 p-2 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const navButton = (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-lg transition-all group",
                    isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/30 shadow-gold"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-gold")} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      {navButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="glass-card">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navButton;
            })}
          </nav>
        </TooltipProvider>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gold/20">
            <div className="glass-card p-3 text-xs text-center border-gold/30">
              <p className="text-gold-light">v1.0.0 - Premium</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 p-8 transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
