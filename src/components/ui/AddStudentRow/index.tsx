import StudentAvatar from '@/components/focus/student/StudentAvatar';
import { StudentBasicDto } from '@/dtos/StudentDto';
import PlusCircleIcon from '@/components/svg/PlusCircle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LessonDto from '@/dtos/LessonDto';

export interface AddStudentRowProps {
  student: StudentBasicDto;
  lesson: LessonDto;
  classId: number;
  levelId: number;
}

export default function AddStudentRow({ student, lesson, classId, levelId }: AddStudentRowProps) {
  const queryClient = useQueryClient();

  const handleSave = (studentId: number | undefined) => {
    mutation.mutate({
      status: 'planned',
      actionDate: new Date().toISOString(),
      count: 0,
      studentId,
    });
  };

  const mutation = useMutation(
    (data: {
      status?: string;
      actionDate: string;
      count: number;
      actionType?: string;
      studentId: number | undefined;
    }) =>
      fetch(`/api/lesson/record-keeping/${data.studentId}/${classId}/${lesson.id}`, {
        method: 'POST',
        body: JSON.stringify({
          status: data.status,
          actionDate: data.actionDate,
          count: data.count,
          actionType: data.actionType,
        }),
      }),
    {
      onMutate: async (variables) => {
        const lessonId = lesson.id;
        await queryClient.cancelQueries(['class-lessons', { level: levelId, class: classId }]);

        const previousLessons = queryClient.getQueryData<LessonDto[]>([
          'class-lessons',
          { level: levelId, class: classId },
        ]);

        queryClient.setQueryData(
          ['class-lessons', { level: levelId, class: classId }],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const updatedLessons = old.map((lesson) => {
              if (lesson.id === lessonId) {
                const newRecordKeeping = {
                  id: 99999999,
                  classId: classId,
                  lessonId: lesson.id!,
                  status: variables.status!,
                  createdOn: new Date(variables.actionDate),
                  count: variables.count,
                  studentId: variables.studentId!,
                  rePresented: '',
                  message: null,
                  plannedDate: new Date(variables.actionDate),
                  presentedDate: null,
                  practicingDate: null,
                  acquiredDate: null,
                  reviewDate: null,
                  practiceCount: null,
                  acquiredCount: null,
                  reviewCount: null,
                  history: [],
                  order: lesson.recordKeepings && lesson.recordKeepings.length > 0 ? lesson.recordKeepings[0].order : 0,
                };

                return {
                  ...lesson,
                  recordKeepings: lesson.recordKeepings
                    ? [...lesson.recordKeepings, newRecordKeeping]
                    : [newRecordKeeping],
                };
              }
              return lesson;
            });

            return updatedLessons;
          }
        );

        return { previousLessons };
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['lessonsByLevelClassAreaTopic', levelId, classId, lesson.area.id, lesson.topic.id],
        });
        queryClient.invalidateQueries(['class-lessons', { level: levelId, class: classId }]);
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(['class-lessons', { level: levelId, class: classId }], context?.previousLessons);
        console.error('Error saving record-keeping:', error);
      },
    }
  );

  return (
    <div
      className="tw-flex tw-items-center tw-justify-between tw-cursor-pointer "
      onClick={() => handleSave(student.id)}
    >
      <StudentAvatar
        key={student.id}
        attendant={undefined}
        student={student}
        selected={false}
        setSelected={() => void false}
        direction="row"
        photoSize={40}
        textClass="!tw-text-md-regular !tw-text-secondary"
      />
      <PlusCircleIcon width={24} height={24} color="#101828" />
    </div>
  );
}
