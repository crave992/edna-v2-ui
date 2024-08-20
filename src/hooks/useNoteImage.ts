// hooks/useNoteImage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NoteImageParams {
  studentId: number | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  lessonId: number | undefined;
  handleSuccess?: () => void;
}

export const useNoteImage = ({ studentId, classId, lessonId, levelId, handleSuccess }: NoteImageParams) => {
  const queryClient = useQueryClient();
  const saveNoteMutation = useMutation(
    (data: {
      title?: string;
      note?: string;
      lessonState?: string;
      imageName?: string;
      imageB64?: string;
      lessonImageCaption?: string;
      shareWithGuardians?: boolean;
    }) =>
      fetch(`/api/record-keeping/add-student-lesson-notes-image/${studentId}/${classId}/${lessonId}`, {
        method: 'POST',
        body: JSON.stringify({
          title: data.title ?? '',
          notes: data.note ?? '',
          lessonState: data.lessonState,
          imageName: data.imageName,
          imageB64: data.imageB64,
          lessonImageCaption: data.lessonImageCaption ?? '',
          shareWithGuardians: data.shareWithGuardians,
        }),
      }),
    {
      onSuccess: (data) => {
        if (data.ok) {
          queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]);
          queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);
          queryClient.invalidateQueries(['students-directory', 'milestones', studentId]);
        }
      },
      onError: (error) => {
        console.error('Error saving note:', error);
      },

      onSettled(data, error, variables, context) {
        if (data?.status == 200 && handleSuccess) handleSuccess();
      },
    }
  );
  return saveNoteMutation;
};
