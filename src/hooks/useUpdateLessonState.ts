import LessonDto from '@/dtos/LessonDto';
import { RecordKeepingDto } from '@/dtos/RecordKeepingDto';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface UpdateLessonStateProps {
  studentId: number | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  lessonId: number | undefined;
  areaId: number | undefined;
  topicId: number | undefined;
  fromStudent?: boolean;
  handleSuccess?: (data: Response | undefined, error: any, variables: any) => void;
}

export const useUpdateLessonState = ({
  studentId,
  classId,
  lessonId,
  levelId,
  areaId,
  topicId,
  handleSuccess,
  fromStudent = false,
}: UpdateLessonStateProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateRecordKeeping = (
    status: string,
    variables: any,
    recordKeeping: RecordKeepingDto | null
  ): RecordKeepingDto => {
    const defaultRecord: RecordKeepingDto = {
      id: 0,
      studentId: studentId!,
      classId: classId!,
      lessonId: lessonId!,
      status: 'planned',
      order: 0,
      practiceCount: 0,
      plannedDate: new Date(),
      practicingDate: null,
      acquiredDate: null,
      reviewDate: null,
      acquiredCount: 0,
      reviewCount: 0,
      history: [],
      presentedDate: null,
      createdOn: new Date(),
      rePresented: '',
    };

    const updatedRecord = recordKeeping
      ? { ...recordKeeping, status, order: variables.order }
      : { ...defaultRecord, status };

    switch (status) {
      case 'planned':
        return { ...updatedRecord, practiceCount: 0, plannedDate: new Date(variables.actionDate) };
      case 'practicing':
        return { ...updatedRecord, practiceCount: variables.count, practicingDate: new Date(variables.actionDate) };
      case 'acquired':
        return { ...updatedRecord, acquiredCount: variables.count, acquiredDate: new Date(variables.actionDate) };
      case 'review':
        return { ...updatedRecord, reviewCount: variables.count, reviewDate: new Date(variables.actionDate) };
      default:
        return updatedRecord;
    }
  };

  const updateLessonStateMutation = useMutation(
    (data: {
      status?: string;
      order?: number;
      actionDate: string;
      count: number | null;
      actionType?: string;
      reReview: boolean;
      fromStudentLessonId?: number;
    }) =>
      fetch(
        `/api/lesson/record-keeping/${studentId}/${classId}/${
          data.fromStudentLessonId ? data.fromStudentLessonId : lessonId
        }`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ),
    {
      onMutate: async (variables) => {
        const lessons = queryClient.getQueryData<LessonDto[]>(['lessons', { level: levelId }]);

        queryClient.setQueryData(
          ['lessons', { level: levelId }],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) {
              const newLesson = lessons?.find((lesson) => lesson.id === lessonId);
              if (newLesson) {
                const updatedRecordKeepings = [updateRecordKeeping(variables.status!, variables, null)];
                const updatedLessons = [...old, { ...newLesson, recordKeepings: updatedRecordKeepings }];

                return updatedLessons;
              }
              return old;
            } else {
              const lessonToUpdate = old[lessonIndex];
              const recordKeepingIndex =
                lessonToUpdate.recordKeepings?.findIndex((rk) => rk.studentId === studentId) ?? -1;

              const updatedRecordKeepings = lessonToUpdate.recordKeepings ? [...lessonToUpdate.recordKeepings] : [];
              if (recordKeepingIndex !== -1) {
                updatedRecordKeepings[recordKeepingIndex] = updateRecordKeeping(
                  variables.status!,
                  variables,
                  updatedRecordKeepings[recordKeepingIndex]
                );
              } else {
                updatedRecordKeepings.push(updateRecordKeeping(variables.status!, variables, null));
              }

              const updatedLessons = [...old];
              updatedLessons[lessonIndex] = { ...lessonToUpdate, recordKeepings: updatedRecordKeepings };

              return updatedLessons;
            }
          }
        );

        await queryClient.cancelQueries({
          queryKey: ['student-lessons', { level: levelId, class: classId, student: studentId }],
        });
        await queryClient.cancelQueries({
          queryKey: ['class-lessons', { level: levelId, class: classId }],
        });

        const previousLessons = queryClient.getQueryData<LessonDto[]>([
          'student-lessons',
          { level: levelId, class: classId, student: studentId },
        ]);

        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) {
              const newLesson = lessons?.find((lesson) => lesson.id === lessonId);
              if (newLesson) {
                const updatedRecordKeepings = [updateRecordKeeping(variables.status!, variables, null)];
                const updatedLessons = [...old, { ...newLesson, recordKeepings: updatedRecordKeepings }];

                return updatedLessons;
              }
              return old;
            } else {
              const lessonToUpdate = old[lessonIndex];
              const recordKeepingIndex =
                lessonToUpdate.recordKeepings?.findIndex((rk) => rk.studentId === studentId) ?? -1;

              const updatedRecordKeepings = lessonToUpdate.recordKeepings ? [...lessonToUpdate.recordKeepings] : [];
              if (recordKeepingIndex !== -1) {
                updatedRecordKeepings[recordKeepingIndex] = updateRecordKeeping(
                  variables.status!,
                  variables,
                  updatedRecordKeepings[recordKeepingIndex]
                );
              } else {
                updatedRecordKeepings.push(updateRecordKeeping(variables.status!, variables, null));
              }

              const updatedLessons = [...old];
              updatedLessons[lessonIndex] = { ...lessonToUpdate, recordKeepings: updatedRecordKeepings };

              return updatedLessons;
            }
          }
        );

        const classLessons = queryClient.getQueryData<LessonDto[]>([
          'class-lessons',
          { level: levelId, class: classId },
        ]);

        queryClient.setQueryData(
          ['class-lessons', { level: levelId, class: classId }],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((lesson) => lesson.id === lessonId);
            if (lessonIndex === -1) {
              const newLesson = lessons?.find((lesson) => lesson.id === lessonId);
              if (newLesson) {
                const updatedRecordKeepings = [updateRecordKeeping(variables.status!, variables, null)];
                const updatedLessons = [...old, { ...newLesson, recordKeepings: updatedRecordKeepings }];

                return updatedLessons;
              }
              return old;
            } else {
              const lessonToUpdate = old[lessonIndex];
              const recordKeepingIndex =
                lessonToUpdate.recordKeepings?.findIndex((rk) => rk.studentId === studentId) ?? -1;

              const updatedRecordKeepings = lessonToUpdate.recordKeepings ? [...lessonToUpdate.recordKeepings] : [];
              if (recordKeepingIndex !== -1) {
                updatedRecordKeepings[recordKeepingIndex] = updateRecordKeeping(
                  variables.status!,
                  variables,
                  updatedRecordKeepings[recordKeepingIndex]
                );
              } else {
                updatedRecordKeepings.push(updateRecordKeeping(variables.status!, variables, null));
              }

              const updatedLessons = [...old];
              updatedLessons[lessonIndex] = { ...lessonToUpdate, recordKeepings: updatedRecordKeepings };

              return updatedLessons;
            }
          }
        );

        return { previousLessons, classLessons, lessons };
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          context?.previousLessons
        );
        queryClient.setQueryData(['class-lessons', { level: levelId, class: classId }], context?.classLessons);
        queryClient.setQueryData(['lessons', { level: levelId }], context?.lessons);
        console.error('Error saving record-keeping:', error);
      },
      onSettled: (data, error, variables) => {
        const queriesToInvalidate = [
          queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]),
          queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]),
          queryClient.invalidateQueries(['lessons', { level: levelId }]),
        ];

        Promise.all(queriesToInvalidate).then(() => {
          queryClient.invalidateQueries({
            queryKey: ['student-lessons', { level: levelId, class: classId, student: studentId }],
          });
          queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]);
          queryClient.invalidateQueries(['lessons', { level: levelId }]);
        });

        if (handleSuccess) {
          handleSuccess(data, error, variables);
        }
      },
    }
  );

  return updateLessonStateMutation;
};
