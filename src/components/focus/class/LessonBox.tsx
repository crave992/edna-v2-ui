import { FC, useEffect, useState, MouseEvent, useRef } from 'react';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { isMobile } from 'react-device-detect';
import LessonDto from '@/dtos/LessonDto';
import { useFocusContext } from '@/context/FocusContext';
import LessonPopover from '@/components/focus/student/LessonPopover';
import focusConstants from '@/constants/focusConstants';
import { usePopover } from '@/hooks/usePopover';
import { useAssignNextLessonToStudent } from '@/hooks/useAssignNextLessonToStudent';
import { useSaveNote } from '@/hooks/useSaveNote';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { useDeleteLesson } from '@/hooks/useDeleteLesson';
import useLongPress from '@/hooks/useLongPress';

interface LessonBoxProps {
  sequenceNumber: number | null;
  levelId: number | undefined;
  classId: number | undefined;
  lessonId: number | undefined;
  lesson: LessonDto | undefined;
  studentId: number | undefined;
  areaName: string;
  onDecrement: () => void;
  sequence: string | undefined;
}

const LessonBox: FC<LessonBoxProps> = ({
  sequenceNumber,
  levelId,
  classId,
  lessonId,
  lesson,
  studentId,
  areaName,
  sequence,
}) => {
  const { currentUserRoles, setLessonId, setStudentId, openAddNoteOrMilestone, setOpenAddNoteOrMilestone } =
    useFocusContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const {
    referenceElement,
    setReferenceElement,
    popperElement,
    setPopperElement,
    setPopperPlacement,
    popOverStyles,
    popOverAttributes,
  } = usePopover('lessonBox');
  const [newCount, setNewCount] = useState<number | null | undefined>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string | undefined>(undefined);
  const colorStyle = lessonTypeColors[areaName] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#EAECF0',
    medium: '#D0D5DD',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
    reviewBgImage: '/images/revisited-unknown.svg',
  };

  const addNextLessonMutation = useAssignNextLessonToStudent({
    studentId,
    classId,
    lessonId: lesson?.id,
    sequence: lesson?.sequenceNumber,
    levelId,
  });
  const touchTimer = useRef<NodeJS.Timeout>();

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId,
    levelId,
    areaId: lesson?.area?.id,
    topicId: lesson?.topic?.id,
    handleSuccess: (data, error, variables) => {
      // const updatedCount = (Number(newCount) || 0) + 1;
      // if (variables.status == 'review') {
      //   setUpdatedStatus(variables.status);
      // } else if (updatedStatus !== undefined) {
      //   setNewCount(updatedCount);
      //   setUpdatedStatus(variables.status);
      // } else {
      //   setUpdatedStatus('planned');
      // }
    },
  });

  const deleteLessonMutation = useDeleteLesson({
    studentId,
    classId,
    lessonId,
    levelId,
    areaId: lesson?.area?.id,
    topicId: lesson?.topic?.id,
  });

  const removeFromPlanned = () => {
    deleteLessonMutation.mutate();
  };

  const addNextLesson = () => {
    addNextLessonMutation.mutate();
  };

  const incrementCount = () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      updateLessonStateMutation.mutate({
        status: updatedStatus,
        order: lesson.recordKeepings[0].order,
        actionDate: new Date().toISOString(),
        count: (newCount || 0) + 1,
        reReview: false,
      });
    }
  };

  const startPracticing = async () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      updateLessonStateMutation.mutate({
        status: 'practicing',
        order: 0,
        actionDate: new Date().toISOString(),
        count: 0,
        reReview: false,
      });
    }
  };

  const assignLesson = () => {
    updateLessonStateMutation.mutate({
      status: 'planned',
      order: 0,
      actionDate: new Date().toISOString(),
      count: 0,
      reReview: false,
    });
  };

  const buttonRef = useRef<HTMLDivElement | null>(null);

  const onLongPressFn = useLongPress(
    {
      onLongPress() {
        if (isMobile && updatedStatus !== undefined) {
          // setLessonId(lesson.id);
          // setIsPopoverOpen(true);
        }
      },
      onTouchRightClick(event: any) {
        // setLessonId(lesson?.id);
        // setIsPopoverOpen(true);
      },
      onDbClick(event: any) {
        event.preventDefault();
        if (updatedStatus !== undefined) {
          if (event.button == 0 && !isMobile) {
            setStudentId(studentId);
            setLessonId(lesson?.id);
            setOpenAddNoteOrMilestone('note');
          }
          if (isMobile) {
            setStudentId(studentId);
            setLessonId(lesson?.id);
            setIsPopoverOpen(true);
          }
        }
      },
      onClick(event: any) {
        if (event.button == 0) {
          //left click
          event.preventDefault();
          triggerPracticeOrIncrement();
        }
      },
    },
    { shouldPreventDefault: false }
  );

  const triggerPracticeOrIncrement = () => {
    if (!currentUserRoles?.canUpdateLesson) {
      if (currentUserRoles?.isAssociateGuide && updatedStatus && updatedStatus != 'planned') {
        //only increment count
        setLessonId(lesson?.id);
        incrementCount();
      }
    } else {
      setLessonId(lesson?.id);
      if (updatedStatus === undefined) {
        if (currentUserRoles?.isStaff) {
          console.log('isStaff');
          if (!currentUserRoles?.isLeadGuide && !currentUserRoles?.isSpecialist) return;
        }
        console.log('assignLesson');
        assignLesson();
      } else if (updatedStatus === 'planned') {
        console.log('startPracticing');
        startPracticing();
      } else {
        console.log('incrementCount');
        incrementCount();
      }
    }
  };

  const handleOpenContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (updatedStatus !== undefined) {
      setStudentId(studentId);
      setLessonId(lessonId);
      setIsPopoverOpen(true);
    }
  };

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
    <div ref={setReferenceElement} className={`tw-mr-[8px] last:tw-mr-0`}>
      <div
        className={`
          tw-cursor-pointer
          tw-h-[60px]
          tw-flex
          tw-justify-center
          tw-items-center
          tw-text-center
          tw-text-3xl
          tw-rounded-md
          tw-select-none
          tw-w-[170px]
          ${(updatedStatus === 'practicing' || updatedStatus === 'review') && 'tw-border-[2px] tw-border-solid'}
        `}
        style={{
          color:
            newCount && newCount >= focusConstants.alert && updatedStatus != 'acquired'
              ? '#fff'
              : updatedStatus === 'acquired'
              ? colorStyle.regular
              : updatedStatus === 'practicing' || updatedStatus === 'review'
              ? colorStyle.dark
              : '#fff',
          borderColor: updatedStatus === 'practicing' || updatedStatus === 'review' ? colorStyle.dark : undefined,
          backgroundColor:
            newCount && newCount >= focusConstants.alert && updatedStatus != 'acquired'
              ? colorStyle.alertColor
              : updatedStatus === 'planned'
              ? colorStyle.veryLight
              : updatedStatus === 'practicing' || updatedStatus === 'review'
              ? colorStyle.medium
              : updatedStatus === 'acquired'
              ? colorStyle.semiLight
              : '#F3F4F6',
          backgroundImage: updatedStatus === 'review' ? `url(${colorStyle.reviewBgImage})` : 'none',
          backgroundPosition: 'center',
          backgroundSize: '45px',
          backgroundRepeat: 'no-repeat',
        }}
        {...onLongPressFn}
        onContextMenu={(event) => {
          handleOpenContextMenu(event);
          setLessonId(lesson?.id);
        }}
        ref={buttonRef}
      >
        <span>
          {updatedStatus === 'acquired' && newCount === 0
            ? 0
            : updatedStatus === 'practicing' && (newCount == 0 || newCount == null)
            ? '--'
            : updatedStatus !== 'planned' && newCount}
        </span>
      </div>

      {/* <AddNoteorMilestone
        showModal={openAddNoteOrMilestone}
        setShowModal={setOpenAddNoteOrMilestone}
        name={lesson?.name!}
        studentId={studentId ?? 0}
        levelId={levelId!}
        classId={classId!}
        lesson={lesson!}
        lessonState={updatedStatus ?? ''}
        updateLessonStateMutation={updateLessonStateMutation}
      /> */}

      {isPopoverOpen && (
        <LessonPopover
          noteType={openAddNoteOrMilestone}
          onAddNextLesson={sequenceNumber != null && sequenceNumber > 0 ? addNextLesson : null}
          lesson={lesson}
          classId={classId}
          levelId={levelId}
          onClose={() => setIsPopoverOpen(false)}
          onRemoveFromPlanned={removeFromPlanned}
          onDecrement={() => setNewCount(newCount && newCount - 1)}
          setShowNotes={setOpenAddNoteOrMilestone}
          popperRef={setPopperElement}
          popperElementRef={popperElement}
          popperStyle={popOverStyles.popper}
          popperAttributes={popOverAttributes.popper}
          sequence={sequence}
          parentRef={referenceElement}
        />
      )}
    </div>
  );
};

export default LessonBox;
