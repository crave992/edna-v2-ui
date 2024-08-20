import { useEffect, useMemo, useState, useRef, MouseEvent } from 'react';
import FocusLayout from '@/components/focus/Layout';
import { StudentBasicDto } from '@/dtos/StudentDto';
import Head from 'next/head';
import siteMetadata from '@/constants/siteMetadata';
import LessonDto from '@/dtos/LessonDto';
import focusConstants from '@/constants/focusConstants';
import SkeletonAvatar from '@/components/focus/student/SkeletonAvatar';
import SkeletonLesson from '@/components/focus/lesson/SkeletonLesson';
import { useFocusContext } from '@/context/FocusContext';
import Slider from '@/components/common/Slider';
import { isMobile } from 'react-device-detect';
import AddLesson from '@/components/ui/AddLesson';
import StudentFocusAvatar from '@/components/focus/student/StudentFocusAvatar';
import LessonOverview from '@/components/focus/student/LessonOverview';
import FocusHeader from '@/components/focus/common/Header';
import { useNavbarContext } from '@/context/NavbarContext';
import { useGetMargin } from '@/hooks/useGetMargin';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { DndContext, PointerSensor, TouchSensor, useSensor, DragOverlay, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { LessonItem } from './SortableLessonItem';
import SortableContainer from './SortableContainer';
import CustomButton from '@/components/ui/CustomButton';
import PlusIcon from '@/components/svg/PlusIcon';
import AddNoteorMilestone from '@/components/ui/AddNoteorMilestone';
import { useClassStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import { useStudentLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import ProgressView from '@/components/focus/progress/ProgressView';

type Status = 'planned' | 'practicing' | 'review' | 'acquired';

interface ActiveState {
  lesson: LessonDto | null;
  status: Status | string;
}

interface LessonsState {
  planned: LessonDto[];
  practicing: LessonDto[];
  review: LessonDto[];
  acquired: LessonDto[];
}

const StudentFocusPage = () => {
  const {
    studentId,
    setStudentId,
    areaId,
    setAreaId,
    topicId,
    setTopicId,
    classId,
    setClassId,
    levelId,
    setLevelId,
    lessonId,
    setLessonId,
    openLessonOverview,
    openProgress,
    currentUserRoles,
    openAddNoteOrMilestone,
    setOpenAddNoteOrMilestone,
    classes,
  } = useFocusContext();
  const { openSubNavbar } = useNavbarContext();
  const [showAddLesson, setShowAddLesson] = useState<boolean>(false);
  const studentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const getMargin = useGetMargin({ containerRef, widthRef });
  const statuses: Status[] = ['planned', 'practicing', 'review', 'acquired'];
  const [activeId, setActiveId] = useState<ActiveState>({ lesson: null, status: '' });
  const prevClassIdRef = useRef<number | undefined>(classId);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [items, setItems] = useState<LessonsState>({
    planned: [],
    practicing: [],
    review: [],
    acquired: [],
  });

  const { data: students, isLoading: isLoadingStudents } = useClassStudentsQuery({ classId: classId! });
  const { data: lessons, isLoading: isLoadingLessons } = useStudentLessonsQuery({
    levelId: levelId!,
    classId: classId!,
    studentId: studentId!,
  });

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     // Require the mouse to move by 10 pixels before activating
  //     activationConstraint: {
  //       distance: 10,
  //     },
  //   }),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );
  // Drag is disabled only if `userRole.isAssociateGuide` is true
  const isDragEnabled = currentUserRoles?.canUpdateLesson;

  // Initialize touch sensor with delay and tolerance for mobile
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 0,
    },
  });

  // Initialize pointer sensor with distance constraint for non-mobile
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 30,
    },
  });

  // Conditional sensors array based on the `isDragEnabled` flag
  // If drag is enabled, decide between touch or pointer sensor based on `isMobile`
  // If drag is not enabled, the sensors array is empty
  const sensors = useMemo(() => {
    if (!isDragEnabled) {
      return [];
    }
    return isMobile ? [touchSensor] : [pointerSensor];
  }, [isMobile, touchSensor, pointerSensor, isDragEnabled]);

  const handleDragStart = (event: any) => {
    const containerId = event.active.data.current.sortable.containerId as keyof LessonsState;
    const index = event.active.data.current.sortable.index;
    const lesson = items[containerId][index];
    setLessonId(event.active.id);
    setActiveId({
      lesson: lesson,
      status: event.active?.data?.current?.sortable?.containerId,
    });
  };

  const handleDragEnd = (event: any) => {
    // //New code without reordering
    const { active, over } = event;

    const activeContainer = active?.data?.current?.sortable?.containerId;
    let overContainer = over?.data?.current?.sortable?.containerId as keyof LessonsState;

    //happens when the destination does not contain any items.
    if (overContainer == undefined) {
      overContainer = over?.id;
    }

    if (
      (!activeContainer || !overContainer || activeContainer !== overContainer) &&
      !activeContainer &&
      overContainer
    ) {
      return;
    }
    const activeIndex = active?.data?.current?.sortable?.index;
    const overIndex = over?.data?.current?.sortable?.index;

    let updateCount: number | null = null;
    if (activeId.status === 'planned' && overContainer === 'practicing') {
      updateCount = 0;
    } else if (activeId.status === overContainer && overContainer === 'acquired') {
      updateCount =
        activeId.lesson && activeId?.lesson?.recordKeepings ? activeId?.lesson?.recordKeepings[0]?.acquiredCount : 1;
    } else if (activeId.status === overContainer && overContainer === 'practicing') {
      updateCount =
        activeId.lesson && activeId?.lesson?.recordKeepings ? activeId?.lesson?.recordKeepings[0]?.practiceCount : 0;
    } else if (activeId.status === 'review' && overContainer === 'acquired') {
      updateCount =
        activeId.lesson && activeId?.lesson?.recordKeepings ? activeId?.lesson?.recordKeepings[0]?.reviewCount : 1;
    } else if (activeId.status === 'practicing' && overContainer === 'acquired') {
      updateCount =
        activeId.lesson && activeId?.lesson?.recordKeepings ? activeId?.lesson?.recordKeepings[0]?.practiceCount : 1;
    } else if (activeId.status !== overContainer && overContainer !== 'acquired') {
      updateCount = 1;
    }

    const itemKey: keyof LessonsState = overContainer ? overContainer : activeContainer;
    let newArray = arrayMove(items[itemKey], activeIndex, overIndex);
    let newArrayRecord = newArray[overIndex]?.recordKeepings?.[0];

    let retainCount = 0;

    const localLesson = items[overContainer] ? items[overContainer][activeIndex] : null;

    if (localLesson) {
      switch (overContainer) {
        case 'practicing':
          if (
            localLesson.recordKeepings &&
            localLesson.recordKeepings[0].practiceCount &&
            localLesson.recordKeepings[0].practiceCount > 0
          )
            retainCount = localLesson.recordKeepings[0].practiceCount;
          break;
        case 'review':
          if (
            localLesson.recordKeepings &&
            localLesson.recordKeepings[0].reviewCount &&
            localLesson.recordKeepings[0].reviewCount > 0
          )
            retainCount = localLesson.recordKeepings[0].reviewCount;
          break;
        case 'acquired':
          if (
            localLesson.recordKeepings &&
            localLesson.recordKeepings[0].acquiredCount &&
            localLesson.recordKeepings[0].acquiredCount > 0
          )
            retainCount = localLesson.recordKeepings[0].acquiredCount;
          break;
      }
    }

    if (newArrayRecord && overContainer === 'review' && activeId.status !== overContainer)
      newArrayRecord.reviewCount = 1;
    else if (newArrayRecord && overContainer === 'acquired' && activeId.status !== overContainer)
      newArrayRecord.acquiredCount = retainCount;
    else if (newArrayRecord && overContainer === 'practicing' && activeId.status !== overContainer)
      newArrayRecord.practiceCount = 1;

    if (overContainer === activeId.status && overIndex === activeIndex) return;

    const updatedOrder =
      overIndex !== undefined && overIndex !== null && overContainer === activeId.status
        ? items[overContainer]?.[overIndex]?.recordKeepings?.[0]?.order ?? 0
        : overIndex !== undefined && overIndex !== null && overContainer !== activeId.status && overIndex > 0
        ? items[overContainer]?.[overIndex + 1]?.recordKeepings?.[0]?.order ??
          items[overContainer]?.[overIndex]?.recordKeepings?.[0]?.order! + 1
        : 0;
    console.log(updatedOrder);

    updateLessonStateMutation.mutate({
      status: activeContainer,
      order: updatedOrder,
      actionDate: new Date().toISOString(),
      count:
        activeId.status === 'planned' && overContainer === 'practicing' ? 0 : updateCount ? updateCount : retainCount,
      reReview: activeContainer == 'review',
      fromStudentLessonId: localLesson ? localLesson.id : activeId.lesson ? activeId.lesson.id : 0,
    });

    setItems((items) => ({
      ...items,
      [overContainer]: newArray,
    }));
    setActiveId({ lesson: null, status: '' });
  };

  const handleDragOver = (event: any) => {
    const { active, over, draggingRect } = event;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = active?.data?.current?.sortable?.containerId as keyof LessonsState;
    const overContainer = isNaN(Number(overId))
      ? (overId as keyof LessonsState)
      : (over?.data?.current?.sortable?.containerId as keyof LessonsState);

    if (currentUserRoles?.isAssociateGuide) return;
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }
    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      // Find the indexes for the items
      const activeIndex = active?.data?.current?.sortable?.index;
      const overIndex = over?.data?.current?.sortable?.index;
      let newIndex;

      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const sectionRefs = {
    planned: useRef<HTMLDivElement | null>(null),
    practicing: useRef<HTMLDivElement | null>(null),
    review: useRef<HTMLDivElement | null>(null),
    acquired: useRef<HTMLDivElement | null>(null),
  };

  // useEffect(() => {
  //   if (prevClassIdRef.current !== undefined) {
  //     if (classId !== prevClassIdRef.current) {
  //       setAreaId(undefined);
  //       setTopicId(undefined);
  //     }
  //   }
  //   prevClassIdRef.current = classId;

  //   if (classes && classes.length > 0) {
  //     if (classId == undefined) {
  //       setClassId(classes[0].id);
  //     }
  //     if (levelId == undefined) {
  //       setLevelId(classes[0].levelId);
  //     }
  //   }
  // }, [classes, classId, levelId]);

  const [sectionAlerts, setSectionAlerts] = useState<{ [key: string]: number }>({
    planned: 0,
    practicing: 0,
    review: 0,
    acquired: 0,
  });

  const toggleStudentSelection = (studentId: number) => {
    setStudentId(studentId);
    setSectionAlerts({
      planned: 0,
      practicing: 0,
      review: 0,
      acquired: 0,
    });
  };

  const onDecrement = () => {
    setTriggerDecrement(true);
  };

  const setDecremented = () => {
    setTriggerDecrement(false);
  };

  const [triggerDecrement, setTriggerDecrement] = useState<boolean>(false);
  const getLessonsByStatus = useMemo(
    () => (status: string) => {
      if (lessons) {
        let lessonsByStatus = lessons.filter((lesson: LessonDto) => {
          if (lesson.recordKeepings) {
            return lesson.recordKeepings.some((recordKeeping) => {
              return recordKeeping.status === status;
            });
          }
          return false;
        });

        if (areaId !== undefined) {
          lessonsByStatus = lessonsByStatus.filter((lesson: LessonDto) => lesson.area.id === areaId);
        }

        if (topicId !== undefined) {
          lessonsByStatus = lessonsByStatus.filter((lesson: LessonDto) => lesson.topic.id === topicId);
        }

        const sectionAlertCount = lessonsByStatus.filter((lesson: LessonDto) => {
          const recordKeeping = lesson.recordKeepings && lesson.recordKeepings[0];

          if (recordKeeping) {
            const practiceCount = recordKeeping.practiceCount || 0;
            const reviewCount = recordKeeping.reviewCount || 0;

            return status == 'practicing' && practiceCount >= focusConstants.alert
              ? true
              : status == 'review' && reviewCount >= focusConstants.alert
              ? true
              : false;
          }

          return false;
        }).length;

        if (sectionAlertCount !== sectionAlerts[status]) {
          setSectionAlerts((prevAlerts) => ({ ...prevAlerts, [status]: sectionAlertCount }));
        }

        lessonsByStatus.sort((a: LessonDto, b: LessonDto) => {
          // Compare by `order` first
          const recordKeepingA = a.recordKeepings && a.recordKeepings[0];
          const recordKeepingB = b.recordKeepings && b.recordKeepings[0];

          if (recordKeepingA && recordKeepingB) {
            if (recordKeepingA.order !== recordKeepingB.order) {
              return recordKeepingA.order - recordKeepingB.order;
            }
          }

          //console.log(a,b);

          // If `order` is equal, compare by `sequenceNumber`
          return a.sequenceNumber - b.sequenceNumber;
        });
        return { lessons: lessonsByStatus, alerts: sectionAlertCount };
      }

      return { lessons: [], alerts: 0 };
    },
    [lessons, areaId, topicId, sectionAlerts, triggerDecrement, onDecrement]
  );

  useEffect(() => {
    if (lessons) {
      setItems({
        planned: getLessonsByStatus('planned').lessons,
        practicing: [...getLessonsByStatus('practicing').lessons, ...getLessonsByStatus('presented').lessons],
        review: getLessonsByStatus('review').lessons,
        acquired: getLessonsByStatus('acquired').lessons,
      });
    }
  }, [lessons, topicId, areaId]);

  function RenderLessonCards(status: Status) {
    return (
      <div
        className={`tw-px-2xl tw-relative tw-py-lg tw-flex ${
          !expanded ? 'tw-flex-col tw-flex-wrap tw-w-full' : 'tw-flex-row tw-flex-wrap tw-gap-xl'
        }`}
      >
        <SortableContainer
          id={status}
          items={items[status]}
          status={status}
          classId={classId}
          levelId={levelId}
          isDecremented={triggerDecrement}
          setDecremented={setDecremented}
          onDecrement={onDecrement}
          expanded={expanded}
          setShowAddLesson={setShowAddLesson}
        />
      </div>
    );
  }
  const renderLessonCards = useMemo(() => RenderLessonCards, [getLessonsByStatus, triggerDecrement, onDecrement]);

  const handleShowAddLesson = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowAddLesson(true);
  };

  useEffect(() => {
    if (students) {
      const studentFind =
        students && students.length > 0 && students.find((student: StudentBasicDto) => studentId == student.id);
      setStudentId(studentFind == undefined ? students[0]?.id : studentFind.id);
      setSectionAlerts({
        planned: 0,
        practicing: 0,
        review: 0,
        acquired: 0,
      });
    }
  }, [students, areaId, topicId]);

  const handleExpandedClick = (status: keyof typeof sectionRefs) => {
    const sectionRef = sectionRefs[status];
    if (!expanded && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }, 100);
    }

    setExpanded(!expanded);
  };

  useEffect(() => {
    const slider = studentRef.current;

    const handleSliderMove = () => {
      const studentContainer = studentRef.current;
      if (studentContainer) {
        studentContainer.classList.remove('tw-px-2xl');
      }
    };

    slider?.addEventListener('sliderMove', handleSliderMove);

    return () => {
      slider?.removeEventListener('sliderMove', handleSliderMove);
    };
  }, []);

  useEffect(() => {
    const slider = columnsRef.current;

    const handleSliderMove = () => {
      const columnsContainer = columnsRef.current;
      if (columnsContainer && expanded) {
        columnsContainer.classList.remove('tw-px-4xl');
      }
    };

    slider?.addEventListener('sliderMove', handleSliderMove);

    return () => {
      slider?.removeEventListener('sliderMove', handleSliderMove);
    };
  }, [expanded]);

  // useEffect(() => {
  //   setAreaId(undefined);
  //   setTopicId(undefined);
  // }, []);

  const [screenWidth, setScreenWidth] = useState(0);
  const isSmallScreen = screenWidth < 1330;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId,
    levelId,
    fromStudent: true,
    areaId:
      lessons && lessons.length > 0 ? lessons?.find((lesson: LessonDto) => lesson.id === Number(lessonId))?.area.id : 0,
    topicId:
      lessons && lessons.length > 0
        ? lessons?.find((lesson: LessonDto) => lesson.id === Number(lessonId))?.topic.id
        : 0,
    handleSuccess: (data, error, variables) => {
      if (variables.actionType === 'decrementCount' && onDecrement) {
        onDecrement();
      }
    },
  });

  return (
    <>
      <Head>
        <title>{`Student Focus | ${siteMetadata.title}`}</title>
      </Head>
      <FocusLayout>
        <div className="tw-min-w-[1016px]">
          {openLessonOverview ? (
            <LessonOverview getMargin={getMargin} />
          ) : openProgress ? (
            <ProgressView />
          ) : (
            <div className="tw-space-y-xl">
              <div
                className="tw-mx-4xl tw-bg-white tw-border tw-border-solid tw-border-secondary tw-rounded-xl"
                ref={studentRef}
              >
                <Slider innerRef={studentRef} rootClass={'drag'} totalItems={students && students.length}>
                  <div
                    ref={studentRef}
                    className="tw-px-2xl tw-h-[118px] no-scroll md:no-scroll custom-scrollbar tw-flex tw-flex-row tw-items-center tw-overflow-y-hidden tw-overflow-x-scroll tw-select-none tw-space-x-lg"
                  >
                    {isLoadingStudents ? (
                      <SkeletonAvatar />
                    ) : (
                      students &&
                      students.length > 0 &&
                      students.map((student: StudentBasicDto) => (
                        <StudentFocusAvatar
                          key={student.id}
                          student={student}
                          selected={studentId === student.id}
                          setSelected={() => toggleStudentSelection(student.id)}
                        />
                      ))
                    )}
                  </div>
                </Slider>
              </div>

              <div className={`${expanded && 'tw-relative tw-overflow-hidden'}`}>
                <Slider innerRef={columnsRef} rootClass={'drag'} disabled={activeId.lesson && activeId.status !== ''}>
                  <div
                    ref={columnsRef}
                    className={`${
                      !expanded && 'tw-mx-4xl tw-w-full'
                    } no-scroll md:no-scroll custom-scrollbar tw-flex tw-flex-row tw-items-center tw-overflow-y-hidden tw-overflow-x-scroll tw-select-none tw-space-x-lg`}
                  >
                    <div className={`${!expanded && 'tw-w-full'} tw-flex tw-gap-x-xl`}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                      >
                        {statuses.map((status: Status) => {
                          const sectionProps = {
                            type: status,
                            lessons: items[status].length || 0,
                            alerts: sectionAlerts[status] !== 0 ? sectionAlerts[status] : undefined,
                            handleAdd: handleShowAddLesson,
                          };

                          return (
                            <div
                              key={status}
                              ref={sectionRefs[status as keyof typeof sectionRefs]}
                              className={`tw-relative tw-border tw-border-solid tw-rounded-xl tw-border-secondary tw-bg-white tw-flex tw-flex-col tw-overflow-y-scroll no-scroll ${
                                openSubNavbar ? 'tw-h-[calc(100vh-362px)]' : 'tw-h-[calc(100vh-310px)]'
                              } ${
                                !expanded && status == 'planned'
                                  ? 'tw-w-[210px] tw-flex-none'
                                  : !expanded && status !== 'planned' && isMobile
                                  ? 'tw-w-[253px] tw-flex-1'
                                  : !expanded && status !== 'planned' && !isMobile
                                  ? 'tw-min-w-[230px] tw-flex-1'
                                  : isMobile
                                  ? 'tw-w-[94vw] tw-flex-4'
                                  : 'tw-w-[95.5vw] tw-flex-4'
                              } ${
                                expanded
                                  ? status === 'planned'
                                    ? 'tw-ml-4xl'
                                    : status === 'acquired'
                                    ? 'tw-mr-4xl'
                                    : ''
                                  : ''
                              }`}
                            >
                              <div
                                className="tw-sticky tw-top-0 tw-z-50"
                                onClick={() => handleExpandedClick(status as keyof typeof sectionRefs)}
                              >
                                <FocusHeader {...sectionProps} setExpanded={setExpanded} expanded={expanded} />
                              </div>

                              <div
                                className={`tw-flex ${
                                  !expanded ? 'tw-flex-col tw-flex-wrap tw-relative' : 'tw-flex-row tw-flex-wrap'
                                } ${expanded && status === 'planned' && 'tw-px-2xl'}`}
                              >
                                {status === 'planned' &&
                                  items['planned'].length === 0 &&
                                  currentUserRoles?.canUpdateLesson &&
                                  (currentUserRoles?.isStaff
                                    ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist
                                    : true) && (
                                    <div className="tw-flex tw-items-center tw-justify-center">
                                      <CustomButton
                                        className={`${expanded ? '!tw-h-[87px]' : 'tw-mt-xl'} !tw-w-[170px]`}
                                        text="Plan Lesson"
                                        btnSize="sm"
                                        heirarchy="secondary-gray"
                                        iconTrailing={<PlusIcon />}
                                        onClick={() => setShowAddLesson(true)}
                                      />
                                    </div>
                                  )}
                                {isLoadingLessons ? (
                                  <SkeletonLesson status={status} expanded={expanded} />
                                ) : (
                                  renderLessonCards(status)
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <DragOverlay>
                          {activeId ? (
                            <LessonItem
                              data={activeId?.lesson}
                              status={activeId?.status}
                              levelId={levelId}
                              classId={classId}
                              isDecremented={triggerDecrement}
                              setDecremented={setDecremented}
                              onDecrement={onDecrement}
                              expanded={expanded}
                            />
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          )}
        </div>

        <AddLesson
          showModal={showAddLesson}
          setShowModal={setShowAddLesson}
          name={students && studentId && students.find((student: StudentBasicDto) => student.id === studentId)?.name}
          classId={classId!}
          levelId={levelId!}
        />
        {lessonId && openAddNoteOrMilestone !== undefined && (
          <AddNoteorMilestone
            showModal={openAddNoteOrMilestone}
            setShowModal={() => setOpenAddNoteOrMilestone(openAddNoteOrMilestone)}
            name={''}
            studentId={studentId ?? 0}
            levelId={levelId!}
            classId={classId!}
            lesson={lessons && lessonId && lessons.find((lesson: LessonDto) => lesson.id == lessonId)}
            // lessonState={selectedLessonState!}
            updateLessonStateMutation={updateLessonStateMutation}
            lessonState={
              lessons &&
              lessonId &&
              lessons.length > 0 &&
              lessons.recordKeepings &&
              lessons.find((lesson: LessonDto) => lesson.id == lessonId).recordKeepings[0]?.status
            }
          />
        )}
      </FocusLayout>
      <div
        ref={widthRef}
        className="tw-overflow-x-hidden tw-overflow-y-hidden tw-w-screen tw-h-[5px] tw-invisible tw-fixed"
      />
      <div
        ref={containerRef}
        className="tw-container tw-overflow-x-hidden tw-overflow-y-hidden container tw-w-full tw-h-[5px] tw-invisible tw-fixed"
      />
    </>
  );
};

export default StudentFocusPage;
