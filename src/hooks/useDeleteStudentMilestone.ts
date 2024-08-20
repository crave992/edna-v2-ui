import LessonDto from '@/dtos/LessonDto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface DeleteStudentMilestoneProps {
  handleSuccess?: (data: Response | undefined, error: any, variables: any) => void;
}

export const useDeleteStudentMilestone = ({ handleSuccess }: DeleteStudentMilestoneProps) => {
  const queryClient = useQueryClient();

  const deleteStudentMilestoneMutation = useMutation(
    (data: { milestoneId: number }) =>
      fetch(`/api/students/milestones/delete/${data.milestoneId}`, {
        method: 'DELETE',
      }),
    {
      onMutate: async (variables) => {},

      onSuccess: (data, variables) => {
        if (data.ok) {
          queryClient.invalidateQueries(['students-directory', 'milestones']);
        }
      },
      onError: (error, variables, context) => {
        console.error('Error saving record-keeping:', error);
      },
      onSettled: (data, error, variables) => {
        if (data?.status == 200 && handleSuccess) {
          handleSuccess(data, error, variables);
        }
      },
    }
  );

  return deleteStudentMilestoneMutation;
};
