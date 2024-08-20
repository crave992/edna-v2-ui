import LessonDto from '@/dtos/LessonDto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface DeleteLessonProps {
  studentId: number | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  lessonId: number | undefined;
  areaId: number | undefined;
  topicId: number | undefined;
  handleSuccess?: (data: Response | undefined, error: any, variables: any) => void;
}

export const useDeleteLesson = ({
  studentId,
  classId,
  lessonId,
  levelId,
  areaId,
  topicId,
  handleSuccess,
}: DeleteLessonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteLessonMutation = useMutation(
    () =>
      fetch(`/api/lesson/record-keeping/${studentId}/${classId}/${lessonId}`, {
        method: 'DELETE',
      }),
    {
      onMutate: async (variables) => {
        //update custom lessons
        const previousAlbumLessons = queryClient.getQueryData<LessonDto[]>([
          'lessonsByLevelClassArea',
          levelId,
          classId,
          areaId,
        ]);

        await queryClient.cancelQueries(['lessonsByLevelClassArea', levelId, classId, areaId]);

        queryClient.setQueryData(
          ['lessonsByLevelClassArea', levelId, classId, areaId],
          (old: LessonDto[] | undefined) => {
            if (!old) {
              return [];
            }

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) return old;
            const lessonToUpdate = old[lessonIndex];
            const updatedLesson = { ...lessonToUpdate, recordKeepings: [] };
            const updatedLessons = [...old];
            updatedLessons[lessonIndex] = updatedLesson;
            return updatedLessons;
          }
        );

        //update add lesson popup lessons
        await queryClient.cancelQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);
        const previousAddLessonPopupLessons = queryClient.getQueryData<LessonDto[]>([
          'student-lessons',
          { level: levelId, class: classId, student: studentId },
        ]);

        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) return old;
            const lessonToUpdate = old[lessonIndex];
            if (!lessonToUpdate.recordKeepings) return old;

            const recordKeepingIndex = lessonToUpdate.recordKeepings.findIndex((rk) => rk.studentId === studentId);
            if (recordKeepingIndex === -1) return old;

            const updatedRecordKeepings = [...lessonToUpdate.recordKeepings];

            updatedRecordKeepings.splice(recordKeepingIndex, 1);

            const updatedLesson = { ...lessonToUpdate, recordKeepings: updatedRecordKeepings };
            const updatedLessons = [...old];
            updatedLessons[lessonIndex] = updatedLesson;

            return updatedLessons;
          }
        );

        //update class cache
        await queryClient.cancelQueries(['lessonsByLevelClassAreaTopic', levelId, classId, areaId, topicId]);
        const previousClassLessons = queryClient.getQueryData<LessonDto[]>([
          'lessonsByLevelClassAreaTopic',
          levelId,
          classId,
          areaId,
          topicId,
        ]);

        queryClient.setQueryData(
          ['lessonsByLevelClassAreaTopic', levelId, classId, areaId, topicId],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) return old;
            const lessonToUpdate = old[lessonIndex];
            if (!lessonToUpdate.recordKeepings) return old;

            const recordKeepingIndex = lessonToUpdate.recordKeepings.findIndex((rk) => rk.studentId === studentId);
            if (recordKeepingIndex === -1) return old;

            const updatedRecordKeepings = [...lessonToUpdate.recordKeepings];

            updatedRecordKeepings.splice(recordKeepingIndex, 1);

            const updatedLesson = { ...lessonToUpdate, recordKeepings: updatedRecordKeepings };
            const updatedLessons = [...old];
            updatedLessons[lessonIndex] = updatedLesson;

            return updatedLessons;
          }
        );

        return { previousAlbumLessons, previousAddLessonPopupLessons, previousClassLessons };
      },

      onSuccess: (data, variables) => {
        if (data.ok) {
          queryClient.invalidateQueries({
            queryKey: ['lessonsByLevelClassAreaTopic', levelId, classId, areaId, topicId],
          });
          queryClient.invalidateQueries(['lessonsByLevelClassArea', levelId, classId, areaId]);
          queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]);
          queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);
        }
      },
      onError: (error, variables, context) => {
        console.error('Error saving record-keeping:', error);
        queryClient.setQueryData(['lessonsByLevelClassArea', levelId, classId, areaId], context?.previousAlbumLessons);
        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          context?.previousAddLessonPopupLessons
        );
        queryClient.setQueryData(
          ['lessonsByLevelClassAreaTopic', levelId, classId, areaId, topicId],
          context?.previousClassLessons
        );
      },
      onSettled: (data, error, variables) => {
        if (data?.status == 200 && handleSuccess) {
          handleSuccess(data, error, variables);
        }
      },
    }
  );

  return deleteLessonMutation;
};
