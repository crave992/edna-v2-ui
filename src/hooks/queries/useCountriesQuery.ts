import { fetchCountries } from '@/services/api/fetchCountries';
import { useQuery } from '@tanstack/react-query';

export const useCountriesQuery = () =>
  useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });
