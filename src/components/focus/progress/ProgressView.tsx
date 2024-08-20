import React, { useMemo, useRef, useState } from 'react';
import Slider from '@/components/common/Slider';
import { useLessonsQuery, useStudentLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import { useClassStudentsQuery } from '@/hooks/queries/useStudentsQuery';
import { useFocusContext } from '@/context/FocusContext';
import SkeletonAvatar from '@/components/focus/student/SkeletonAvatar';
import { StudentBasicDto } from '@/dtos/StudentDto';
import StudentFocusAvatar from '@/components/focus//student/StudentFocusAvatar';
import LessonOverViewSkeleton from '@/components/focus//student/LessonOverviewSkeleton';
import LessonDto from '@/dtos/LessonDto';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import AreaDto from '@/dtos/AreaDto';
import ProgressLessonBox from './ProgressLessonBox';
import DropdownChevron from '@/components/svg/DropdownChevron';

function ProgressView() {
  const {
    studentId,
    setStudentId,
    nonFocusLevelId,
    nonFocusAreaId,
    classId,
    openedProgressTopics,
    setOpenedProgressTopics,
  } = useFocusContext();
  const [topicVisibility, setTopicVisibility] = useState<string[]>([]);
  const studentRef = useRef<HTMLDivElement | null>(null);
  const topicRef = useRef<HTMLDivElement | null>(null);

  const { data: students, isLoading: isLoadingStudents } = useClassStudentsQuery({ classId: classId! });
  const { data: studentLessons, isLoading: isLoadingLessons } = useStudentLessonsQuery({
    levelId: nonFocusLevelId!,
    classId: classId!,
    studentId: studentId!,
  });

  const { areasByLevelStudent } = useAreasQuery(nonFocusLevelId!, classId!, studentId!);
  const { data: lessonsData } = useLessonsQuery({
    levelId: nonFocusLevelId!,
  });

  const sortedAndGroupedLessons = useMemo(() => {
    if (!lessonsData || !areasByLevelStudent || areasByLevelStudent.length === 0) return [];

    const areaOrder = areasByLevelStudent.map((area: AreaDto) => area.name);
    let filteredLessons: LessonDto[] = lessonsData;

    const groupedLessons: { [areaName: string]: { [topicName: string]: LessonDto[] } } = {};
    filteredLessons.forEach((lesson: LessonDto) => {
      const areaName = lesson.area.name;
      const topicName = lesson.topic.name;

      if (!groupedLessons[areaName]) {
        groupedLessons[areaName] = {};
      }
      if (!groupedLessons[areaName][topicName]) {
        groupedLessons[areaName][topicName] = [];
      }
      groupedLessons[areaName][topicName].push(lesson);
    });

    return Object.keys(groupedLessons)
      .map((areaName) => {
        const topics = groupedLessons[areaName];
        const areaProgress = areasByLevelStudent?.find((area: AreaDto) => area.name === areaName)?.progress || 0;
        return {
          areaName,
          areaProgress,
          topics: Object.keys(topics)
            .map((topicName) => {
              const lessons = topics[topicName];
              lessons.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
              const totalSequence = lessons.filter((lesson) => lesson.sequentialAssignment == 'Yes').length;
              return {
                topicName,
                lessons,
                totalSequence,
                totalLessons: lessons.length,
              };
            })
            .sort((a, b) => (a.lessons[0].topic.sequence || Infinity) - (b.lessons[0].topic.sequence || Infinity)),
        };
      })
      .sort((a, b) => {
        return areaOrder.indexOf(a.areaName) - areaOrder.indexOf(b.areaName);
      });
  }, [lessonsData, nonFocusAreaId, areasByLevelStudent]);

  const toggleStudentSelection = (studentId: number) => {
    setStudentId(studentId);
  };

  const handleToggleVisibility = (topicName: string) => {
    setOpenedProgressTopics((prev: string[]) => {
      if (prev.includes(topicName)) {
        // Remove the topic from the array
        return prev.filter((topic) => topic !== topicName);
      } else {
        // Add the topic to the array
        return [...prev, topicName];
      }
    });
  };

  return (
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
      <Slider innerRef={topicRef} rootClass={'drag tw-overflow-hidden'}>
        <div
          ref={topicRef}
          className="no-scroll tw-px-4xl tw-flex tw-flex-row tw-overflow-x-scroll [&>*:nth-last-child(2)]:tw-mr-0 tw-gap-xl"
          style={{ height: 'calc(100vh - 365px)' }}
        >
          {sortedAndGroupedLessons && isLoadingLessons ? (
            <LessonOverViewSkeleton />
          ) : (
            sortedAndGroupedLessons.map(({ areaName, areaProgress, topics }) => {
              return (
                <div
                  key={areaName}
                  className="tw-w-[299px] tw-basis-[299px] tw-px-2xl tw-bg-primary tw-grow-0 tw-shrink-0 tw-rounded-xl tw-border-secondary tw-border-solid tw-border no-scroll tw-overflow-y-scroll"
                >
                  <div className="tw-sticky tw-top-0 tw-py-md tw-pt-lg tw-truncate tw-bg-white tw-justify-between tw-flex tw-z-20">
                    <div className="tw-text-lg-regular tw-text-primary tw-max-w-[225px] tw-truncate">{areaName}</div>
                    <div className="tw-text-sm-regular tw-text-tertiary">
                      {areaProgress.toFixed(0)}%
                    </div>
                  </div>
                  {topics.map(({ topicName, lessons, totalSequence, totalLessons }, index) => (
                    <div
                      key={topicName}
                      className={`${
                        !openedProgressTopics.includes(topicName)
                          ? `${index === 0 ? 'tw-mt-xl' : ''} tw-mb-md`
                          : `${index === 0 ? 'tw-mt-xl' : ''} tw-mb-lg`
                      } `}
                    >
                      <div
                        className={`tw-text-md-regular tw-text-secondary ${
                          !openedProgressTopics.includes(topicName)
                            ? 'tw-border-b tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary'
                            : ''
                        } tw-cursor-pointer tw-flex tw-justify-between`}
                        onClick={() => handleToggleVisibility(topicName)}
                      >
                        <span className="tw-max-w-[239px] tw-truncate">{topicName}</span>
                        <span
                          className={`tw-z-10 tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                            !openedProgressTopics.includes(topicName) ? 'tw-rotate-180' : ''
                          }`}
                        >
                          <DropdownChevron color={'#98A2B3'} />
                        </span>
                      </div>
                      {!openedProgressTopics.includes(topicName) && (
                        <div className="no-scroll tw-flex tw-flex-col tw-overflow-y-scroll tw-gap-lg tw-p-0 tw-py-lg">
                          {lessons.map((lesson) => {
                            return (
                              <div className="tw-h-[40px] tw-flex tw-space-x-xl" key={lesson.id}>
                                <div className="tw-flex-none">
                                  <ProgressLessonBox
                                    levelId={nonFocusLevelId}
                                    classId={classId}
                                    lessonId={lesson?.id}
                                    lesson={studentLessons?.find((l: LessonDto) => l.id === lesson.id)}
                                    studentId={studentId}
                                    areaName={areaName}
                                  />
                                </div>
                                <div className=" tw-items-center tw-flex">
                                  <div className="tw-text-sm-regular tw-text-primary tw-line-clamp-2 tw-overflow-hidden tw-text-ellipsis">
                                    {lesson.name}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </Slider>
    </div>
  );
}

export default ProgressView;
