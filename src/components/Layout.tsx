import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Wallet, Radar, TrendingUp, Menu, ChevronLeft, LogOut, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Mercado", path: "/market" },
  { icon: Radar, label: "Radar de Oportunidades", path: "/ai" },
  { icon: Wallet, label: "Carteira", path: "/portfolio" },
];

export function Layout() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Mock user data - substituir por dados reais
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"Investidor","email":"investidor@email.com","avatar":""}');

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

        {/* Footer - User Profile */}
        <div className="p-4 border-t border-gold/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full hover:bg-gold/10 transition-all",
                  isCollapsed ? "p-2" : "p-3"
                )}
              >
                <div className={cn(
                  "flex items-center gap-3",
                  isCollapsed && "justify-center"
                )}>
                  <Avatar className="w-8 h-8 border-2 border-gold/30">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-blue-gold text-white text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-gold/20">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gold/20" />
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer hover:bg-gold/10">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red/10 text-red">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 p-8 transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
