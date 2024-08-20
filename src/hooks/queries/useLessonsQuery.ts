import {
  fetchLessonsByLevel,
  fetchLessonsByLevelAndClass,
  fetchLessonsByLevelAndClassAndStudent,
} from '@/services/api/fetchLessons';
import { useQuery } from '@tanstack/react-query';

interface LessonsQueryProps {
  levelId?: number;
  classId?: number;
  studentId?: number;
  areaId?: number;
  topicId?: number;
}

export const useStudentLessonsQuery = ({ levelId, classId, studentId }: LessonsQueryProps) =>
  useQuery({
    queryKey: ['student-lessons', { level: levelId, class: classId, student: studentId }],
    queryFn: () => fetchLessonsByLevelAndClassAndStudent(levelId!, classId!, studentId!),
    enabled: !!levelId && !!classId && !!studentId,
  });

export const useLessonsQuery = ({ levelId }: LessonsQueryProps) =>
  useQuery({
    queryKey: ['lessons', { level: levelId }],
    queryFn: () => fetchLessonsByLevel(levelId!),
    enabled: !!levelId,
    staleTime: Infinity,
  });

export const useClassLessonsQuery = ({ levelId, classId }: LessonsQueryProps) =>
  useQuery({
    queryKey: ['class-lessons', { level: levelId, class: classId }],
    queryFn: () => fetchLessonsByLevelAndClass(levelId!, classId!),
    enabled: !!levelId && !!classId,
  });
