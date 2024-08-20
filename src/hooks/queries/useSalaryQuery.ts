import { fetchSalaryTypes } from '@/services/api/fetchSalaryTypes';
import { useQuery } from '@tanstack/react-query';

export const useSalaryTypesQuery = () =>
  useQuery({
    queryKey: ['salary-types'],
    queryFn: () => fetchSalaryTypes(),
    staleTime: Infinity,
  });
