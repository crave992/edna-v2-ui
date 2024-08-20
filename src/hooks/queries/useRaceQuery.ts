import { fetchRace } from '@/services/api/fetchRace';
import { useQuery } from '@tanstack/react-query';

export const useRaceQuery = () =>
  useQuery({
    queryKey: ['race'],
    queryFn: () => fetchRace(),
    staleTime: Infinity,
  });
