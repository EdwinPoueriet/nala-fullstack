import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Division } from '../types/organigram';

export const QUERY_KEYS = {
  divisions: ['divisions'] as const,
};

export function useDivisions() {
  const { data: divisions = [], isLoading, error } = useQuery<Division[]>({
    queryKey: QUERY_KEYS.divisions,
    queryFn: apiService.divisions.getAll,
    staleTime: 1000 * 60 * 5,
  });

  return {
    divisions,
    isLoading,
    error,
  };
}