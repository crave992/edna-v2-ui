import { fetchStatesByCountry } from '@/services/api/fetchStates';
import { useQuery } from '@tanstack/react-query';

export const useStatesQuery = (countryId: number) =>
  useQuery({
    queryKey: ['states', { country: countryId }],
    queryFn: () => fetchStatesByCountry(countryId),
    enabled: !!countryId,
    staleTime: Infinity,
  });
