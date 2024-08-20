import { useEffect, useState, MouseEvent, useRef } from 'react';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import LessonDto from '@/dtos/LessonDto';
import { useFocusContext } from '@/context/FocusContext';
import focusConstants from '@/constants/focusConstants';
import { usePopover } from '@/hooks/usePopover';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import useLongPress from '@/hooks/useLongPress';

interface ProgressLessonBoxProps {
  levelId: number | undefined;
  classId: number | undefined;
  lessonId: number | undefined;
  lesson: LessonDto | undefined;
  studentId: number | undefined;
  areaName: string;
}

function LessonBoxFunction({ levelId, classId, lessonId, lesson, studentId, areaName }: ProgressLessonBoxProps) {
  const { currentUserRoles, setLessonId, setStudentId } = useFocusContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { setReferenceElement } = usePopover();
  const [newCount, setNewCount] = useState<number | null | undefined>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string | undefined>(undefined);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const colorStyle = lessonTypeColors[areaName] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#EAECF0',
    medium: '#D0D5DD',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
    reviewBgImage: '/images/revisited-unknown.svg',
  };

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId,
    levelId,
    areaId: lesson?.area.id,
    topicId: lesson?.topic.id,
  });

  // const assignLesson = () => {
  //   updateLessonStateMutation.mutate({
  //     status: 'planned',
  //     order: -1,
  //     actionDate: new Date().toISOString(),
  //     count: 0,
  //     reReview: false,
  //   });
  // };

  const onLongPressFn = useLongPress(
    {
      onLongPress() {},
      onClick(event: any) {
        if (event.button == 0) {
          //left click
          event.preventDefault();
          triggerPractice();
        }
      },
    },
    { shouldPreventDefault: false }
  );

  const triggerPractice = () => {
    if (updatedStatus !== undefined) return;

    if (currentUserRoles?.isStaff) {
      const { isLeadGuide, isSpecialist } = currentUserRoles;
      if (!isLeadGuide && !isSpecialist) return;
    }

    // assignLesson();
  };

  // const handleOpenContextMenu = (event: MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   if (updatedStatus !== undefined) {
  //     setStudentId(studentId);
  //     setLessonId(lesson?.id);
  //     setIsPopoverOpen(true);
  //   }
  // };

  useEffect(() => {
    const recordKeeping =
      lesson && lesson.recordKeepings && lesson.recordKeepings.find((rk) => rk.studentId === studentId);
    const status = recordKeeping && recordKeeping.status ? recordKeeping.status : undefined;
    const count =
      recordKeeping?.status === 'practicing'
        ? recordKeeping.practiceCount
        : recordKeeping?.status === 'acquired'
        ? recordKeeping.acquiredCount
        : recordKeeping?.status === 'review'
        ? recordKeeping.reviewCount
        : null;
    setNewCount(count);
    setUpdatedStatus(status);
  }, [lesson, newCount, updatedStatus]);

  return (
    <div ref={setReferenceElement} className="tw-mr-[8px] last:tw-mr-0">
      <div
        className={`
          tw-h-[39px]
          tw-flex
          tw-justify-center
          tw-items-center
          tw-text-center
          tw-text-lg-regular
          tw-rounded-sm
          tw-select-none
          tw-w-[39px]
          ${
            updatedStatus == undefined
              ? 'tw-border tw-border-solid tw-border-secondary'
              : ['practicing', 'review'].includes(updatedStatus)
              ? 'tw-border tw-border-solid'
              : ''
          }
        `}
        style={{
          color:
            newCount && newCount >= focusConstants.alert && updatedStatus != 'acquired'
              ? '#fff'
              : updatedStatus === 'acquired'
              ? colorStyle.regular
              : ['practicing', 'review'].includes(updatedStatus!)
              ? colorStyle.dark
              : '#fff',
          borderColor: updatedStatus === 'practicing' || updatedStatus === 'review' ? colorStyle.dark : undefined,
          backgroundColor:
            newCount && newCount >= focusConstants.alert && updatedStatus != 'acquired'
              ? colorStyle.alertColor
              : updatedStatus === 'planned'
              ? colorStyle.veryLight
              : ['practicing', 'review'].includes(updatedStatus!)
              ? colorStyle.medium
              : updatedStatus === 'acquired'
              ? colorStyle.semiLight
              : '#F3F4F6',
          backgroundImage: updatedStatus === 'review' ? `url(${colorStyle.reviewBgImage})` : 'none',
          backgroundPosition: 'center',
          backgroundSize: '30px',
          backgroundRepeat: 'no-repeat',
        }}
        // {...onLongPressFn}
        // onContextMenu={(event) => {
        //   handleOpenContextMenu(event);
        //   setLessonId(lesson?.id);
        // }}
        ref={buttonRef}
      >
        <span>
          {updatedStatus === 'acquired' && newCount === 0
            ? 0
            : updatedStatus === 'practicing' && newCount == 0
            ? '--'
            : updatedStatus !== 'planned' && newCount}
        </span>
      </div>
    </div>
  );
}

export default LessonBoxFunction;
