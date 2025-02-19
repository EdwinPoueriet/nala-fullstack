import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Position, Division } from '../types/organigram';

export const QUERY_KEYS = {
    all: ['all'] as const,
    positions: ['positions'] as const,
    divisions: ['divisions'] as const,
  } as const;


type MutationContext = {
  previousPositions: Position[] | undefined;
};

export function usePositions() {
  const queryClient = useQueryClient();

  const { data: positions = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.positions,
    queryFn: apiService.positions.getAll,
    staleTime: 1000 * 60, 
  });

  const createPosition = useMutation({
    mutationFn: apiService.positions.create,
    onSuccess: (newPosition: Position) => {
      queryClient.setQueryData<Position[]>(QUERY_KEYS.positions, (old = []) => [
        ...old,
        newPosition,
      ]);
    },
  });

  const updatePosition = useMutation({
    mutationFn: apiService.positions.update,
    onMutate: async (updatedPosition: { id: string } & Partial<Position>) => {
      
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.positions });

      
      const previousPositions = queryClient.getQueryData<Position[]>(QUERY_KEYS.positions);

      
      queryClient.setQueryData<Position[]>(QUERY_KEYS.positions, (old = []) =>
        old.map((position) =>
          position.id === updatedPosition.id
            ? { ...position, ...updatedPosition }
            : position
        )
      );

      
      return { previousPositions };
    },
    onError: (error: Error, newPosition: { id: string } & Partial<Position>, context: MutationContext | undefined) => {
      
      if (context?.previousPositions) {
        queryClient.setQueryData<Position[]>(QUERY_KEYS.positions, context.previousPositions);
      }
    },
    onSettled: () => {
      
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions });
    },
  });

  const deletePosition = useMutation({
    mutationFn: apiService.positions.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.positions });
      const previousPositions = queryClient.getQueryData<Position[]>(QUERY_KEYS.positions);

      queryClient.setQueryData<Position[]>(QUERY_KEYS.positions, (old = []) =>
        old.filter((position) => position.id !== id)
      );

      return { previousPositions };
    },
    onError: (error: Error, id: string, context: MutationContext | undefined) => {
      if (context?.previousPositions) {
        queryClient.setQueryData<Position[]>(QUERY_KEYS.positions, context.previousPositions);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.positions });
    },
  });

  return {
    positions,
    isLoading,
    error,
    createPosition,
    updatePosition,
    deletePosition,
  };
}