// src/components/AddTransactionModal.tsx
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
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
  
  // Buscar ativos da aba Market (top 100 ações com cache de 24h)
  const { data: marketStocks = [], isLoading: loadingStocks } = useQuery({
    queryKey: ['market-stocks-for-transaction'],
    queryFn: async () => {
      const stocks = await brapiService.getTopStocks(100);
      console.log(`✅ ${stocks.length} ações carregadas do Market para transações`);
      return stocks;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24h (mesma do Market)
  });

  const [date, setDate] = useState<Date>(new Date());
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [operation, setOperation] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [brokerage, setBrokerage] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = currency === "BRL" ? "R$" : currency === "USD" ? "US$" : "€";

  // Auto-preencher preço quando selecionar ativo
  useEffect(() => {
    if (selectedSymbol && marketStocks.length > 0) {
      const stock = marketStocks.find(s => s.symbol === selectedSymbol);
      if (stock && !price) {
        setPrice(stock.price.toFixed(2));
      }
    }
  }, [selectedSymbol, marketStocks]);

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

    if (!selectedSymbol) newErrors.asset = "Selecione um ativo";
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
    // 🔍 DEBUG: Log antes de inserir
    console.log('🔍 DEBUG TRANSACTION INSERT - BEFORE:', {
      portfolioId,
      selectedSymbol,
      operation,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      brokerage: parseFloat(brokerage),
      total,
      transaction_date: format(date, 'yyyy-MM-dd'),
    });

    // Buscar ou criar asset no Supabase
    let assetId: string;
    
    const { data: existingAsset, error: assetSelectError } = await supabase
      .from('assets')
      .select('id')
      .eq('symbol', selectedSymbol)
      .single();

    // 🔍 DEBUG: Log do asset
    console.log('🔍 DEBUG ASSET SEARCH:', {
      selectedSymbol,
      existingAsset,
      assetSelectError: assetSelectError?.message,
    });

    if (existingAsset) {
      assetId = existingAsset.id;
      console.log('✅ Asset encontrado:', assetId);
    } else {
      // Criar novo asset
      const stock = marketStocks.find(s => s.symbol === selectedSymbol);
      
      console.log('🔍 DEBUG CREATING ASSET:', {
        symbol: selectedSymbol,
        name: stock?.name || selectedSymbol,
        type: 'stock',
        currency: 'BRL',
      });

      const { data: newAsset, error: createError } = await supabase
        .from('assets')
        .insert({
          symbol: selectedSymbol,
          name: stock?.name || selectedSymbol,
          type: 'stock',
          currency: 'BRL',
          is_active: true,
        })
        .select('id')
        .single();

      if (createError) {
        console.error('❌ ERRO AO CRIAR ASSET:', createError);
        throw createError;
      }
      
      assetId = newAsset.id;
      console.log('✅ Asset criado:', assetId);
    }

    // 🔍 DEBUG: Log antes do INSERT final
    console.log('🔍 DEBUG TRANSACTION INSERT - PAYLOAD:', {
      portfolio_id: portfolioId,
      asset_id: assetId,
      operation,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      brokerage: parseFloat(brokerage),
      total,
      transaction_date: format(date, 'yyyy-MM-dd'),
    });

    // Inserir transação
    const { data: insertedTransaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        portfolio_id: portfolioId,
        asset_id: assetId,
        operation,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        brokerage: parseFloat(brokerage),
        total,
        transaction_date: format(date, 'yyyy-MM-dd'),
      })
      .select(); // 🔍 ADICIONAR .select() para ver o que foi inserido

    // 🔍 DEBUG: Log do resultado
    console.log('🔍 DEBUG TRANSACTION INSERT - RESULT:', {
      insertedTransaction,
      insertError: insertError?.message,
      insertErrorDetails: insertError,
    });

    if (insertError) {
      console.error('❌ ERRO NO INSERT:', insertError);
      throw insertError;
    }

    console.log('✅ TRANSAÇÃO INSERIDA COM SUCESSO:', insertedTransaction);

    await queryClient.invalidateQueries({ queryKey: ['positions', portfolioId] });
    await queryClient.invalidateQueries({ queryKey: ['transactions', portfolioId] });
    await queryClient.invalidateQueries({ queryKey: ['closed-positions', portfolioId] });

    toast({
      title: "Transação adicionada",
      description: "A transação foi registrada com sucesso!",
    });

    onOpenChange(false);
    
    // Reset form
    setSelectedSymbol("");
    setQuantity("");
    setPrice("");
    setBrokerage("0");
    setDate(new Date());
    
  } catch (error: any) {
    console.error('❌ ERRO GERAL:', error);
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
    setSelectedSymbol("");
    setOperation("BUY");
    setQuantity("");
    setPrice("");
    setBrokerage("0");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
          <DialogDescription>
            Registre uma nova compra ou venda de ativos
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
            <Label htmlFor="asset">Ativo (Top 100 B3)</Label>
            {loadingStocks ? (
              <div className="text-sm text-muted-foreground">Carregando ativos...</div>
            ) : (
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol} disabled={loading}>
                <SelectTrigger id="asset" className={errors.asset ? "border-danger" : ""}>
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {marketStocks.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {stock.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          R$ {stock.price.toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
            {selectedSymbol && (
              <p className="text-xs text-muted-foreground">
                Preço atual do Market: R$ {marketStocks.find(s => s.symbol === selectedSymbol)?.price.toFixed(2) || '---'}
              </p>
            )}
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
          <Button onClick={handleSubmit} disabled={loading || loadingStocks}>
            {loading ? "Salvando..." : "Adicionar Transação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}