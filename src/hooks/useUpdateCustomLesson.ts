import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomLessonDto } from '@/dtos/LessonDto';

interface UpdateCustomLessonProps {
  handleSuccess?: () => void;
}

interface CustomLessonUpdateDto {
  data: CustomLessonDto;
  lessonId: number | null;
}

export const useUpdateCustomLesson = ({ handleSuccess }: UpdateCustomLessonProps) => {
  const updateCustomLesson = useMutation(
    ({ data, lessonId }: CustomLessonUpdateDto) =>
      fetch(`/api/lesson/custom-lesson/${lessonId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    {
      onSuccess: (data) => {
        if (data.ok) {
          if (handleSuccess) handleSuccess();
        }
      },
      onError: (error) => {
        console.log(error);
        console.error('Error updating custom lesson:', error);
      },
    }
  );

  return updateCustomLesson;
};
