import { fetchSemesters } from '@/services/api/fetchSemesters';
import { useQuery } from '@tanstack/react-query';

export const useSemesterQuery = () =>
  useQuery({
    queryKey: ['semesters'],
    queryFn: () => fetchSemesters(),
    staleTime: Infinity,
  });
