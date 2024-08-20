import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import SearchIcon from '@/components/svg/SearchIcon';
import DropdownChevron from '@/components/svg/DropdownChevron';
import ClosedBookIcon from '@/components/svg/ClosedBookIcon';
import OpenBookIcon from '@/components/svg/OpenBookIcon';
import AddLessonCard from '@/components/ui/AddLessonCard';
import LessonDto from '@/dtos/LessonDto';
import AreaDto from '@/dtos/AreaDto';
import TopicDto from '@/dtos/TopicDto';
import { useClickOutside } from '@mantine/hooks';
import { useFocusContext } from '@/context/FocusContext';
import CloseIcon from '@/components/svg/CloseIcon';
import AlertCircleIcon from '@/components/svg/AlertCircle';
import { DropdownCheckIcon } from '@/components/svg/DropdownCheck';
import LevelDto from '@/dtos/LevelDto';
import BackPackIcon from '@/components/svg/BackPackIcon';
import { useTopicsByLevelQuery } from '@/hooks/useTopicsQuery';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import { useLessonsQuery, useStudentLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import { replaceLevelName } from '@/utils/replaceLevelName';

interface SectionProps {
  showModal?: boolean;
  setShowModal: Function;
  name: string;
  classId: number;
  levelId: number;
}

export default function AddLesson({ showModal, setShowModal, name, classId, levelId }: SectionProps) {
  const {
    areaId,
    topicId,
    studentId,
    levelId: levelIdContext,
    setLevelId,
    setAreaId,
    setTopicId,
    organization,
  } = useFocusContext();
  const [isOpenArea, setIsOpenArea] = useState<boolean>(false);
  const [isOpenTopic, setIsOpenTopic] = useState<boolean>(false);
  const [isOpenLevel, setIsOpenLevel] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<AreaDto | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicDto | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelDto | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalSequences, setTotalSequences] = useState<{ [key: string]: number }>({});
  const [visibleAreas, setVisibleAreas] = useState<number[]>([]);
  const [areaVisibility, setAreaVisibility] = useState<boolean[]>([]);
  const [isAreaNameSticky, setIsAreaNameSticky] = useState<boolean>(false);
  const areaDropdownRef = useClickOutside(() => setIsOpenArea(false));
  const levelDropdownRef = useClickOutside(() => setIsOpenLevel(false));
  const topicDropdownRef = useClickOutside(() => setIsOpenTopic(false));

  const { data: levels } = useLevelsQuery();
  const { areas } = useAreasQuery((selectedLevel ? selectedLevel.id : levelIdContext)!, classId!);
  const { data: topics } = useTopicsByLevelQuery(levelId ?? levelIdContext);
  const { data: lessonsDataRaw } = useLessonsQuery({ levelId: levelId! });
  const { data: lessons } = useStudentLessonsQuery({
    levelId: levelId!,
    classId: classId!,
    studentId: studentId!,
  });

  const lessonsData = useMemo(() => {
    if (lessonsDataRaw && lessons) {
      return lessonsDataRaw.filter(
        (lessonRaw: LessonDto) => !lessons.some((lesson: LessonDto) => lesson.id === lessonRaw.id)
      );
    }
    return [];
  }, [lessonsDataRaw, lessons]);

  const modifiedLevels =
    levels &&
    levels.length > 0 &&
    levels?.map((level: LevelDto) => ({
      ...level,
      name: replaceLevelName(level.name, organization?.termInfo),
    }));

  const filteredTopics = useMemo(() => {
    if (topics) {
      let filteredTopics = topics;

      if (selectedArea !== undefined) {
        filteredTopics = topics.filter((topic: TopicDto) => topic.area.id === selectedArea?.id);
      }

      return filteredTopics;
    }

    return [];
  }, [topics, selectedArea]);

  const getUnplannedLessonsForStudent = useMemo(
    () => (areaId: number, topicId: number) => {
      if (lessonsData) {
        let lessonsByArea = lessonsData;

        if (searchTerm) {
          lessonsByArea = lessonsByArea.filter((lesson: LessonDto) =>
            lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (areaId !== undefined) {
          lessonsByArea = lessonsByArea.filter((lesson: LessonDto) => lesson.area.id === areaId);
        }

        if (topicId !== undefined) {
          lessonsByArea = lessonsByArea.filter((lesson: LessonDto) => lesson.topic.id === topicId);
        }

        lessonsByArea.sort((a: LessonDto, b: LessonDto) => {
          const nameComparison = a.topic.name.localeCompare(b.topic.name);
          if (nameComparison !== 0) {
            return nameComparison;
          }

          return (a.sequenceNumber || 0) - (b.sequenceNumber || 0);
        });
        return { lessons: lessonsByArea };
      }

      return { lessons: [] };
    },
    [lessonsData, searchTerm, selectedArea, selectedTopic, showModal, areaId, topicId]
  );

  const toggleAreaVisibility = (areaId: number) => {
    setAreaVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[areaId] = !updatedVisibility[areaId];
      return updatedVisibility;
    });

    setVisibleAreas((prevVisibleAreas) => {
      if (prevVisibleAreas.includes(areaId)) {
        return prevVisibleAreas.filter((id) => id !== areaId);
      } else {
        return [...prevVisibleAreas, areaId];
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const shouldSticky = window.scrollY > 100;
      setIsAreaNameSticky(shouldSticky);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (areaId && topicId && areas && topics) {
      setSelectedArea(areas.filter((area: AreaDto) => area.id === areaId)[0]);
      toggleAreaVisibility(areaId);
      setSelectedTopic(null);
    }
  }, [areaId]);

  useEffect(() => {
    if (topicId && topics) {
      setSelectedTopic(topics.filter((topic: TopicDto) => topic.id === topicId)[0]);
    } else {
      setSelectedTopic(null);
    }
  }, [topicId]);

  useEffect(() => {
    if (levelId && modifiedLevels) {
      let currentLevel = modifiedLevels.find((x: any) => x.id == levelId);
      if (currentLevel) {
        setSelectedLevel(currentLevel);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, levelId]);

  const renderLessonCards = useMemo(() => {
    if (areas && topics && lessonsData) {
      return (
        <>
          {areas.map((area: AreaDto) => {
            const filteredTopics = topics.filter((topic: TopicDto) => topic.area.id === area.id);
            const isAreaSelected = selectedArea && selectedArea.id === area.id ? true : false;

            if (selectedArea !== null && !isAreaSelected) {
              return null;
            }

            return (
              <div key={`area_${area.id}`}>
                {selectedLevel !== undefined && selectedArea === null && (
                  <div
                    className={`tw-items-center tw-text-lg-regular tw-text-secondary tw-cursor-pointer tw-flex tw-justify-between tw-sticky ${
                      isAreaNameSticky ? 'tw-top-0 tw-z-50' : ''
                    }`}
                    onClick={() => toggleAreaVisibility(area.id)}
                  >
                    <div className="tw-text-primary">{area.name}</div>
                    <div
                      className={`tw-p-0 tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                        areaVisibility[area.id] ? 'tw-rotate-180' : ''
                      }`}
                    >
                      <DropdownChevron color="primary" width="24" height="24" />
                    </div>
                  </div>
                )}
                {(isAreaSelected || selectedArea === null) &&
                  visibleAreas.includes(area.id) &&
                  filteredTopics.map((topic: TopicDto) => {
                    const topicId = topic.id;
                    const isTopicSelected = selectedTopic ? selectedTopic.id === topicId : true;

                    const { lessons: unplannedLessons } = getUnplannedLessonsForStudent(area.id, topicId);

                    if (isTopicSelected && unplannedLessons.length > 0) {
                      return (
                        <div key={`area_${area.id}_topic_${topicId}`} className="tw-bg-white tw-space-y-lg">
                          {selectedTopic === null && (
                            <div className="tw-text-lg-regular tw-text-tertiary tw-pt-md">{topic.name}</div>
                          )}
                          {unplannedLessons.map((lesson: LessonDto) => {
                            const isSequential: boolean = lesson.sequentialAssignment === 'Yes';

                            return (
                              <AddLessonCard
                                key={lesson.id}
                                lesson={lesson}
                                classId={classId}
                                levelId={levelId}
                                studentId={studentId}
                                sequence={isSequential ? `${lesson.sequenceNumber}/${lesson.sequenceCount}` : undefined}
                                name={lesson.topic.name}
                                description={lesson.name}
                                lessonType={lesson.area.name}
                              />
                            );
                          })}
                        </div>
                      );
                    }
                  })}
              </div>
            );
          })}
        </>
      );
    }

    return null;
  }, [
    areas,
    topics,
    lessonsData,
    totalSequences,
    classId,
    levelId,
    studentId,
    getUnplannedLessonsForStudent,
    toggleAreaVisibility,
    visibleAreas,
    areaVisibility,
    isAreaNameSticky,
    selectedArea,
    selectedTopic,
  ]);

  const handleSelectLevel = (event: MouseEvent<HTMLDivElement>, level: LevelDto | null) => {
    event.stopPropagation();
    if (level) {
      setSelectedLevel(level);
      setLevelId(level.id);
    }
    setAreaId(undefined);
    setTopicId(undefined);
    setIsOpenLevel(false);
    setSelectedArea(null);
    setSelectedTopic(null);
  };

  const handleSelectArea = (event: MouseEvent<HTMLDivElement>, area: AreaDto | null) => {
    event.stopPropagation();
    if (area) {
      setSelectedArea(area);
      setAreaId(area.id);
      toggleAreaVisibility(area.id);
    } else {
      setAreaId(undefined);
      setSelectedArea(null);
    }
    setIsOpenArea(false);
    setTopicId(undefined);
    setSelectedTopic(null);
  };

  const handleSelectTopic = (event: MouseEvent<HTMLDivElement>, topic: TopicDto | null) => {
    event.stopPropagation();
    if (topic) {
      setTopicId(topic.id);
      setSelectedTopic(topic);
    } else {
      setTopicId(undefined);
      setSelectedTopic(null);
    }
    setIsOpenTopic(false);
  };

  const ref = useClickOutside(() => setShowModal(false));

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-50" />
          <motion.div
            initial={{ right: -400 }}
            animate={{ right: 0 }}
            exit={{ right: -400 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="tw-fixed tw-z-50 tw-top-0 tw-right-0 tw-h-screen tw-w-[400px] tw-bg-white tw-shadow-xl tw-pb-0"
            ref={ref}
          >
            <div className="tw-flex tw-flex-col tw-space-y-lg tw-py-3xl tw-px-3xl tw-pb-xl tw-border-solid tw-border-b tw-border-primary tw-border-x-0 tw-border-t-0">
              <div className="tw-space-y-xs tw-flex tw-flex-col">
                <div className="tw-justify-between tw-flex">
                  <div className="tw-text-xl-semibold tw-text-primary">Plan Lesson</div>
                  <span className="tw-cursor-pointer" onClick={() => setShowModal(false)}>
                    <NotesCloseIcon />
                  </span>
                </div>
                <div className="tw-text-sm-regular tw-text-tertiary">{name}</div>
              </div>
              <div>
                <div className="tw-relative tw-flex tw-items-center">
                  <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3.5 tw-pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="tw-block tw-w-full tw-py-2.5 tw-px-3.5 tw-ps-11 tw-text-md-regular tw-text-primary placeholder:tw-text-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white"
                    placeholder="Search"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    value={searchTerm}
                  />
                  {searchTerm && (
                    <div
                      className="tw-cursor-pointer tw-flex tw-items-center tw-absolute tw-right-3.5"
                      onClick={() => setSearchTerm('')}
                    >
                      <CloseIcon />
                    </div>
                  )}
                </div>
              </div>
              <div ref={levelDropdownRef}>
                <button
                  type="button"
                  className="tw-flex tw-items-center tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-text-md-regular tw-text-primary placeholder:tw-text-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsOpenLevel(!isOpenLevel)}
                >
                  <div className="tw-flex tw-text-left">
                    <div className="tw-mr-2">
                      <BackPackIcon />
                    </div>
                    <div>
                      {selectedLevel ? (
                        <div className="tw-w-[250px] tw-text-md-medium tw-text-primary tw-truncate">
                          {selectedLevel.name}
                        </div>
                      ) : (
                        <div className="tw-text-md-regular tw-text-placeholder">Select Level</div>
                      )}
                    </div>
                  </div>
                  <div className="tw-flex">
                    {selectedLevel && (
                      <div
                        className="tw-cursor-pointer tw-flex tw-items-center tw-mr-2"
                        onClick={(event) => handleSelectLevel(event, null)}
                      >
                        <CloseIcon />
                      </div>
                    )}
                    <span
                      className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                        isOpenLevel ? 'tw-rotate-180' : ''
                      }`}
                    >
                      <DropdownChevron />
                    </span>
                  </div>
                </button>
                {isOpenLevel && (
                  <div
                    className="tw-w-[352px] tw-absolute tw-right-6 tw-z-10 tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none tw-max-h-[450px] tw-overflow-y-scroll custom-thin-scrollbar"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="tw-p-sm tw-space-y-xs" role="none">
                      {modifiedLevels &&
                        modifiedLevels.map((level: LevelDto, index: number) => {
                          return (
                            <div
                              className={`tw-flex tw-justify-between tw-py-10px tw-pr-10px tw-pl-md tw-text-md-medium tw-text-primary tw-cursor-pointer tw-rounded-sm hover:tw-bg-active ${
                                selectedLevel?.id === level.id && 'tw-bg-secondary'
                              }`}
                              role="menuitem"
                              id={`menu-item-${index}`}
                              key={`menu-item-${index}`}
                              onClick={(event) => handleSelectLevel(event, level)}
                            >
                              <div>{level.name}</div>
                              <div>{selectedLevel?.id == level.id && <DropdownCheckIcon />}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
              <div ref={areaDropdownRef}>
                <button
                  type="button"
                  className="tw-flex tw-items-center tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-text-md-regular tw-text-primary placeholder:tw-text-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsOpenArea(!isOpenArea)}
                >
                  <div className="tw-flex tw-text-left">
                    <div className="tw-mr-2">
                      <ClosedBookIcon />
                    </div>
                    <div>
                      {selectedArea ? (
                        <div className="tw-w-[250px] tw-text-md-medium tw-text-primary tw-truncate">
                          {selectedArea.name}
                        </div>
                      ) : (
                        <div className="tw-text-md-regular tw-text-placeholder">Select Area</div>
                      )}
                    </div>
                  </div>
                  <div className="tw-flex">
                    {selectedArea && (
                      <div
                        className="tw-cursor-pointer tw-flex tw-items-center tw-mr-2"
                        onClick={(event) => handleSelectArea(event, null)}
                      >
                        <CloseIcon />
                      </div>
                    )}
                    <span
                      className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                        isOpenArea ? 'tw-rotate-180' : ''
                      }`}
                    >
                      <DropdownChevron />
                    </span>
                  </div>
                </button>
                {isOpenArea && (
                  <div
                    className="tw-w-[352px] tw-absolute tw-right-6 tw-z-10 tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none tw-max-h-[450px] tw-overflow-y-scroll custom-thin-scrollbar"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="tw-p-sm tw-space-y-xs" role="none">
                      {selectedLevel && areas ? (
                        areas.map((area: AreaDto, index: number) => {
                          return (
                            <div
                              className={`tw-flex tw-justify-between tw-py-10px tw-pr-10px tw-pl-md tw-text-md-medium tw-text-primary tw-cursor-pointer tw-rounded-sm hover:tw-bg-active ${
                                selectedArea?.id === area.id && 'tw-bg-secondary'
                              }`}
                              role="menuitem"
                              id={`menu-item-${index}`}
                              key={`menu-item-${index}`}
                              onClick={(event) => handleSelectArea(event, area)}
                            >
                              <div>{area.name}</div>
                              <div>{selectedArea?.id == area.id && <DropdownCheckIcon />}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="tw-flex tw-py-10px tw-pr-10px tw-space-x-lg tw-pl-md tw-text-sm-regular tw-text-secondary tw-rounded-sm">
                          <AlertCircleIcon />
                          <div>Please select a level first</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div ref={topicDropdownRef}>
                <button
                  type="button"
                  className="tw-flex tw-items-center tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-text-md-regular tw-text-primary placeholder:tw-text-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setIsOpenTopic(!isOpenTopic)}
                >
                  <div className="tw-flex tw-text-left">
                    <div className="tw-mr-2">
                      <OpenBookIcon />
                    </div>
                    <div>
                      {selectedArea && selectedTopic ? (
                        <div className="tw-w-[250px] tw-text-md-medium tw-text-primary tw-truncate">
                          {selectedTopic.name}
                        </div>
                      ) : (
                        <div className="tw-text-md-regular tw-text-placeholder">Select Topic</div>
                      )}
                    </div>
                  </div>
                  <div className="tw-flex">
                    {selectedArea && selectedTopic && (
                      <div
                        className="tw-cursor-pointer tw-flex tw-items-center tw-mr-2"
                        onClick={(event) => handleSelectTopic(event, null)}
                      >
                        <CloseIcon />
                      </div>
                    )}
                    <span
                      className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                        isOpenTopic ? 'tw-rotate-180' : ''
                      }`}
                    >
                      <DropdownChevron />
                    </span>
                  </div>
                </button>
                {isOpenTopic && (
                  <div
                    className="tw-w-[352px] tw-absolute tw-right-6 tw-z-10 tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-max-h-[450px] tw-overflow-y-scroll custom-thin-scrollbar"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="tw-p-sm tw-space-y-xs" role="none">
                      {selectedArea && filteredTopics ? (
                        filteredTopics.map((topic: TopicDto, index: number) => {
                          return (
                            <div
                              className={`tw-flex tw-justify-between tw-py-10px tw-pr-10px tw-pl-md tw-text-md-medium tw-text-primary tw-cursor-pointer tw-rounded-sm hover:tw-bg-active ${
                                selectedTopic?.id === topic.id && 'tw-bg-secondary'
                              }`}
                              role="menuitem"
                              id={`menu-item-${index}`}
                              key={`menu-item-${index}`}
                              onClick={(event) => handleSelectTopic(event, topic)}
                            >
                              <div>{topic.name}</div>
                              <div>{selectedTopic?.id == topic.id && <DropdownCheckIcon />}</div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="tw-flex tw-py-10px tw-pr-10px tw-space-x-lg tw-pl-md tw-text-sm-regular tw-text-secondary tw-rounded-sm">
                          <AlertCircleIcon />
                          <div>Please select an area first</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="tw-flex tw-flex-col tw-space-y-3xl tw-pt-2xl tw-px-3xl custom-thin-scrollbar tw-overflow-y-auto tw-max-h-[calc(100vh-325px)]">
              {renderLessonCards}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
