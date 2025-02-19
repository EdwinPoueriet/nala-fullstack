import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Position, Tier } from '../types/organigram';
import { QUERY_KEYS as POSITION_KEYS } from './usePositions';

export const TIER_KEYS = {
    all: ['tiers'] as const,
  } as const;

type MutationContext = {
  previousTiers: Tier[];
  previousPositions: Position[];
};

export function useTiers() {
    const queryClient = useQueryClient();

    const { data: tiers = [], isLoading, error } = useQuery({
      queryKey: TIER_KEYS.all,
      queryFn: apiService.tiers.getAll,
      staleTime: 1000 * 60 * 5,
    });

  const createTier = useMutation({
    mutationFn: apiService.tiers.create,
    onSuccess: (newTier) => {
      queryClient.setQueryData<Tier[]>(TIER_KEYS.all, (old = []) => [...old, newTier]);
    },
  });

  const updateTier = useMutation({
    mutationFn: apiService.tiers.update,
    onMutate: async (updatedTier) => {
      await queryClient.cancelQueries({ queryKey: TIER_KEYS.all });
      const previousTiers = queryClient.getQueryData<Tier[]>(TIER_KEYS.all) || [];

      queryClient.setQueryData<Tier[]>(TIER_KEYS.all, (old = []) =>
        old.map((tier) =>
          tier.id === updatedTier.id ? { ...tier, ...updatedTier } : tier
        )
      );

      return { previousTiers };
    },
    onError: (error, variables, context) => {
      if (context?.previousTiers) {
        queryClient.setQueryData(TIER_KEYS.all, context.previousTiers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TIER_KEYS.all });
    },
  });

  const deleteTier = useMutation({
    mutationFn: apiService.tiers.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TIER_KEYS.all });
      await queryClient.cancelQueries({ queryKey: POSITION_KEYS.positions });

      const previousTiers = queryClient.getQueryData<Tier[]>(TIER_KEYS.all) || [];
      const previousPositions = queryClient.getQueryData<Position[]>(POSITION_KEYS.positions) || [];

      queryClient.setQueryData<Tier[]>(TIER_KEYS.all, (old = []) =>
        old.filter((tier) => tier.id !== id)
      );

      queryClient.setQueryData<Position[]>(POSITION_KEYS.positions, (old = []) =>
        old.filter((position) => position.tier !== id)
      );

      return { previousTiers, previousPositions };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(TIER_KEYS.all, context.previousTiers);
        queryClient.setQueryData(POSITION_KEYS.positions, context.previousPositions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TIER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: POSITION_KEYS.positions });
    },
  });
  return {
    tiers,
    isLoading,
    error,
    createTier,
    updateTier,
    deleteTier,
  };
}