import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Wallet, Bot, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Mercado", path: "/market" },
  { icon: Bot, label: "IA Trading", path: "/ai" },
  { icon: Wallet, label: "Carteira", path: "/portfolio" },
  { icon: BookOpen, label: "Educação", path: "/education" },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-border/50 flex flex-col z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gold/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-blue-gold flex items-center justify-center shadow-gold">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gradient-gold">TradeAI</h1>
              <p className="text-xs text-gold-light">Premium AI Trading</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                  isActive
                    ? "bg-gold/10 text-gold border border-gold/30 shadow-gold"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-gold")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gold/20">
          <div className="glass-card p-3 text-xs text-center border-gold/30">
            <p className="text-gold-light">v1.0.0 - Premium</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
