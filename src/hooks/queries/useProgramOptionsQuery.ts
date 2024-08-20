import { fetchProgramOptionsByLevel } from '@/services/api/fetchProgramOptions';
import { useQuery } from '@tanstack/react-query';

export const useProgramOptionQuery = (levelId: number) =>
  useQuery({
    queryKey: ['program-options', { level: levelId }],
    queryFn: () => fetchProgramOptionsByLevel(levelId),
    enabled: !!levelId,
    staleTime: Infinity,
  });
