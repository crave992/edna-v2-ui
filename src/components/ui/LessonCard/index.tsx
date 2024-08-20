import LoadingSpinner from '@/components/svg/LoadingSpinner';
import focusConstants from '@/constants/focusConstants';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { useFocusContext } from '@/context/FocusContext';
import LessonDto from '@/dtos/LessonDto';
import useLongPress from '@/hooks/useLongPress';
import { useEffect, useState, useMemo } from 'react';
import LessonPopover from '@/components/focus/student/LessonPopover';
import { isMobile } from 'react-device-detect';
import { usePopover } from '@/hooks/usePopover';
import { useAssignNextLessonToStudent } from '@/hooks/useAssignNextLessonToStudent';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { useDeleteLesson } from '@/hooks/useDeleteLesson';

interface LessonCardProps {
  lesson: LessonDto;
  classId: number;
  levelId: number;
  sequence: string | undefined;
  name: string;
  description: string;
  lessonType: string;
  isDecremented: boolean;
  setDecremented: (isDecremented: boolean) => void;
  onDecrement: () => void;
  css?: string;
  expanded?: boolean;
  fromStudentStatus?: string;
}

export default function LessonCard({
  lesson,
  classId,
  levelId,
  name,
  sequence,
  description,
  lessonType,
  isDecremented,
  setDecremented,
  onDecrement,
  css = '',
  expanded,
  fromStudentStatus,
}: LessonCardProps) {
  const { currentUserRoles, lessonId, setLessonId, studentId, openAddNoteOrMilestone, setOpenAddNoteOrMilestone } =
    useFocusContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [removed, setIsRemoved] = useState(false);
  const { referenceElement, setReferenceElement, popperElement, setPopperElement, popOverStyles, popOverAttributes } =
    usePopover("lessonCard");

  const addNextLessonMutation = useAssignNextLessonToStudent({
    studentId,
    classId,
    lessonId: lesson.id,
    sequence: lesson.sequenceNumber,
    levelId,
  });
  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId: lesson.id,
    levelId,
    areaId: lesson.area.id,
    topicId: lesson.topic.id,
    fromStudent: fromStudentStatus ? true : false,
  });

  const deleteLessonMutation = useDeleteLesson({
    studentId,
    classId,
    lessonId: lesson.id,
    levelId,
    areaId: lesson.area.id,
    topicId: lesson.topic.id,
  });

  const colorScheme = lessonTypeColors[lessonType] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#F2F4F7',
    medium: '#98A2B3',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
  };
  const { veryDark, dark, light, medium, alertColor, reviewBgImage, completedBgImage } = colorScheme;

  const removeFromPlanned = () => {
    setIsRemoved(true);
    deleteLessonMutation.mutate();
  };

  const incrementCount = () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      updateLessonStateMutation.mutate({
        status: updatedStatus,
        order: lesson.recordKeepings[0].order,
        actionDate: new Date().toISOString(),
        count: newCount ? newCount + 1 : 1,
        reReview: false,
      });
    }
  };

  const startPracticing = () => {
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

  const addNextLesson = () => {
    addNextLessonMutation.mutate();
  };

  useEffect(() => {
    if (isDecremented && lessonId == lesson.id) {
      //setNewCount(newCount && newCount - 1);
      setDecremented(false);
    }
  }, [isDecremented]);

  const onLongPressFn = useLongPress(
    {
      onLongPress(event: any) {
        if (isMobile) {
        }
      },
      onDbClick(event: any) {
        event.preventDefault();
        if (event.button == 0 && !isMobile) {
          setLessonId(lesson.id);
          setOpenAddNoteOrMilestone('note');
        }
        if (isMobile) {
          setLessonId(lesson.id);
          setIsPopoverOpen(true);
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
      if (currentUserRoles?.isAssociateGuide && updatedStatus != 'planned') {
        incrementCount();
      }
    } else {
      if (updatedStatus === 'planned') {
        startPracticing();
      } else {
        incrementCount();
      }
    }
  };

  const [newCount, updatedStatus, hasAlert] = useMemo(() => {
    let newCount = null;
    let updatedStatus = undefined;
    let hasAlert = false;

    if (lesson && lesson.recordKeepings && lesson.recordKeepings.length === 1) {
      const recordKeeping = lesson.recordKeepings[0];
      const status = recordKeeping.status ? recordKeeping.status : undefined;

      switch (status) {
        case 'practicing':
          newCount = recordKeeping.practiceCount == 0 ? 0 : recordKeeping.practiceCount;
          break;
        case 'acquired':
          newCount = recordKeeping.acquiredCount;
          break;
        case 'review':
          newCount =
            fromStudentStatus && (!recordKeeping.reviewCount || recordKeeping.reviewCount === 0)
              ? 1
              : recordKeeping.reviewCount;
          break;
        default:
          newCount = recordKeeping.practiceCount ?? recordKeeping.acquiredCount ?? recordKeeping.reviewCount;
      }
      updatedStatus = status;
      hasAlert = newCount !== null && newCount >= focusConstants.alert && updatedStatus !== 'acquired';
    }

    return [newCount, updatedStatus, hasAlert];
  }, [lesson]);

  const handleOpenContextMenu = (event: any) => {
    event.preventDefault();
    setLessonId(lesson.id);
    setIsPopoverOpen(true);
  };

  const onClose = () => {
    setIsPopoverOpen(false);
  };

  return (
    <>
      <div
        className={`tw-relative tw-flex tw-flex-row tw-h-[87px] tw-select-none lessonCard ${
          updatedStatus === 'planned' ? 'tw-min-w-[170px]' : expanded ? 'tw-w-[257px]' : 'tw-w-full'
        } ${removed && 'tw-hidden'} ${css}`}
        {...onLongPressFn}
        onContextMenu={(event) => {
          handleOpenContextMenu(event);
          setLessonId(lesson?.id);
        }}
        ref={setReferenceElement}
      >
        <div
          style={{ backgroundColor: light, borderColor: dark }}
          className={`tw-px-lg tw-py-10px tw-cursor-pointer tw-flex tw-flex-col tw-space-y-sm
            ${lesson.isCustom ? 'tw-border-dashed' : 'tw-border-solid'} 
            ${isPopoverOpen ? 'tw-border-[2px]' : 'tw-border-[1.5px]'}
            ${
              updatedStatus === 'planned'
                ? 'tw-rounded-md tw-w-[170px]'
                : 'tw-rounded-l-md tw-border-r-0 tw-min-w-[121px] tw-w-full'
            }
          `}
        >
          <div className="tw-h-[18px] tw-flex tw-flex-nowrap tw-items-center tw-space-x-xs">
            {sequence && (
              <div
                style={{ color: dark, backgroundColor: medium }}
                className="tw-text-xs-medium tw-rounded-[4px] tw-px-xs tw-py-0"
              >
                {sequence}
              </div>
            )}
            <div style={{ color: dark }} className="tw-truncate tw-p-0 tw-text-xs-medium">
              {name}
            </div>
          </div>
          <div className="tw-line-clamp-2 tw-text-sm-regular" style={{ color: veryDark }}>
            {description}
          </div>
        </div>
        {updatedStatus !== 'planned' && (
          <div
            onContextMenu={(event) => handleOpenContextMenu(event)}
            style={{
              color: dark,
              borderColor: dark,
              backgroundColor: hasAlert ? alertColor : medium,
              backgroundImage:
                updatedStatus === 'acquired'
                  ? `url(${completedBgImage})`
                  : updatedStatus === 'review'
                  ? `url(${reviewBgImage})`
                  : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            className={`
              tw-cursor-pointer
              tw-flex tw-min-w-[64px]
              ${lesson.isCustom ? 'tw-border-dashed' : 'tw-border-solid'}
              ${isPopoverOpen ? 'tw-border-[2px]' : 'tw-border-[1.5px]'}
              tw-justify-center
              tw-items-center
              tw-rounded-r-md
              tw-text-3xl
              tw-select-none
            `}
          >
            {deleteLessonMutation.isLoading ? (
              <div role="status">
                <LoadingSpinner />
              </div>
            ) : (
              <span className={`${hasAlert ? 'tw-text-white' : ''}`}>
                {updatedStatus === 'acquired' && newCount == 0
                  ? 0
                  : updatedStatus === 'practicing' && (newCount == 0 || newCount == null)
                  ? '--'
                  : Number(newCount)}
              </span>
            )}
          </div>
        )}
      </div>
      {isPopoverOpen && (
        <LessonPopover
          onAddNextLesson={sequence ? addNextLesson : null}
          lesson={lesson}
          classId={classId}
          levelId={levelId}
          onClose={() => onClose()}
          onRemoveFromPlanned={removeFromPlanned}
          onDecrement={onDecrement}
          noteType={openAddNoteOrMilestone}
          setShowNotes={() => setOpenAddNoteOrMilestone(openAddNoteOrMilestone)}
          popperRef={setPopperElement}
          popperElementRef={popperElement}
          popperStyle={popOverStyles.popper}
          popperAttributes={popOverAttributes.popper}
          sequence={sequence}
          parentRef={referenceElement}
        />
      )}
    </>
  );
}
