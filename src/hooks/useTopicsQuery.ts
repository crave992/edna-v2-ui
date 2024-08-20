import { fetchTopicsByLevel, fetchTopicsByLevelAndArea } from '@/services/api/fetchTopics';
import { useQuery } from '@tanstack/react-query';

export const useTopicsByLevelQuery = (levelId: number) =>
  useQuery({
    queryKey: ['topics', { level: levelId }],
    queryFn: () => fetchTopicsByLevel(levelId!),
    staleTime: Infinity,
    enabled: !!levelId,
  });

export const useTopicsByLevelAndAreaQuery = (levelId: number, areaId: number) =>
  useQuery({
    queryKey: ['topics', { level: levelId, area: areaId }],
    queryFn: () => fetchTopicsByLevelAndArea(levelId!, areaId!),
    staleTime: Infinity,
    enabled: !!levelId && !!areaId,
  });
