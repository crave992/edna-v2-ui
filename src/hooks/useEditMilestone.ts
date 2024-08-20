import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditMilestonParams {
  handleSuccess?: () => void;
}

export const useEditMilestone = ({ handleSuccess }: EditMilestonParams) => {
  const queryClient = useQueryClient();
  const saveNoteMutation = useMutation(
    (data: {
      title?: string;
      note?: string;
      lessonState?: string;
      imageName?: string | null;
      imageB64?: string | null;
      lessonImageCaption?: string;
      date?: string;
      time?: string;
      id?: number;
      shareWithGuardians?: boolean;
    }) =>
      fetch(`/api/record-keeping/edit-student-lesson-notes/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: data.title ?? '',
          notes: data.note ?? '',
          lessonState: data.lessonState ?? '',
          imageName: data.imageName ?? null,
          imageB64: data.imageB64 ?? null,
          lessonImageCaption: data.lessonImageCaption ?? '',
          date: data.date ?? '',
          time: data.time ?? '',
          shareWithGuardians: data.shareWithGuardians,
        }),
      }),
    {
      onSuccess: (data) => {
        console.log('data', data);
        if (data.ok) {
          queryClient.invalidateQueries(['students-directory', 'milestones']);
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
