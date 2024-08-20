import { useFocusContext } from '@/context/FocusContext';
import LessonDto from '@/dtos/LessonDto';
import Link from 'next/link';
import { FC, useEffect, useMemo, useState, Dispatch, SetStateAction, CSSProperties, useRef } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@mantine/hooks';
import { RecordKeepingHistoryDto } from '@/dtos/RecordKeepingDto';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { AnimatePresence, motion } from 'framer-motion';
import AnnotationPlusIcon from '@/components/svg/AnnotationPlus';
import { CameraPlusIcon } from '@/components/svg/CameraPlus';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import dayjs from 'dayjs';
import HistoryNote from '@/components/focus/student/HistoryNote';

interface LessonPopoverProps {
  lesson: LessonDto | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  onAddNextLesson: (() => void) | null;
  onClose: () => void;
  onRemoveFromPlanned: () => void;
  onDecrement?: () => void;
  noteType: string | undefined;
  setShowNotes: (noteType: string | undefined) => void;
  popperRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  popperElementRef: HTMLDivElement | null;
  popperStyle: CSSProperties;
  popperAttributes: { [key: string]: string } | undefined;
  sequence: string | undefined;
  parentRef?: HTMLDivElement | null;
}

interface ButtonProps {
  title: string;
  imageSrc?: string;
  onClick?: () => void;
}

const PopoverButton: FC<ButtonProps> = ({ title, imageSrc, onClick }) => (
  <div className="tw-pt-xs tw-px-sm">
    <button
      className="tw-p-9px tw-px-10px tw-space-x-md tw-border-0 tw-bg-white tw-text-sm-medium tw-text-secondary tw-text-left tw-w-full tw-spacing-md hover:tw-bg-secondary tw-rounded-sm"
      onClick={onClick}
    >
      <Image src={imageSrc!} alt={title} width={16} height={16} priority />
      <span>{title}</span>
    </button>
  </div>
);

