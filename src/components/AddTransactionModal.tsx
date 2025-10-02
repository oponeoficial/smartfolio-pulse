import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
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

const availableAssets = [
  { symbol: "PETR4", name: "Petrobras PN" },
  { symbol: "VALE3", name: "Vale ON" },
  { symbol: "ITUB4", name: "Itaú Unibanco PN" },
  { symbol: "BBAS3", name: "Banco do Brasil ON" },
  { symbol: "HGLG11", name: "CSHG Logística FII" },
  { symbol: "MXRF11", name: "Maxi Renda FII" },
  { symbol: "AAPL34", name: "Apple BDR" },
  { symbol: "MSFT34", name: "Microsoft BDR" },
];

export function AddTransactionModal({ open, onOpenChange, currency, portfolioId }: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>(new Date());
  const [asset, setAsset] = useState<string>("");
  const [operation, setOperation] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brokerage, setBrokerage] = useState<string>("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "US$" : "€";

  // Calculate totals
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

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!asset) newErrors.asset = "Selecione um ativo";
    if (!quantity || parseFloat(quantity) <= 0) newErrors.quantity = "Quantidade deve ser maior que 0";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Preço deve ser maior que 0";
    if (date > new Date()) newErrors.date = "Data não pode ser futura";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        // TODO: Replace with actual API call when backend is ready
        const transactionData = {
          portfolioId,
          date,
          asset,
          operation,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          brokerage: parseFloat(brokerage),
          total,
        };
        
        console.log("Salvando transação:", transactionData);
        
        // Invalidate all portfolio-related queries to trigger refetch
        await queryClient.invalidateQueries({ queryKey: ['portfolio-orders', portfolioId] });
        await queryClient.invalidateQueries({ queryKey: ['portfolio-positions', portfolioId] });
        await queryClient.invalidateQueries({ queryKey: ['portfolio-kpis', portfolioId] });
        
        toast({
          title: "Transação adicionada",
          description: "A transação foi registrada com sucesso!",
        });
        
        onOpenChange(false);
        resetForm();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar transação. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setAsset("");
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
          {/* Data da Operação */}
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

          {/* Ativo */}
          <div className="space-y-2">
            <Label htmlFor="asset">Ativo</Label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger id="asset" className={errors.asset ? "border-danger" : ""}>
                <SelectValue placeholder="Selecione o ativo" />
              </SelectTrigger>
              <SelectContent>
                {availableAssets.map((a) => (
                  <SelectItem key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset && <p className="text-sm text-danger">{errors.asset}</p>}
          </div>

          {/* Operação */}
          <div className="space-y-2">
            <Label>Operação</Label>
            <RadioGroup value={operation} onValueChange={(val) => setOperation(val as "BUY" | "SELL")}>
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

          {/* Quantidade */}
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
            />
            {errors.quantity && <p className="text-sm text-danger">{errors.quantity}</p>}
          </div>

          {/* Preço */}
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
            />
            {errors.price && <p className="text-sm text-danger">{errors.price}</p>}
          </div>

          {/* Corretagem */}
          <div className="space-y-2">
            <Label htmlFor="brokerage">Corretagem ({currencySymbol}) - Opcional</Label>
            <Input
              id="brokerage"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={brokerage}
              onChange={(e) => setBrokerage(e.target.value)}
            />
          </div>

          {/* Total */}
          {quantity && price && (
            <div className="glass-card p-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total {operation === "BUY" ? "Compra" : "Venda"}:
                </span>
                <span className="text-2xl font-display font-bold gradient-gold">
                  {currencySymbol} {total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ({parseFloat(quantity) || 0} × {currencySymbol} {parseFloat(price).toFixed(2)}) 
                {operation === "BUY" ? " + " : " - "}
                {currencySymbol} {parseFloat(brokerage).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[#00C853] hover:bg-[#00B248]">
            Adicionar Transação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}