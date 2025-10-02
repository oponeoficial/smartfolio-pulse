import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulação de login - substituir por integração real
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("user", JSON.stringify({ 
          name: "Investidor",
          email: email,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
        }));
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta à sua jornada financeira.",
        });
        navigate("/");
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-blue-gold flex items-center justify-center shadow-gold mx-auto">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold gradient-gold">TradeAI</h1>
            <p className="text-gold-light mt-2">Sua Jornada Financeira Começa Aqui</p>
          </div>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="glass-card p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-gold/20 focus:border-gold"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-gold/20 focus:border-gold"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-blue-gold hover:opacity-90 text-white font-semibold shadow-gold"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Primeira vez aqui?{" "}
            <button type="button" className="text-gold hover:underline">
              Criar conta
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Premium AI Trading Platform
        </p>
      </div>
    </div>
  );
}
