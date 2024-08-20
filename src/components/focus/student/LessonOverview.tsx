import { useFocusContext } from '@/context/FocusContext';
import { HTMLProps, useMemo, useRef, useEffect, useState } from 'react';
import LessonDto from '@/dtos/LessonDto';
import Slider from '@/components/common/Slider';
import PlainLessonCard from '@/components/ui/PlainLessonCard';
import LessonOverViewSkeleton from './LessonOverviewSkeleton';
import AddCustomLessonExtension from './AddCustomLessonExtension';
import SortedAndGroupedLessons from '@/dtos/SortedAndGroupedLessonsDto';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import { useLessonsQuery } from '@/hooks/queries/useLessonsQuery';

export interface LessonOverviewProps extends HTMLProps<HTMLDivElement> {
  getMargin: number;
}

export default function LessonOverview({ getMargin }: LessonOverviewProps) {
  const { levelId, classId, areaId, setAreaId, nonFocusLevelId, nonFocusAreaId, setNonFocusAreaId } = useFocusContext();
  const topicRef = useRef<HTMLDivElement | null>(null);
  const lessonsRef = useRef<HTMLDivElement | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonDto | null>(null);

  const { areas } = useAreasQuery(nonFocusLevelId!, classId!);
  const { data: lessonsData, isLoading: isLoadingLessons } = useLessonsQuery({
    levelId: nonFocusLevelId!,
  });

  useEffect(() => {
    if (!areaId && areas && areas.length > 0) setNonFocusAreaId(areas[0].id);
  }, [areas, areaId]);

  const sortedAndGroupedLessons = useMemo(() => {
    if (!lessonsData) return [];
    let filteredLessons: LessonDto[] = lessonsData.filter((lesson: LessonDto) => lesson.area.id === nonFocusAreaId);

    const groupedLessons: { [topic: string]: { lessons: LessonDto[]; areaName: string } } = {};
    filteredLessons.forEach((lesson: LessonDto) => {
      const topicName = lesson.topic.name;
      if (!groupedLessons[topicName]) {
        groupedLessons[topicName] = { lessons: [], areaName: lesson.area.name };
      }
      groupedLessons[topicName].lessons.push(lesson);
    });

    return Object.keys(groupedLessons)
      .map((topicName) => {
        const group = groupedLessons[topicName];

        group.lessons.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

        const totalSequence = group.lessons.filter((lesson) => lesson.sequentialAssignment == 'Yes').length;

        return {
          topicName,
          areaName: group.areaName,
          lessons: group.lessons,
          totalSequence,
          totalLessons: group.lessons.length,
        };
      })
      .sort((a, b) => (a.lessons[0].topic.sequence || Infinity) - (b.lessons[0].topic.sequence || Infinity));
  }, [lessonsData, nonFocusAreaId]);

  return (
    <>
      <Slider innerRef={topicRef} rootClass={'drag tw-overflow-hidden'}>
        <div
          ref={topicRef}
          className="no-scroll tw-px-4xl tw-flex tw-flex-row tw-overflow-x-scroll [&>*:nth-last-child(2)]:tw-mr-0 tw-gap-xl"
          style={{ maxHeight: 'calc(100vh - 230px)' }}
        >
          {sortedAndGroupedLessons && isLoadingLessons ? (
            <LessonOverViewSkeleton />
          ) : (
            sortedAndGroupedLessons.map(
              ({ lessons, topicName, totalSequence, totalLessons }: SortedAndGroupedLessons, indexGroup) => {
                return (
                  <>
                    <div className="tw-w-[299px] tw-basis-[299px] tw-px-2xl tw-py-lg tw-bg-primary tw-grow-0 tw-shrink-0 tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-overflow-hidden">
                      <div className="tw-text-lg-regular tw-text-alpha-black-100 tw-mb-md tw-truncate">{topicName}</div>

                      <Slider innerRef={lessonsRef} rootClass={'drag tw-overflow-hidden tw-max-h-full'} direction="col">
                        <div
                          ref={lessonsRef}
                          className="no-scroll tw-flex tw-flex-col tw-overflow-x-scroll tw-py-xl tw-gap-xl tw-p-0 tw-mb-3xl"
                        >
                          {lessons.map((lesson) => {
                            const isSequential = lesson.sequentialAssignment == 'Yes';
                            const sequenceNumber = lesson.sequenceNumber || undefined;

                            return (
                              <PlainLessonCard
                                key={lesson.id}
                                levelId={levelId}
                                classId={classId}
                                areaId={nonFocusAreaId}
                                lesson={lesson}
                                sequence={isSequential ? `${sequenceNumber}/${totalSequence}` : undefined}
                                name={lesson.topic.name}
                                description={lesson.description}
                                lessonName={lesson.name}
                                lessonType={lesson.area.name}
                                materialsUsed={lesson.materialUsed}
                                css={'last:tw-mr-0 tw-grow-0 tw-shrink-0 tw-mt-0'}
                                setSelectedLesson={setSelectedLesson}
                                totalSequence={totalSequence}
                                totalLessons={totalLessons}
                              />
                            );
                          })}
                        </div>
                      </Slider>
                    </div>
                    {/* {indexGroup === sortedAndGroupedLessons.length - 1 && (
                      <div
                        className={`tw-flex tw-flex-row tw-w-[257px] tw-h-[87px] tw-mt-xl tw-select-none tw-grow-0 tw-shrink-0 tw-invisible`}
                        style={{ flexBasis: getMargin }}
                      />
                    )} */}
                  </>
                );
              }
            )
          )}
        </div>
      </Slider>
      <AddCustomLessonExtension
        component="student"
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
      />
    </>
  );
}
