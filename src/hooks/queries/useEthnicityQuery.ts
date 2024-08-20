import { fetchEthnicity } from '@/services/api/fetchEthnicity';
import { useQuery } from '@tanstack/react-query';

export const useEthnicityQuery = (ethnicityCategoryId: number) =>
  useQuery({
    queryKey: ['ethnicity', { category: ethnicityCategoryId }],
    queryFn: () => fetchEthnicity(ethnicityCategoryId),
    enabled: !!ethnicityCategoryId,
    staleTime: Infinity,
  });
