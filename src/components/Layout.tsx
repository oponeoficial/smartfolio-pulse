import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, BookOpen, Wallet, Radar, TrendingUp, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Mercado", path: "/market" },
  { icon: Radar, label: "Radar de Oportunidades", path: "/ai" },
  { icon: Wallet, label: "Carteira", path: "/portfolio" },
  { icon: BookOpen, label: "Educação", path: "/education" },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Até breve!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen glass-card border-r border-border/50 flex flex-col z-10 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-4 border-b border-gold/20 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm gradient-gold">SmartFolio</h2>
                  <p className="text-[10px] text-muted-foreground">Premium AI Trading</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 mx-auto">
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Button>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <TooltipProvider>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-secondary/50",
                        isActive && "bg-gradient-primary text-white shadow-lg shadow-primary/20",
                        !isActive && "text-muted-foreground hover:text-foreground",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive && "text-white")} />
                      {!isCollapsed && (
                        <span className={cn("font-medium text-sm", isActive && "text-white")}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        <div className="p-4 border-t border-border/50">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={cn(
                    "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    isCollapsed && "justify-center"
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  {!isCollapsed && <span className="text-sm">Sair</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>Sair</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}