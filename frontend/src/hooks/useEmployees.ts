import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Employee } from '../types/organigram';

export const QUERY_KEYS = {
  employees: ['employees'] as const,
};

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.employees,
    queryFn: apiService.employees.getAll,
    staleTime: 1000 * 60,
  });

  const assignEmployee = useMutation({
    mutationFn: ({ employeeId, positionId }: { employeeId: string; positionId: string }) =>
      apiService.employees.assignToPosition(employeeId, positionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
    },
  });

  const removeEmployee = useMutation({
    mutationFn: (employeeId: string) => apiService.employees.removeFromPosition(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.employees });
    },
  });

  const getAvailableEmployees = () => {
    return employees.filter(emp => emp.position === null);
  };

  const getPositionEmployees = (positionId: string) => {
    return employees.filter(emp => emp.position === positionId);
  };

  return {
    employees,
    isLoading,
    error,
    assignEmployee,
    removeEmployee,
    getAvailableEmployees,
    getPositionEmployees,
  };
}