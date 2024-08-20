import FocusLayout from '@/components/focus/Layout';
import siteMetadata from '@/constants/siteMetadata';
import Head from 'next/head';
import { useState, useEffect, useMemo, useRef, MouseEvent } from 'react';
import LessonDto from '@/dtos/LessonDto';
import { StudentBasicDto, StudentDto } from '@/dtos/StudentDto';
import SkeletonLessonMenu from '@/components/focus/lesson/SkeletonLessonMenu';
import { useFocusContext } from '@/context/FocusContext';
import LessonMenu from '@/components/focus/lesson/LessonMenu';
import Slider from '@/components/common/Slider';
import { useRouter } from 'next/router';
import { useNavbarContext } from '@/context/NavbarContext';
import FocusHeader from '@/components/focus/common/Header';
import CustomButton from '@/components/ui/CustomButton';
import { isMobile } from 'react-device-detect';
import PlusIcon from '@/components/svg/PlusIcon';
import { useGetMargin } from '@/hooks/useGetMargin';
import LessonOverview from '@/components/focus/student/LessonOverview';
import { DndContext, PointerSensor, TouchSensor, useSensor, DragOverlay, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import SortableContainer from './SortableContainer';
import { LessonItem } from './SortableLessonItem';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { useClassLessonsQuery, useLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import { useClassStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import AddStudentToLesson from '@/components/ui/AddStudent';
import ProgressView from '@/components/focus/progress/ProgressView';
import { RecordKeepingDto } from '@/dtos/RecordKeepingDto';

interface StudentsState {
  planned: StudentBasicDto[];
  practicing: StudentBasicDto[];
  review: StudentBasicDto[];
  acquired: StudentBasicDto[];
}

type Status = 'planned' | 'practicing' | 'review' | 'acquired';

interface ActiveState {
  student: StudentBasicDto | null;
  status: Status | string;
}

export default function LessonFocusPage() {
  const {
    currentUserRoles,
    areaId,
    setAreaId,
    topicId,
    setTopicId,
    lessonId,
    setLessonId,
    studentId,
    setStudentId,
    classId,
    setClassId,
    levelId,
    setLevelId,
    openLessonOverview,
    openProgress,
    classes,
  } = useFocusContext();
  const { openSubNavbar } = useNavbarContext();
  const router = useRouter();
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [shouldMove, setShouldMove] = useState<boolean>(true);
  const selectedLessonRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const basisRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  const getMargin = useGetMargin({ containerRef: basisRef, widthRef });
  const statuses: Status[] = ['planned', 'practicing', 'review', 'acquired'];
  const [activeId, setActiveId] = useState<ActiveState>({ student: null, status: '' });
  const [items, setItems] = useState<StudentsState>({
    planned: [],
    practicing: [],
    review: [],
    acquired: [],
  });

  const { data: lessons, isLoading: isLoadingLessons } = useLessonsQuery({ levelId });
  const { data: classLessons } = useClassLessonsQuery({ levelId, classId });
  const { data: students } = useClassStudentsQuery({ classId: classId! });

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId,
    levelId,
    areaId: lessons && lessons.find((lesson: LessonDto) => lesson.id == lessonId)?.area.id,
    topicId: lessons && lessons.find((lesson: LessonDto) => lesson.id == lessonId)?.topic.id,
  });

  // useEffect(() => {
  //   if (classes && classes.length > 0) {
  //     if (classId === undefined) {
  //       setClassId(classes[0].id);
  //     }
  //     if (levelId === undefined) {
  //       setLevelId(classes[0].levelId);
  //     }
  //   }
  // }, [classes, classId, levelId]);

  const [sectionStates, setSectionStates] = useState<Record<string, boolean>>({
    planned: false,
    practicing: false,
    review: false,
    acquired: false,
  });

  const handleSectionToggle = (sectionKey: keyof typeof sectionStates) => {
    setSectionStates((prevStates) => ({
      ...prevStates,
      [sectionKey]: !prevStates[sectionKey],
    }));
  };

  const getCountByStatus = (record: any, status: string): number | null => {
    switch (status) {
      case 'practicing':
        return record.practiceCount;
      case 'acquired':
        return record.acquiredCount;
      case 'review':
        return record.reviewCount;
      default:
        return null;
    }
  };

  const getStudentsByStatusAndLesson = useMemo(
    () => (status: string) => {
      if (students && lessonId && classLessons) {
        const lessonRecord = classLessons.find((lesson: LessonDto) => lesson.id === lessonId);

        if (lessonRecord && lessonRecord.recordKeepings) {
          const studentRecords = lessonRecord.recordKeepings
            .filter((record: RecordKeepingDto) => record.status === status)
            .map((record: RecordKeepingDto) => ({
              studentId: record.studentId,
              count: getCountByStatus(record, status),
            }));

          const filteredStudents = students
            .filter((student: StudentDto) =>
              studentRecords.some((sr: { studentId: number }) => sr.studentId === student.id)
            )
            .map((student: StudentDto) => ({
              ...student,
              count: studentRecords.find((sr: { studentId: number }) => sr.studentId === student.id)?.count || null,
            }));

          return filteredStudents;
        }
      }
      return [];
    },
    [students, classLessons, lessonId]
  );

  useEffect(() => {
    if (classLessons) {
      setItems({
        planned: getStudentsByStatusAndLesson('planned'),
        practicing: [...getStudentsByStatusAndLesson('practicing'), ...getStudentsByStatusAndLesson('presented')],
        review: getStudentsByStatusAndLesson('review'),
        acquired: getStudentsByStatusAndLesson('acquired'),
      });
    }
  }, [getStudentsByStatusAndLesson, classLessons]);

  const renderStudentsByStatus = useMemo(() => {
    const RenderSortableContainer = (status: Status) => (
      <SortableContainer id={status} items={items[status]} status={status} setStudentId={setStudentId} />
    );
    RenderSortableContainer.displayName = 'RenderSortableContainer';
    return RenderSortableContainer;
  }, [getStudentsByStatusAndLesson, items]);

  const filteredLessons = useMemo(() => {
    if (lessons) {
      let filteredLessons = lessons;
      if (areaId !== undefined) {
        filteredLessons = lessons.filter((lesson: LessonDto) => lesson.area.id === areaId);
      }

      if (topicId !== undefined) {
        filteredLessons = lessons.filter((lesson: LessonDto) => lesson.topic.id === topicId);
      }

      filteredLessons.sort((a: LessonDto, b: LessonDto) => a.sequenceNumber! - b.sequenceNumber!);
      return filteredLessons;
    }
  }, [lessons, areaId, topicId]);

  const prevAreaIdRef = useRef<number | undefined>();
  const prevTopicIdRef = useRef<number | undefined>();
  const moveCards = () => {
    if (filteredLessons && selectedLessonRef.current && containerRef.current) {
      const selectedLessonLeft = selectedLessonRef.current.offsetLeft;
      containerRef.current.scrollTo({ left: selectedLessonLeft - 45, behavior: 'smooth' });
      prevAreaIdRef.current = areaId;
      prevTopicIdRef.current = topicId;
    }
  };

  useEffect(() => {
    if (router.query.openInLessonView) {
      moveCards();
    }
  }, []);

  useEffect(() => {
    if (lessonId) {
      moveCards();
    }
  }, [lessonId]);

  useEffect(() => {
    if (
      areaId === undefined &&
      shouldMove &&
      lessons &&
      lessons.length > 0 &&
      !router.query.openInLessonView &&
      !showAddStudent
    ) {
      moveCards();
      setLessonId(lessons[0].id);
    } else if (
      areaId &&
      shouldMove &&
      filteredLessons &&
      filteredLessons.length > 0 &&
      !router.query.openInLessonView &&
      !showAddStudent
    ) {
      moveCards();
      setLessonId(filteredLessons[0].id);

    } else if (!shouldMove) {
      //setShouldMove(true);
    }
  }, [areaId, filteredLessons]);

  useEffect(() => {
    if (topicId && filteredLessons && filteredLessons.length > 0 && !router.query.openInLessonView && !showAddStudent && shouldMove) {
      setLessonId(filteredLessons[0].id);
    }
  }, [topicId, filteredLessons]);

  const handleShowAddStudent = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setShowAddStudent(true);
  };

  const renderSection = (status: Status) => {
    const sectionProps = {
      type: status,
      students: items[status]?.length,
      expanded: sectionStates[status],
      setExpanded: () => handleSectionToggle(status),
      handleAdd: handleShowAddStudent,
      component: 'child',
    };

    return (
      <div
        key={status}
        className={`tw-relative tw-border tw-border-solid tw-rounded-xl tw-border-secondary tw-bg-white ${
          openSubNavbar ? 'tw-h-[calc(100vh-362px)]' : 'tw-h-[calc(100vh-310px)]'
        } tw-flex tw-flex-col tw-overflow-y-scroll tw-overflow-x-hidden no-scroll ${
          status === 'planned' ? 'tw-w-[210px] tw-flex-none' : 'tw-flex-1'
        }`}
      >
        <FocusHeader key={`focusheader-${status}`} {...sectionProps} expanded={false} setExpanded={() => {}} />
        <div
          key={`div-${status}`}
          className={`tw-flex tw-px-2xl tw-pt-xl tw-h-full tw-gap-xl ${
            status === 'planned' ? 'tw-flex-col' : 'tw-flex-row tw-flex-wrap'
          }`}
        >
          {status === 'planned' && currentUserRoles?.canUpdateLesson && (
            <div className="tw-w-full tw-flex tw-justify-center">
              <CustomButton
                className="tw-max-w-[170px] !tw-border-[0.5px]"
                text="Add Student"
                btnSize="sm"
                heirarchy="secondary-gray"
                iconTrailing={<PlusIcon />}
                onClick={() => setShowAddStudent(true)}
              />
            </div>
          )}
          {renderStudentsByStatus(status)}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const slider = containerRef.current;

    const handleSliderMove = () => {
      const lessonContainer = containerRef.current;
      if (lessonContainer) {
        lessonContainer.classList.remove('tw-px-2xl');
      }
    };

    slider?.addEventListener('sliderMove', handleSliderMove);

    return () => {
      slider?.removeEventListener('sliderMove', handleSliderMove);
    };
  }, []);

  const isDragEnabled = currentUserRoles?.canUpdateLesson;
  // Initialize touch sensor with delay and tolerance for mobile
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 10,
    },
  });

  // Initialize pointer sensor with distance constraint for non-mobile
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
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
    const containerId = event.active.data.current.sortable.containerId as keyof StudentsState;
    const index = event.active.data.current.sortable.index;
    const student = items[containerId][index];
    setActiveId({
      student: student,
      status: event.active?.data?.current?.sortable?.containerId,
    });
  };

  const getPreviousStateCount = () => {
    var count = 0;

    var currentLesson:LessonDto[] = lessons.filter((lesson:LessonDto) => {
      return lesson.id == lessonId;
    });

    if(currentLesson && currentLesson[0].recordKeepings){
      var studentRk:RecordKeepingDto = currentLesson[0].recordKeepings.filter((rk:RecordKeepingDto) => {
        return rk.studentId == studentId && rk.status == activeId.status;
      })[0];

      switch(activeId.status){
        case 'practicing':
          count = studentRk.practiceCount ?? 0;
          break;
        case 'review':
          count = studentRk.reviewCount ?? 0;
          break;
      }
    }
    return count;
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    const activeContainer = active?.data?.current?.sortable?.containerId;
    const overContainer = over?.data?.current?.sortable?.containerId as keyof StudentsState;

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    const activeIndex = active?.data?.current?.sortable?.index;
    const overIndex = over?.data?.current?.sortable?.index;
    
    setShouldMove(false);

    var count = 0;

    switch(activeContainer){
      case "review":
        count = 1;
        break;
      case "acquired":
        count = getPreviousStateCount();
    }

    var moveData = {
      status: activeContainer,
      order: -1, //means don't update order
      actionDate: new Date().toISOString(),
      count: count,
      reReview: activeContainer == 'review',
    };

    updateLessonStateMutation.mutate(moveData);

    setItems((items) => ({
      ...items,
      [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }));

    setActiveId({ student: null, status: '' });
  };

  const handleDragOver = (event: any) => {
    const { active, over, draggingRect } = event;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = active?.data?.current?.sortable?.containerId as keyof StudentsState;
    const overContainer = isNaN(Number(overId))
      ? (overId as keyof StudentsState)
      : (over?.data?.current?.sortable?.containerId as keyof StudentsState);

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
      setStudentId(active.id);
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

  return (
    <>
      <Head>
        <title>{`Lesson Focus | ${siteMetadata.title}`}</title>
      </Head>
      <FocusLayout>
        {openLessonOverview ? (
          <LessonOverview getMargin={getMargin} />
        ) : openProgress ? (
          <ProgressView />
        ) : (
          <div className="tw-min-w-[1016px] tw-mx-4xl tw-items-center tw-justify-center tw-space-y-xl">
            <div
              className={`
              tw-bg-white
              tw-border
              tw-border-secondary
              tw-border-solid
              tw-rounded-xl
              tw-py-lg
            `}
            >
              <Slider innerRef={containerRef} rootClass={'drag'} totalItems={filteredLessons && filteredLessons.length}>
                <div
                  ref={containerRef}
                  className="tw-px-2xl no-scroll tw-flex tw-flex-row tw-overflow-x-scroll tw-space-x-lg"
                >
                  {isLoadingLessons ? (
                    <SkeletonLessonMenu />
                  ) : (
                    filteredLessons?.map((lesson: LessonDto) => {
                      const isSequential = lesson.sequentialAssignment == 'Yes';

                      return (
                        <div className="tw-cursor-pointer" key={lesson.id}>
                          <LessonMenu
                            ref={lesson.id === lessonId ? selectedLessonRef : null}
                            sequence={isSequential ? `${lesson.sequenceNumber}/${lesson.sequenceCount}` : undefined}
                            name={lesson.topic.name}
                            description={lesson.name}
                            lessonType={lesson.area.name}
                            selected={lessonId === lesson.id}
                            setSelected={() => {
                              setLessonId(lesson.id);
                            }}
                            isCustom={lesson.isCustom}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </Slider>
            </div>
            <div className="tw-flex tw-flex-row tw-space-x-xl">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {statuses.map((status: Status) => renderSection(status))}
                <DragOverlay>
                  {activeId ? <LessonItem student={activeId?.student} status={activeId?.status} /> : null}
                </DragOverlay>
              </DndContext>
            </div>
            {/* <div className="tw-overflow-x-hidden tw-overflow-y-hidden">
            {['planned', 'practicing', 'review', 'acquired'].map((status) => (
              <Section key={status}>
                <SectionTitle
                  type={status}
                  students={getStudentsByStatusAndLesson(status)?.length}
                  expanded={sectionStates[status]}
                  setExpanded={() => handleSectionToggle(status)}
                  handleAdd={handleShowAddStudent}
                  component="child"
                />
                <Slider innerRef={getStatusRef(status)} rootClass={'drag'} totalItems={students && students.length}>
                  <div
                    className={`
                      tw-flex
                      tw-flex-row
                      tw-min-h-[139px]
                      tw-overflow-x-visible
                      tw-items-center
                      ${sectionStates[status] ? 'tw-flex-wrap' : 'tw-overflow-x-scroll no-scroll'}
                    `}
                    ref={getStatusRef(status)}
                  >
                    {renderStudentsByStatus(status)}
                  </div>
                </Slider>
              </Section>
            ))}
          </div> */}
          </div>
        )}
        {currentUserRoles?.canUpdateLesson && (
          <AddStudentToLesson
            showModal={showAddStudent}
            setShowModal={setShowAddStudent}
            name={filteredLessons && filteredLessons.filter((lesson: LessonDto) => lesson.id === lessonId)[0]?.name}
            lesson={filteredLessons && filteredLessons.filter((lesson: LessonDto) => lesson.id === lessonId)[0]}
            classId={classId!}
            levelId={levelId!}
          />
        )}
      </FocusLayout>
      <div
        ref={widthRef}
        className="tw-overflow-x-hidden tw-overflow-y-hidden tw-w-screen tw-h-[5px] tw-invisible tw-fixed"
      />
      <div
        ref={basisRef}
        className="tw-container tw-overflow-x-hidden tw-overflow-y-hidden container tw-w-full tw-h-[5px] tw-invisible tw-fixed"
      />
    </>
  );
}
