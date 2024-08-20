import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomLessonDto } from '@/dtos/LessonDto';

interface SaveCustomLessonProps {
  handleSuccess?: () => void;
}

interface CustomLessonSaveDto {
  data: CustomLessonDto;
  method: string;
}

export const useSaveCustomLesson = ({ handleSuccess }: SaveCustomLessonProps) => {
  const saveCustomLesson = useMutation(
    (data: CustomLessonDto) =>
      fetch(`/api/lesson/custom-lesson`, {
        method: 'POST',
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
        console.error('Error saving attendance status:', error);
      },
    }
  );

  return saveCustomLesson;
};
