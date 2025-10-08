// src/components/EditTransactionModal.tsx
import { useState, useEffect } from "react";
import { Calendar, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { brapiService } from "@/services/brapi.service";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  portfolio_id: string;
  asset_id: string;
  operation: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  brokerage: number;
  total: number;
  transaction_date: string;
  asset?: {
    symbol: string;
    name: string;
  };
}

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  currency: string;
}

export function EditTransactionModal({ 
  open, 
  onOpenChange, 
  transaction,
  currency 
}: EditTransactionModalProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>(new Date());
  const [operation, setOperation] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brokerage, setBrokerage] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "US$" : "€";

  // Preencher campos quando transaction mudar
  useEffect(() => {
    if (transaction) {
      setDate(parse(transaction.transaction_date, 'yyyy-MM-dd', new Date()));
      setOperation(transaction.operation);
      setQuantity(transaction.quantity.toString());
      setPrice(transaction.price.toString());
      setBrokerage(transaction.brokerage.toString());
    }
  }, [transaction]);

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

    if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = "Quantidade deve ser maior que 0";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Preço deve ser maior que 0";
    if (date > new Date()) newErrors.date = "Data não pode ser futura";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !transaction) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          operation,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          brokerage: parseFloat(brokerage),
          total,
          transaction_date: format(date, 'yyyy-MM-dd'),
        })
        .eq('id', transaction.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['positions', transaction.portfolio_id] });
      await queryClient.invalidateQueries({ queryKey: ['transactions', transaction.portfolio_id] });
      await queryClient.invalidateQueries({ queryKey: ['closed-positions', transaction.portfolio_id] });

      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso!",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-gold" />
            Editar Transação
          </DialogTitle>
          <DialogDescription>
            {transaction.asset?.symbol} - {transaction.asset?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Data da Transação</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-danger"
                  )}
                  disabled={loading}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-danger">{errors.date}</p>}
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
            {loading ? "Salvando..." : "Atualizar Transação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}