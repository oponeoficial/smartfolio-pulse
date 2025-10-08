import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAssets } from "@/hooks/useAssets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  portfolioId: string;
}

export function AddTransactionModal({ open, onOpenChange, currency, portfolioId }: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const { assets } = useAssets();
  const [date, setDate] = useState<Date>(new Date());
  const [assetId, setAssetId] = useState<string>("");
  const [operation, setOperation] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brokerage, setBrokerage] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "US$" : "€";

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    const brk = parseFloat(brokerage) || 0;

    if (operation === "BUY") {
      return (qty * prc) + brk;
    } else {
      return (qty * prc) - brk;
    }
  };

  const total = calculateTotal();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!assetId) newErrors.asset = "Selecione um ativo";
    if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = "Quantidade deve ser maior que 0";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Preço deve ser maior que 0";
    if (date > new Date()) newErrors.date = "Data não pode ser futura";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('transactions').insert({
        portfolio_id: portfolioId,
        asset_id: assetId,
        operation,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        brokerage: parseFloat(brokerage),
        total,
        transaction_date: format(date, 'yyyy-MM-dd'),
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['positions', portfolioId] });
      await queryClient.invalidateQueries({ queryKey: ['transactions', portfolioId] });
      await queryClient.invalidateQueries({ queryKey: ['closed-positions', portfolioId] });

      toast({
        title: "Transação adicionada",
        description: "A transação foi registrada com sucesso!",
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setAssetId("");
    setOperation("BUY");
    setQuantity("");
    setPrice("");
    setBrokerage("0");
    setErrors({});
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-gold">Adicionar Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova transação na sua carteira
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data da Operação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-danger">{errors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset">Ativo</Label>
            <Select value={assetId} onValueChange={setAssetId} disabled={loading}>
              <SelectTrigger id="asset" className={errors.asset ? "border-danger" : ""}>
                <SelectValue placeholder="Selecione o ativo" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.symbol} - {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset && <p className="text-sm text-danger">{errors.asset}</p>}
          </div>

          <div className="space-y-2">
            <Label>Operação</Label>
            <RadioGroup value={operation} onValueChange={(val) => setOperation(val as "BUY" | "SELL")} disabled={loading}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BUY" id="buy" />
                  <Label htmlFor="buy" className="cursor-pointer">Compra</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SELL" id="sell" />
                  <Label htmlFor="sell" className="cursor-pointer">Venda</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={errors.quantity ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.quantity && <p className="text-sm text-danger">{errors.quantity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço ({currencySymbol})</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={errors.price ? "border-danger" : ""}
              disabled={loading}
            />
            {errors.price && <p className="text-sm text-danger">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brokerage">Corretagem ({currencySymbol})</Label>
            <Input
              id="brokerage"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={brokerage}
              onChange={(e) => setBrokerage(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="glass-card p-4 bg-secondary/20">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total {operation === "BUY" ? "Investido" : "Recebido"}:</span>
              <span className="text-xl font-bold gradient-gold">
                {currencySymbol} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Adicionar Transação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}