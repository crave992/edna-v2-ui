import { fetchJobTitles } from '@/services/api/fetchJobTitles';
import { useQuery } from '@tanstack/react-query';

export const useJobTitlesQuery = () =>
  useQuery({
    queryKey: ['job-titles'],
    queryFn: () => fetchJobTitles(),
    staleTime: Infinity,
  });
