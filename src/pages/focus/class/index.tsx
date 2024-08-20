import { useMemo, useRef, useState } from 'react';
import FocusLayout from '@/components/focus/Layout';
import StudentAvatar from '@/components/focus/student/StudentAvatar';
import siteMetadata from '@/constants/siteMetadata';
import { useFocusContext } from '@/context/FocusContext';
import LessonDto from '@/dtos/LessonDto';
import { StudentBasicDto } from '@/dtos/StudentDto';
import Head from 'next/head';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import Slider from '@/components/common/Slider';
import TopicLessonSkeleton from '@/components/focus/class/TopicLessonSkeleton';
import { useRouter } from 'next/router';
import LessonMenu from '@/components/focus/lesson/LessonMenu';
import LessonBox from '@/components/focus/class/LessonBox';
import { useGetMargin } from '@/hooks/useGetMargin';
import LessonOverview from '@/components/focus/student/LessonOverview';
import AddNoteorMilestone from '@/components/ui/AddNoteorMilestone';
import { useUpdateLessonState } from '@/hooks/useUpdateLessonState';
import { useClassStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import ProgressView from '@/components/focus/progress/ProgressView';
import { useClassLessonsQuery, useLessonsQuery } from '@/hooks/queries/useLessonsQuery';

export default function ClassFocusPage() {
  const {
    studentId,
    setStudentId,
    areaId,
    topicId,
    classId,
    levelId,
    lessonId,
    openLessonOverview,
    openProgress,
    openAddNoteOrMilestone,
    setOpenAddNoteOrMilestone,
    selectedLessonState,
  } = useFocusContext();
  const router = useRouter();
  const classRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<HTMLDivElement | null>(null);
  const [triggerDecrement, setTriggerDecrement] = useState<boolean>(false);
  const getMargin = useGetMargin({ containerRef, widthRef });

  const { data: students } = useClassStudentsQuery({ classId });
  const { data: lessons, isLoading: isLoadingLessons } = useLessonsQuery({ levelId });
  const { data: classLessons, isLoading: isLoadingClassLessons } = useClassLessonsQuery({ levelId, classId });

  const sortedAndGroupedLessons = useMemo(() => {
    if (!lessons) return [];

    let filteredLessons: LessonDto[] = lessons ? lessons : [];

    const groupedLessons: { [topic: string]: { lessons: LessonDto[]; areaName: string } } = {};
    filteredLessons.forEach((lesson: LessonDto) => {
      const topicKey = lesson.topic.name;
      if (!groupedLessons[topicKey]) {
        groupedLessons[topicKey] = { lessons: [], areaName: lesson.area.name };
      }
      groupedLessons[topicKey].lessons.push(lesson);
    });

    return Object.keys(groupedLessons).map((topicKey) => {
      const group = groupedLessons[topicKey];
      group.lessons.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

      return {
        topicName: topicKey,
        groupTopicId: group.lessons[0].topic.id,
        areaName: group.areaName,
        lessons: group.lessons,
      };
    });
  }, [lessons, triggerDecrement, areaId, topicId]);

  const onDecrement = () => {
    setTriggerDecrement(true);
  };

  const updateLessonStateMutation = useUpdateLessonState({
    studentId,
    classId,
    lessonId: lessonId,
    levelId,
    areaId: lessons && lessons.length > 0 && lessons.find((lesson: LessonDto) => lesson.id == lessonId)?.area.id,
    topicId: lessons && lessons.length > 0 && lessons.find((lesson: LessonDto) => lesson.id == lessonId)?.topic.id,
  });

  return (
    <>
      <Head>
        <title>{`Class Focus | ${siteMetadata.title}`}</title>
      </Head>
      <FocusLayout>
        {openLessonOverview ? (
          <LessonOverview getMargin={getMargin} />
        ) : openProgress ? (
          <ProgressView />
        ) : (
          <div className="tw-min-w-[1016px] tw-mx-4xl tw-relative tw-overflow-hidden tw-rounded-xl tw-border tw-border-secondary tw-border-solid">
            <div className="tw-relative tw-overflow-auto">
              <Slider innerRef={classRef} rootClass="drag tw-overflow-hidden">
                <div
                  ref={classRef}
                  //tw-grid-cols-[182px_minmax(900px,_1fr)_100px]
                  className={`
                    tw-overflow-scroll
                    no-scroll
                    tw-grid
                    tw-grid-cols-[182px_minmax(900px,_1fr)_100px]
                    tw-grid-rows-[auto,repeat(${students && students.length + 1},76px_min)]
                    tw-w-full
                  `}
                  style={{ height: 'calc(100vh - 230px)', alignContent: 'flex-start' }}
                >
                  <div
                    className="
                      tw-row-start-[1]
                      tw-col-start-[1]
                      tw-sticky
                      tw-z-20
                      tw-top-0
                      tw-left-0
                      tw-bg-primary
                      tw-border
                      tw-border-solid
                      tw-border-primary
                      tw-border-t-0
                      tw-border-l-0
                    "
                  ></div>
                  <div className="tw-sticky tw-top-0 tw-row-start-[1] tw-col-start-[2] tw-flex tw-flex-nowrap tw-bg-white">
                    {sortedAndGroupedLessons.map(({ topicName, areaName, lessons, groupTopicId }) => {
                      const colorStyle = lessonTypeColors[areaName] || {
                        veryDark: '#101828',
                        dark: '#344054',
                        light: '#F2F4F7',
                        medium: '#98A2B3',
                        lightMedium: '#EAECF0',
                        alertColor: '#667085',
                      };
                      const maxWidthPerLesson = 60;

                      if (topicId && groupTopicId !== topicId) {
                        return null;
                      }

                      return (
                        <div
                          key={`${areaName}-${topicName}`}
                          className="tw-flex tw-flex-col tw-bg-white tw-p-md tw-pr-0 tw-border tw-border-solid tw-border-primary tw-border-t-0 tw-border-l-0 first:tw-pl-xl tw-flex-1"
                        >
                          <div className="tw-flex tw-flex-row tw-flex-nowrap">
                            {lessons.map((lesson) => {
                              return (
                                <div key={lesson.id} className={`tw-group tw-inline-block tw-p-0 tw-mr-[8px]`}>
                                  <div
                                    key={`${topicName}-${lesson.id}`}
                                    style={{ backgroundColor: colorStyle.light, color: colorStyle.dark }}
                                    className="tw-h-[87px] tw-flex tw-rounded-md"
                                  >
                                    <LessonMenu
                                      sequence={
                                        lesson.sequentialAssignment == 'No'
                                          ? undefined
                                          : `${lesson.sequenceNumber}/${lesson.sequenceCount}`
                                      }
                                      name={topicName}
                                      description={lesson.name}
                                      lessonType={areaName}
                                      selected={false}
                                      setSelected={() => {}}
                                      fromClass={true}
                                      isCustom={lesson.isCustom}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {students &&
                    students.length > 0 &&
                    students.map((student: StudentBasicDto, index: number) => (
                      <>
                        <div
                          className={`tw-sticky tw-z-10 tw-left-0 tw-row-start-[${
                            index + 2
                          }] tw-col-start-[1] tw-bg-primary`}
                        >
                          <div
                            key={student.id}
                            className="tw-flex tw-items-center tw-h-[76px] tw-border tw-border-solid tw-border-primary tw-border-t-0 tw-border-l-0"
                          >
                            {/* <div className="tw-w-1/5"></div> */}
                            <div
                              className="tw-flex tw-w-[150px] tw-cursor-pointer tw-pl-2xl"
                              onClick={() => {
                                setStudentId(student.id);
                                router.push('/focus/student');
                              }}
                            >
                              <StudentAvatar
                                student={student}
                                selected={false}
                                setSelected={() => {}}
                                direction="row"
                                photoSize={32}
                                textWidth={100}
                                textClass="!tw-text-md-medium"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          key={`count-${student.id}`}
                          className={`tw-flex tw-flex-row tw-row-start-[${index + 2}] tw-col-start-[2] tw-w-full`}
                        >
                          {isLoadingClassLessons || isLoadingLessons ? (
                            <TopicLessonSkeleton />
                          ) : (
                            sortedAndGroupedLessons.map(({ topicName, lessons, groupTopicId }) => {
                              if (topicId && groupTopicId !== topicId) {
                                return null;
                              }

                              return (
                                <div
                                  key={`${student.id}-${topicName}`}
                                  className="tw-flex tw-flex-row tw-p-[8px] tw-pt-[7px] tw-border tw-border-solid tw-border-primary tw-border-t-0 tw-border-l-0 first:tw-pl-xl tw-bg-primary tw-flex-1"
                                >
                                  {lessons.map((lesson) => {
                                    const studentLessonRecord =
                                      classLessons &&
                                      classLessons.length > 0 &&
                                      classLessons.find(
                                        (cl: LessonDto) =>
                                          cl.recordKeepings &&
                                          cl.recordKeepings.some(
                                            (record) => record.studentId === student.id && record.lessonId === lesson.id
                                          )
                                      );
                                    const isSequential = studentLessonRecord?.sequentialAssignment == 'Yes';
                                    return (
                                      <LessonBox
                                        key={`${student.id}-${lesson?.id}`}
                                        sequenceNumber={isSequential ? studentLessonRecord?.sequenceNumber : 0}
                                        classId={classId}
                                        levelId={levelId}
                                        lessonId={lesson?.id}
                                        lesson={studentLessonRecord!}
                                        studentId={student.id}
                                        areaName={studentLessonRecord?.area?.name}
                                        onDecrement={onDecrement}
                                        sequence={
                                          studentLessonRecord?.sequentialAssignment == 'No'
                                            ? undefined
                                            : `${studentLessonRecord?.sequenceNumber}/${studentLessonRecord?.sequenceCount}`
                                        }
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </>
                    ))}
                </div>
              </Slider>
            </div>
          </div>
        )}
      </FocusLayout>
      {lessonId && openAddNoteOrMilestone && (
        <AddNoteorMilestone
          showModal={openAddNoteOrMilestone}
          setShowModal={setOpenAddNoteOrMilestone}
          name={''}
          studentId={studentId ?? 0}
          levelId={levelId!}
          classId={classId!}
          lesson={lessons && lessons.length > 0 && lessons.find((lesson: LessonDto) => lesson.id == lessonId)}
          lessonState={selectedLessonState!}
          updateLessonStateMutation={updateLessonStateMutation}
        />
      )}
    </>
  );
}
