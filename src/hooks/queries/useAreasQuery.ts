import {
  fetchAreasByLevelAndClass,
  fetchAreasByLevelAndClassAndStudent,
  fetchAreasByLevelAndStudent,
} from '@/services/api/fetchAreas';
import { useQuery } from '@tanstack/react-query';

export const useAreasQuery = (levelId: number, classId: number, studentId?: number) => {
  const areasQuery = useQuery(['areas', { level: levelId }], () => fetchAreasByLevelAndClass(levelId, classId), {
    enabled: !!levelId && !!classId,
    staleTime: Infinity,
  });

  const areasByLevelStudentQuery = useQuery(
    ['areas', { level: levelId, student: studentId }],
    () => fetchAreasByLevelAndStudent(levelId, studentId!),
    {
      enabled: !!levelId && !!studentId,
      staleTime: Infinity,
    }
  );

  const areasStudentQuery = useQuery(
    ['areas', { student: studentId }],
    () => fetchAreasByLevelAndClassAndStudent(levelId, classId, studentId!),
    {
      enabled: !!levelId && !!classId && !!studentId,
      staleTime: Infinity,
    }
  );

  return {
    areas: areasQuery.data,
    areasByLevelStudent: areasByLevelStudentQuery.data,
    isLoadingAreas: areasQuery.isLoading,
    areasStudent: areasStudentQuery.data,
    isLoadingAreasStudent: areasStudentQuery.isLoading,
  };
};
