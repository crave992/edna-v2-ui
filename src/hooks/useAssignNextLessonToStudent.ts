import LessonDto from '@/dtos/LessonDto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface AddNextLessonInSequenceProps {
  studentId: number | undefined;
  classId: number | undefined;
  lessonId: number | undefined;
  sequence: number | undefined;
  levelId: number | undefined;
  handleSuccess?: () => void;
}

export const useAssignNextLessonToStudent = ({
  studentId,
  classId,
  lessonId,
  sequence,
  levelId,
  handleSuccess,
}: AddNextLessonInSequenceProps) => {
  const queryClient = useQueryClient();
  const mutationAssignNextLesson = useMutation(
    () =>
      fetch(`/api/lesson/record-keeping/save-next-lesson-in-sequence/${studentId}/${classId}/${lessonId}/${sequence}`, {
        method: 'POST',
      }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);

        const previousLessons = queryClient.getQueryData<LessonDto[]>([
          'student-lessons',
          { level: levelId, class: classId, student: studentId },
        ]);

        const allLessons = queryClient.getQueryData<LessonDto[]>(['lessons', { level: levelId }]);
        const minOrder = previousLessons
          ? Math.min(
              ...previousLessons.map(
                (lesson) => (lesson && lesson.recordKeepings && lesson?.recordKeepings[0]?.order) || 0
              )
            )
          : 0;

        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          (old: LessonDto[] | undefined) => {
            if (!old || !allLessons) return old;

            const currentLesson = old.find((lesson) => lesson.id === lessonId);
            if (!currentLesson) return old;

            const nextLesson = allLessons.find((lesson) => {
              const isNextLesson = lesson.sequenceNumber > currentLesson.sequenceNumber;
              const hasBeenLearned = old.some((studentLesson) => studentLesson.id === lesson.id);
              const sameTopic = lesson.topicId === currentLesson.topic.id;
              return isNextLesson && !hasBeenLearned && sameTopic;
            });
            if (!nextLesson) return old;

            const newLesson = {
              ...nextLesson,
              recordKeepings: [
                {
                  id: 0,
                  studentId: studentId || 0,
                  classId: classId || 0,
                  lessonId: nextLesson.id,
                  status: 'planned',
                  plannedDate: new Date(),
                  presentedDate: null,
                  practicingDate: null,
                  reviewDate: null,
                  acquiredDate: null,
                  practiceCount: null,
                  acquiredCount: null,
                  reviewCount: null,
                  createdOn: new Date(),
                  rePresented: '',
                  order: minOrder - 1,
                  history: [
                    {
                      actionDate: new Date(),
                      count: null,
                      createdOn: new Date(),
                      id: 0,
                      message: '',
                      recordKeeping: null,
                      recordKeepingId: 0,
                      status: 'planned',
                      createdByUser: null,
                    },
                  ],
                },
              ],
            };

            return [...old, newLesson];
          }
        );

        return { previousLessons };
      },
      onSuccess: async (data) => {
        if (!data.ok) {
          var d = await data.json();
          toast.info(d.error);
        }
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          context?.previousLessons
        );
        console.log(error);
      },
      onSettled: () => {
        const queriesToInvalidate = [
          queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]),
        ];

        Promise.all(queriesToInvalidate).then(() => {
          queryClient.invalidateQueries({
            queryKey: ['student-lessons', { level: levelId, class: classId, student: studentId }],
          });
        });
      },
    }
  );

  return mutationAssignNextLesson;
};
