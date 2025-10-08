import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  currency: string;
  strategy: string;
  goal_value: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePortfolios() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: portfolios = [], isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Portfolio[];
    },
  });

  const createPortfolio = useMutation({
    mutationFn: async (newPortfolio: {
      name: string;
      currency: string;
      strategy: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: newPortfolio.name,
          currency: newPortfolio.currency,
          strategy: newPortfolio.strategy,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Portfolio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      toast({
        title: "Carteira criada",
        description: "Nova carteira adicionada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar carteira",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    portfolios,
    isLoading,
    createPortfolio: createPortfolio.mutate,
    isCreating: createPortfolio.isPending,
  };
}