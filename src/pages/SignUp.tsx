import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpf;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return phone;
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "");
    
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;
    
    return true;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    else if (fullName.trim().length < 3) newErrors.fullName = "Nome deve ter no mínimo 3 caracteres";
    
    if (!email) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email inválido";
    
    if (!cpf) newErrors.cpf = "CPF é obrigatório";
    else if (!validateCPF(cpf)) newErrors.cpf = "CPF inválido";
    
    if (!phone) newErrors.phone = "Telefone é obrigatório";
    else {
      const phoneNumbers = phone.replace(/\D/g, "");
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.phone = "Telefone inválido";
      }
    }
    
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const cpfNumbers = cpf.replace(/\D/g, "");
      const phoneNumbers = phone.replace(/\D/g, "");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName.trim(),
            email: email,
            cpf: cpfNumbers,
            phone: phoneNumbers,
          });
        
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para o login",
      });
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = "Tente novamente mais tarde";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Este email já está cadastrado";
      } else if (error.message?.includes('duplicate key')) {
        errorMessage = "CPF ou email já cadastrado";
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-2">
            Smart<span className="gradient-gold">Folio</span>
          </h1>
          <p className="text-muted-foreground">Crie sua conta</p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="João Silva"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyPress={handleKeyPress}
              className={errors.fullName ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.fullName && <p className="text-sm text-danger">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className={errors.email ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCPFChange}
              onKeyPress={handleKeyPress}
              maxLength={14}
              className={errors.cpf ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.cpf && <p className="text-sm text-danger">{errors.cpf}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="text"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              maxLength={15}
              className={errors.phone ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.phone && <p className="text-sm text-danger">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className={errors.password ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.password && <p className="text-sm text-danger">{errors.password}</p>}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}