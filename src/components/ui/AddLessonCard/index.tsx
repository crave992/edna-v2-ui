import { lessonTypeColors } from '@/constants/lessonTypeColors';
import PlusCircleIcon from '@/components/svg/PlusCircle';
import LessonDto from '@/dtos/LessonDto';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface AddLessonCardProps {
  lessonType: string;
  classId: number | undefined;
  levelId: number | undefined;
  sequence: string | undefined;
  studentId: number | undefined;
  name: string;
  description: string;
  lesson: LessonDto;
}

export default function AddLessonCard({
  lessonType,
  sequence,
  name,
  description,
  lesson,
  classId,
  levelId,
  studentId,
}: AddLessonCardProps) {
  const queryClient = useQueryClient();
  const colorScheme = lessonTypeColors[lessonType] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#F2F4F7',
    medium: '#98A2B3',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
  };
  const { veryDark, dark, light, medium } = colorScheme;

  const handleSave = () => {
    mutation.mutate({
      status: 'planned',
      actionDate: new Date().toISOString(),
      count: 0,
    });
  };

  const mutation = useMutation(
    (data: { status?: string; actionDate: string; count: number; actionType?: string }) =>
      fetch(`/api/lesson/record-keeping/${studentId}/${classId}/${lesson.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    {
      onMutate: async () => {
        const lessonId = lesson.id;
        await queryClient.cancelQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);

        const previousLessons = queryClient.getQueryData<LessonDto[]>([
          'student-lessons',
          { level: levelId, class: classId, student: studentId },
        ]);

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
            if (!old) return [];

            const lessonExists = old.some((lesson) => lesson.id === lessonId);
            if (lessonExists) return old;

            const newLesson = {
              ...lesson,
              recordKeepings: [
                {
                  id: 0,
                  studentId: studentId || 0,
                  classId: classId || 0,
                  lessonId,
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
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          context?.previousLessons
        );
        console.error('Error saving record-keeping:', error);
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

  return (
    <div
      style={{ backgroundColor: light, borderColor: dark }}
      className={`tw-flex tw-flex-row tw-w-[352px] tw-border-[1px] tw-h-[87px] tw-p-lg tw-rounded-md tw-justify-between tw-cursor-pointer ${
        lesson.isCustom ? 'tw-border-dashed' : 'tw-border-solid'
      }`}
      onClick={() => handleSave()}
    >
      <div className={`tw-w-[300px] tw-h-[87px] tw-select-none `}>
        <div className="tw-h-[18px] tw-flex tw-flex-nowrap tw-items-center tw-space-x-xs">
          {sequence && (
            <div
              style={{ color: dark, backgroundColor: medium }}
              className="tw-text-xs-medium tw-rounded-xs tw-px-xs tw-py-0"
            >
              {sequence}
            </div>
          )}
          <div style={{ color: dark }} className="tw-truncate tw-text-xs-medium">
            {name}
          </div>
        </div>
        <div className="tw-line-clamp-2 tw-text-sm-regular" style={{ color: veryDark }}>
          {description}
        </div>
      </div>
      <div className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
        <PlusCircleIcon color={dark} />
      </div>
    </div>
  );
}
