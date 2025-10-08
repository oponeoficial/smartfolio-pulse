import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brapiSyncService } from '@/services/brapi-sync.service';
import { useToast } from '@/hooks/use-toast';

export function useSyncPrices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const syncPortfolioPrices = useMutation({
    mutationFn: async (portfolioId: string) => {
      return await brapiSyncService.syncPortfolioPrices(portfolioId);
    },
    onSuccess: () => {
      // Invalida queries de preços e posições para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['asset-prices'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      
      toast({
        title: "Cotações atualizadas",
        description: "Preços sincronizados com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao sincronizar:', error);
      
      const message = error.message?.includes('Rate limit')
        ? 'Limite de requisições atingido. Aguarde alguns minutos.'
        : 'Erro ao atualizar cotações. Tente novamente.';
      
      toast({
        title: "Erro na sincronização",
        description: message,
        variant: "destructive",
      });
    },
  });

  const syncAllPrices = useMutation({
    mutationFn: async () => {
      return await brapiSyncService.syncAllActivePrices();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-prices'] });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      
      toast({
        title: "Cotações globais atualizadas",
        description: "Todos os preços foram sincronizados!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao sincronizar:', error);
      
      toast({
        title: "Erro na sincronização global",
        description: error.message || 'Tente novamente mais tarde.',
        variant: "destructive",
      });
    },
  });

  return {
    syncPortfolioPrices: syncPortfolioPrices.mutate,
    syncAllPrices: syncAllPrices.mutate,
    isSyncing: syncPortfolioPrices.isPending || syncAllPrices.isPending,
  };
}