const LessonPopover: FC<LessonPopoverProps> = ({
  lesson,
  classId,
  levelId,
  onAddNextLesson,
  onClose,
  onRemoveFromPlanned,
  onDecrement,
  popperRef,
  popperStyle,
  popperAttributes,
  popperElementRef,
  sequence,
  parentRef,
}) => {
  const { currentUserRoles, studentId, setLessonId, setOpenAddNoteOrMilestone, setSelectedLessonState, organization } =
    useFocusContext();
  const [newCount, setNewCount] = useState<number | null | undefined>(null);
  const [updatedStatus, setUpdatedStatus] = useState<string | undefined>(undefined);
  const [showNoteHistory, setShowNoteHistory] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const heightRef = useRef<HTMLDivElement | null>(null);
  const [openStatuses, setOpenStatuses] = useState<Record<string, boolean>>({});

  useClickOutside(() => onClose(), null, [popperElementRef, parentRef ? parentRef : null]);
  const toggleStatus = (status: string) => {
    if (status !== 'planned' && status !== 'presented') {
      setOpenStatuses((prev) => ({ ...prev, [status]: !prev[status] }));
    }
  };

  const handleLinkClick = () => setLessonId(lesson?.id || undefined);
  const allHistory = useMemo(() => {
    var recordKeepings = lesson?.recordKeepings?.filter((r) => {
      return r.studentId == studentId;
    });

    const recordKeeping = recordKeepings?.[0];

    var history: RecordKeepingHistoryDto[] | null = [];

    if (recordKeeping) {
      history = recordKeeping.history;
    }

    return history;
  }, [lesson]);

  useEffect(() => {
    const data = getCountAndStatus();
    setNewCount(data.count);
    setUpdatedStatus(data.status);
  }, [lesson]);

  const getCountAndStatus = () => {
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
    return { count, status };
  };

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId: lesson?.id,
    levelId,
    areaId: lesson?.area.id,
    topicId: lesson?.topic.id,
    handleSuccess: (data, error, variables) => {
      if (variables.actionType === 'decrementCount' && onDecrement) {
        onDecrement();
      }
    },
  });

  const decrementCount = () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      if (updatedStatus && newCount && newCount > 0) {
        updateLessonStateMutation.mutate({
          status: updatedStatus,
          order: -1, //means don't update order
          actionDate: new Date().toISOString(),
          count: newCount - 1,
          actionType: 'decrementCount',
          reReview: false,
        });
      }
    }
  };

  const markAcquired = () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      const data = getCountAndStatus();
      updateLessonStateMutation.mutate({
        status: 'acquired',
        order: 0, //means don't update order
        actionDate: new Date().toISOString(),
        count: data.count ?? 1,
        reReview: false,
      });
    }
    onClose();
  };

  const markReview = () => {
    if (lesson && lesson.recordKeepings && lesson.recordKeepings[0]) {
      const data = getCountAndStatus();
      updateLessonStateMutation.mutate({
        status: 'review',
        order: 0, //means don't update order
        actionDate: new Date().toISOString(),
        count: 1,
        reReview: data.status == 'review',
      });
    }
    onClose();
  };

  const handleOpenNotes = (type: 'milestone' | 'note') => {
    const data = getCountAndStatus();
    setSelectedLessonState(data.status!);
    setOpenAddNoteOrMilestone(type);
    onClose();
  };

  const renderHistory = () => {
    if (!allHistory) return null;

    const groupedHistory = allHistory.reduce((acc, historyEntry) => {
      var status = '';

      if (historyEntry.status == 'practicing' && historyEntry.count == 0) {
        status = 'presented';
      } else {
        status = historyEntry.status;
      }

      if (!acc[status]) {
        acc[status] = [];
      }

      acc[status].push(historyEntry);
      return acc;
    }, {} as Record<string, RecordKeepingHistoryDto[]>);

    Object.keys(groupedHistory).forEach((status) => {
      groupedHistory[status].sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
    });

    const orderedStatuses = ['acquired', 'review', 'practicing', 'presented', 'planned'];

    return orderedStatuses.map((status) => {
      const entries = groupedHistory[status];

      if (!entries) return null;

      const latestEntry = entries.reduce((latest: any, entry: RecordKeepingHistoryDto) => {
        return latest ? (new Date(entry.createdOn) > new Date(latest.createdOn) ? entry : latest) : entry;
      }, null);

      const latestDate = latestEntry ? dayjs(latestEntry.createdOn) : null;
      const latestTime = latestDate
        ? latestDate.isSame(dayjs(), 'day')
          ? latestDate.format('h:mma')
          : latestDate.format('MM/DD/YY h:mma')
        : '';

      const isOpenNote = openStatuses[status];

      return (
        <div key={status} onClick={() => toggleStatus(status)}>
          <div className="tw-border tw-border-solid tw-border-secondary tw-bg-secondary tw-rounded-xl">
            <div className={`tw-flex tw-justify-between tw-p-lg ${isOpenNote && 'tw-hr'}`}>
              <div
                className={`tw-text-md-medium ${
                  isOpenNote ? 'tw-text-secondary' : 'tw-text-tertiary'
                } tw-flex tw-items-center tw-gap-xs`}
              >
                {status === 'presented'
                  ? 'Presented'
                  : status === 'practicing'
                  ? 'Practiced'
                  : status === 'review'
                  ? 'Represented'
                  : status === 'acquired'
                  ? `${organization?.termInfo?.acquired ?? 'Acquired'}`
                  : capitalizeFirstLetter(status)}
              </div>
              <div
                className={`tw-flex tw-items-center tw-text-sm-regular ${
                  isOpenNote ? 'tw-text-secondary' : 'tw-text-tertiary'
                } tw-truncate`}
              >
                {latestTime}
              </div>
            </div>
            {!isOpenNote && latestEntry && status !== 'presented' && status !== 'planned' && (
              <div className="tw-pt-0 tw-px-lg tw-pb-lg tw-space-y-lg">
                <HistoryNote
                  key={latestEntry.id}
                  historyEntry={latestEntry}
                  displayDate={false}
                  isOpenNote={isOpenNote}
                />
              </div>
            )}
            {isOpenNote && (
              <div className="tw-p-lg tw-space-y-lg">
                {entries.map((historyEntry, index) =>
                  status === 'acquired' && index === 0 ? (
                    groupedHistory['practicing'] && groupedHistory['review'] ? (
                      <>
                        <HistoryNote
                          key={historyEntry.id}
                          historyEntry={
                            new Date(groupedHistory['practicing'][0].actionDate) >
                            new Date(groupedHistory['review'][0].actionDate)
                              ? groupedHistory['practicing'][0]
                              : groupedHistory['review'][0]
                          }
                          isOpenNote={isOpenNote}
                        />
                        <HistoryNote
                          key={historyEntry.id}
                          historyEntry={
                            new Date(groupedHistory['practicing'][0].actionDate) <
                            new Date(groupedHistory['review'][0].actionDate)
                              ? groupedHistory['practicing'][0]
                              : groupedHistory['review'][0]
                          }
                          isOpenNote={isOpenNote}
                        />
                      </>
                    ) : (
                      <HistoryNote key={historyEntry.id} historyEntry={historyEntry} isOpenNote={isOpenNote} />
                    )
                    
                  ) : status === 'acquired' ? (
                    <></>
                  ) : (
                    <HistoryNote key={historyEntry.id} historyEntry={historyEntry} isOpenNote={isOpenNote} />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const handleRemoveFromPlanned = () => {
    onRemoveFromPlanned();
    onClose();
  };

  const handleShowNotesHistory = () => {
    if (showDescription) {
      setShowDescription(false);
      setTimeout(() => {
        setShowNoteHistory(!showNoteHistory);
      }, 500);
    } else {
      setShowNoteHistory(!showNoteHistory);
    }
  };

  const handleShowDescription = () => {
    if (showNoteHistory) {
      setShowNoteHistory(false);
      setTimeout(() => {
        setShowDescription(!showDescription);
      }, 500);
    } else {
      setShowDescription(!showDescription);
    }
  };

  return (
    <>
      <div
        className="tw-bg-transparent tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-[99]"
        onClick={() => onClose()}
      />
      <div
        className="tw-m-2 tw-absolute tw-rounded-xl tw-bg-white tw-px-0 tw-shadow-md tw-z-[100] tw-border tw-border-solid tw-border-primary"
        ref={popperRef}
        style={popperStyle}
        {...popperAttributes}
      >
        <div className="tw-flex tw-flex-row tw-max-h-[498px]" ref={heightRef}>
          <div
            className={`tw-w-[249px] tw-basis-[249px] tw-grow-0 tw-shrink-0 tw-max-w-[249px]  tw-border-0 tw-border-solid tw-border-secondary ${
              (showNoteHistory || showDescription) && 'tw-border-r'
            }`}
          >
            <div className="tw-p-lg tw-flex tw-gap-md tw-hr">
              <div className="tw-w-[108px] tw-h-[80px] tw-bg-secondary hover:tw-bg-secondary-hover tw-rounded-xl tw-border tw-border-solid tw-border-secondary tw-cursor-pointer">
                <div
                  className="tw-p-lg tw-flex tw-flex-col tw-items-center tw-justify-center"
                  onClick={() => handleOpenNotes('note')}
                >
                  <AnnotationPlusIcon size="32" />
                  <div className="tw-text-sm-medium tw-text-secondary">Note</div>
                </div>
              </div>
              <div className="tw-w-[108px] tw-h-[80px] tw-bg-secondary hover:tw-bg-secondary-hover tw-rounded-xl tw-border tw-border-solid tw-border-secondary tw-cursor-pointer">
                <div
                  className="tw-p-lg tw-flex tw-flex-col tw-items-center tw-justify-center"
                  onClick={() => handleOpenNotes('milestone')}
                >
                  <CameraPlusIcon size="32" />
                  <div className="tw-text-sm-medium tw-text-secondary">Milestone</div>
                </div>
              </div>
            </div>
            <div className="tw-hr tw-pb-xs">
              {updatedStatus === 'planned' && currentUserRoles?.canUpdateLesson && (
                <PopoverButton
                  title="Remove from Planned"
                  imageSrc="/images/eraser.svg"
                  onClick={() => handleRemoveFromPlanned()}
                />
              )}
              {updatedStatus !== 'planned' &&
                Number(newCount) > 1 &&
                (currentUserRoles?.canUpdateLesson || currentUserRoles?.isAssociateGuide) && (
                  <PopoverButton
                    title={`Reduce ${
                      updatedStatus == 'practicing'
                        ? 'Practice'
                        : updatedStatus == 'acquired'
                        ? 'Acquire'
                        : updatedStatus == 'review'
                        ? 'Review'
                        : ''
                    } Count`}
                    imageSrc="/images/eraser.svg"
                    onClick={decrementCount}
                  />
                )}
              <PopoverButton title="View History" imageSrc="/images/historyicon.svg" onClick={handleShowNotesHistory} />
              <PopoverButton title="View Description" imageSrc="/images/file-05.svg" onClick={handleShowDescription} />
              <Link href="/focus/lesson?openInLessonView=true" onClick={handleLinkClick}>
                <PopoverButton title="Open in Lesson View" imageSrc="/images/eye.svg" />
              </Link>
            </div>
            <div className="last:tw-pb-lg">
              {onAddNextLesson != null &&
              currentUserRoles?.canUpdateLesson &&
              (currentUserRoles?.isStaff
                ? (currentUserRoles?.hasAdminRoles ? currentUserRoles?.isLeadGuide : true) ||
                  currentUserRoles?.isSpecialist
                : true) ? (
                <PopoverButton
                  title="Plan Next Lesson"
                  imageSrc="/images/file-plus-02.svg"
                  onClick={() => {
                    onAddNextLesson();
                    onClose();
                  }}
                />
              ) : (
                ''
              )}
              {updatedStatus !== 'planned' &&
                currentUserRoles?.canUpdateLesson &&
                (currentUserRoles?.isStaff
                  ? (currentUserRoles?.hasAdminRoles ? currentUserRoles?.isLeadGuide : true) ||
                    currentUserRoles?.isSpecialist
                  : true) && (
                  <PopoverButton title="Re-Present Lesson" imageSrc="/images/refresh-ccw-03.svg" onClick={markReview} />
                )}
              {updatedStatus !== 'planned' &&
                updatedStatus !== 'acquired' &&
                currentUserRoles?.canUpdateLesson &&
                (currentUserRoles?.isStaff
                  ? (currentUserRoles?.hasAdminRoles ? currentUserRoles?.isLeadGuide : true) ||
                    currentUserRoles?.isSpecialist
                  : true) && (
                  <PopoverButton
                    title={`Mark ${organization?.termInfo?.acquired ?? 'Acquired'}`}
                    imageSrc="/images/check-square-broken.svg"
                    onClick={markAcquired}
                  />
                )}
            </div>
          </div>
          <AnimatePresence>
            {showNoteHistory && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                exit={{ width: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className=""
              >
                <div
                  style={{
                    height: heightRef.current?.getBoundingClientRect().height,
                    maxHeight: heightRef.current?.getBoundingClientRect().height,
                  }}
                  className={`${
                    showNoteHistory ? 'tw-rounded-r-xl' : 'tw-border-r'
                  } tw-overflow-hidden tw-border-0 tw-border-solid tw-border-secondary tw-h-full`}
                >
                  <div className="tw-max-h-[442px] tw-w-[300px] tw-h-full tw-overflow-y-scroll custom-thin-scrollbar tw-space-y-xl tw-py-lg tw-pl-xl tw-pr-md tw-bg-white tw-min-h-[184px]">
                    {renderHistory()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 241 }}
                exit={{ width: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className=""
              >
                <div
                  style={{
                    height: heightRef.current?.getBoundingClientRect().height,
                    maxHeight: heightRef.current?.getBoundingClientRect().height,
                  }}
                  className="tw-w-full tw-h-full tw-overflow-hidden"
                >
                  <div
                    className={`tw-rounded-r-xl tw-max-h-[398px] tw-w-[241px] tw-h-full tw-flex tw-flex-wrap tw-overflow-y-scroll custom-thin-scrollbar tw-py-lg tw-px-xl tw-bg-secondary tw-min-h-[184px]`}
                  >
                    <div>
                      <div className="tw-w-[199px]">
                        <div className="tw-h-[18px] tw-flex tw-flex-nowrap tw-items-center tw-space-x-xs">
                          {sequence && (
                            <div className="tw-text-xs-medium tw-rounded-[4px] tw-px-xs tw-py-0 tw-bg-gray-modern-100">
                              {sequence}
                            </div>
                          )}
                          <div className="tw-truncate tw-p-0 tw-text-xs-medium tw-text-gray-modern-700">
                            {lesson?.topic.name}
                          </div>
                        </div>
                        <div className="tw-py-sm tw-text-sm-regular tw-text-gray-modern-900">{lesson?.name}</div>
                        <div className="tw-text-xs-regular tw-text-gray-modern-950">{lesson?.description}</div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default LessonPopover;
