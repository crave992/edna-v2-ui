import { fetchLevels } from '@/services/api/fetchLevels';
import { fetchOnboardingLevels } from '@/services/api/fetchOnboarding';
import { useQuery } from '@tanstack/react-query';

export const useLevelsQuery = () =>
  useQuery({
    queryKey: ['levels'],
    queryFn: () => fetchLevels(),
    staleTime: Infinity,
  });

export const useOnboardingLevelsQuery = (code: string) =>
  useQuery({
    queryKey: ['onboarding-levels'],
    queryFn: () => fetchOnboardingLevels(code),
    staleTime: Infinity,
  });
