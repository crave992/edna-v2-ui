import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SaveNoteProps {
  studentId: number | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  lessonId: number | undefined;
  handleSuccess?: () => void;
}

export const useSaveNote = ({ studentId, classId, lessonId, levelId, handleSuccess }: SaveNoteProps) => {
  const queryClient = useQueryClient();

  const saveNoteMutation = useMutation(
    (data: { note?: string; lessonState?: string; shouldInvalidate?: boolean; count?: number }) =>
      fetch(`/api/record-keeping/add-student-lesson-notes/${studentId}/${classId}/${lessonId}`, {
        method: 'POST',
        body: JSON.stringify({
          notes: data.note ?? '',
          lessonState: data.lessonState,
          count: data.count,
        }),
      }),
    {
      onSuccess: (data) => {
        if (data.ok) {
          // queryClient.invalidateQueries({ queryKey: ['lessonsByLevelClass', levelId, classId], refetchType: 'all' });
          // queryClient.invalidateQueries({
          //   queryKey: ['lessonsByLevelClassStudentId', levelId, classId, studentId],
          //   refetchType: 'all',
          // });
        }
      },
      onError: (error) => {
        console.error('Error saving note:', error);
      },

      onSettled(data, error, variables, context) {
        if (data?.status == 200 && variables.shouldInvalidate) {
          queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]);
          queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);
        }
        if (handleSuccess) {
          handleSuccess();
        }
      },
    }
  );

  return saveNoteMutation;
};
