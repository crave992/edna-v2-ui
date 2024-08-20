import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import AreaDto from '@/dtos/AreaDto';
import TopicDto from '@/dtos/TopicDto';
import { useFocusContext } from '@/context/FocusContext';
import AreaColorGuide from '@/components/focus/area/AreaColorGuide';
import { useDisclosure } from '@mantine/hooks';
import AttendanceCloseIcon from '@/components/svg/AttendanceCloseIcon';
import { useRouter } from 'next/router';
import SubjectSearch from '@/components/focus/subject-search/SubjectSearch';
import CustomButton from '@/components/ui/CustomButton';
import FeaturedIcon from '@/components/ui/FeaturedIcon';
import ChevronDownIcon from '@/components/svg/ChevronDown';
import BookOpenIcon from '@/components/svg/BookOpen';
import { useNavbarContext } from '@/context/NavbarContext';
import { usePopover } from '@/hooks/usePopover';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LessonPicker from '@/components/focus/subject-search/LessonPicker';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import SkeletonArea from './area/SkeletonArea';
import FilePlus from '@/components/svg/FilePlus';
import { useTopicsByLevelQuery } from '@/hooks/useTopicsQuery';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import { useLessonsQuery } from '@/hooks/queries/useLessonsQuery';
import { GlobalSlatedIcon } from '@/components/svg/GlobalSlated';
import CustomButtonGroup from '@/components/ui/CustomButtonGroup';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import LevelDto from '@/dtos/LevelDto';
import { replaceLevelName } from '@/utils/replaceLevelName';
import { isMobile } from 'react-device-detect';

type FocusLayoutProps = {
  children?: ReactNode;
};

export default function FocusLayout({ children }: FocusLayoutProps) {
  const router = useRouter();
  const {
    areaId,
    setAreaId,
    topicId,
    setTopicId,
    classId,
    levelId,
    studentId,
    lessonId,
    setLessonId,
    openLessonOverview,
    currentUserRoles,
    setOpenLessonOverview,
    setOpenAddCustomLesson,
    openProgress,
    setOpenProgress,
    selectedClass,
    organization,
    nonFocusLevelId,
    setNonFocusLevelId,
    nonFocusAreaId,
    setNonFocusAreaId,
    nonFocusTopicId,
    setNonFocusTopicId,
  } = useFocusContext();
  const [opened, { close }] = useDisclosure(false);
  const [showOffLevel, setShowOffLevel] = useState<boolean>(false);
  const [filteredTopics, setFilteredTopics] = useState<TopicDto[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaDto[]>([]);
  const [openAreaPopup, setOpenAreaPopup] = useState<boolean>(false);
  const [showAreaProgress, setShowAreaProgress] = useState<boolean>(true);
  const { openSubNavbar } = useNavbarContext();
  const { setReferenceElement, popperElement, setPopperElement, setPopperPlacement, popOverStyles, popOverAttributes } =
    usePopover();

  const { areas, isLoadingAreas, areasStudent, areasByLevelStudent } = useAreasQuery(levelId!, classId!, studentId!);
  const { data: topics } = useTopicsByLevelQuery(levelId!);
  const { data: lessons } = useLessonsQuery({ levelId });
  const { data: levels } = useLevelsQuery();

  const modifiedLevels =
    levels &&
    levels.length > 0 &&
    levels?.map((level: LevelDto) => ({
      ...level,
      name: replaceLevelName(level.name, organization?.termInfo),
    }));

  const buttons = [
    {
      label: '3 Months',
      onClick: () => alert('3 Months clicked'),
    },
    {
      label: '6 Months',
      onClick: () => alert('6 Months clicked'),
    },
    {
      label: '1 Year',
      onClick: () => alert('1 Year clicked'),
    },
  ];

  const handleAreaClick = (areaId: number | undefined) => {
    if (openProgress || openLessonOverview) {
      setNonFocusAreaId(areaId);
      setNonFocusTopicId(undefined);
    } else {
      setAreaId(areaId);
      setTopicId(undefined);
      setLessonId(undefined);
    }
  };

  useEffect(() => {
    if (levelId) setNonFocusLevelId(levelId);
    if (areaId) setNonFocusAreaId(areaId);
    if (topicId) setNonFocusTopicId(topicId);
  }, [openProgress, openLessonOverview, levelId, areaId, topicId]);

  useEffect(() => {
    let newFilteredTopics = [];

    if (topics) {
      let selectedAreaId =
        areaId === undefined &&
        (router.pathname === '/focus/class' || router.pathname === '/directory/class/[id]/focus') &&
        areas &&
        areas.length > 0
          ? areas[0].id
          : areaId;

      if (areaId) {
        const area = areas && areas.filter((area: AreaDto) => area.id === areaId);
        if (area && area.length === 0 && areas && areas.length > 0) setAreaId(areas[0].id);
      }

      if (selectedAreaId !== undefined) {
        newFilteredTopics = topics.filter((topic: TopicDto) => topic.area.id === selectedAreaId);
      } else {
        newFilteredTopics = topics;
      }

      setFilteredTopics(newFilteredTopics);

      if (router.pathname == '/focus/class' || router.pathname == '/focus/lesson') {
        setShowAreaProgress(selectedClass?.levelId == levelId);
      }

      if (
        (router.pathname === '/focus/class' || router.pathname === '/directory/class/[id]/focus') &&
        topicId === undefined &&
        newFilteredTopics.length > 0
      ) {
        setTopicId(newFilteredTopics[0].id);
      }

      if (
        (router.pathname === '/focus/class' || router.pathname === '/directory/class/[id]/focus') &&
        topicId !== undefined &&
        newFilteredTopics.length > 0
      ) {
        const topic = topics.filter((topic: TopicDto) => topic.id === topicId)[0];
        if (topic?.area?.id !== selectedAreaId) setTopicId(newFilteredTopics[0].id);
      }

      if (areaId === undefined && selectedAreaId !== undefined) {
        setAreaId(selectedAreaId);
      }
    } else {
      setFilteredTopics([]);
    }
  }, [topics, topicId, areaId, router.pathname, areas]);

  useEffect(() => {
    if (levels && levels.length > 0 && levelId && selectedClass && selectedClass.levelId !== levelId) {
      setShowOffLevel(true);
    } else {
      setShowOffLevel(false);
    }
  }, [levelId, selectedClass, levels, studentId]);

  useEffect(() => {
    if ((router.pathname === '/focus/student' || openProgress) && areasByLevelStudent && studentId) {
      setFilteredAreas(areasByLevelStudent);
    } else if (router.pathname !== '/focus/student' && areas) {
      setFilteredAreas(areas);
    }
  }, [areas, areasByLevelStudent, router.pathname, studentId, openProgress]);

  const progressValue = useMemo(() => {
    if (filteredAreas && areaId !== undefined) {
      const area = filteredAreas.find((area: AreaDto) => area.id === areaId);
      return area ? parseFloat(area?.progress.toFixed(0)) : 0;
    }

    return undefined;
  }, [filteredAreas, areaId, lessonId]);

  const progressPathColor = useMemo(() => {
    if (filteredAreas && filteredAreas.length > 0) {
      const area = filteredAreas.find((area: AreaDto) => area.id === areaId);
      const areaName = area ? area.name : '';
      const areaColor = lessonTypeColors[areaName];
      return areaColor ? areaColor.alertColor : '#FFA400';
    }

    return '#FFA400';
  }, [filteredAreas, areaId]);

  const totalPercentage = useMemo(() => {
    if (filteredAreas && filteredAreas.length > 0) {
      let totalLessons = 0;
      let totalAcquired = 0;
      filteredAreas.forEach((area: AreaDto) => {
        totalLessons += area.totalLessons ? area.totalLessons : 0;
        totalAcquired += area.totalAcquiredLessons ? area.totalAcquiredLessons : 0;
      });

      // Do not multiply by total students if in student focus
      return Math.round(isNaN(totalAcquired / totalLessons) ? 0 : (totalAcquired / totalLessons) * 100);
    }

    return 0;
  }, [filteredAreas, lessonId]);

  return (
    <div
      className={`tw-bg-secondary ${
        openSubNavbar && isMobile
          ? 'tw-h-[calc(100vh-118px)]'
          : openSubNavbar && !isMobile
          ? 'tw-h-[calc(100vh-130px)]'
          : 'tw-h-[calc(100vh-66px)]'
      }`}
    >
      <div className="tw-min-w-[1016px] tw-mx-4xl tw-py-xl" ref={setReferenceElement}>
        <SubjectSearch className="tw-flex tw-justify-between tw-space-x-md">
          {isLoadingAreas ? (
            <SkeletonArea />
          ) : (
            <>
              <div
                className="tw-h-[38px] tw-flex tw-space-x-xl tw-items-center tw-cursor-pointer"
                onClick={() => {
                  setOpenAreaPopup(!openAreaPopup);
                  setPopperPlacement('bottom-start');
                }}
              >
                {!openLessonOverview && showAreaProgress && (
                  <div className="tw-min-w-[64px] tw-w-[64px] tw-h-[29px] tw-text-primary tw-mb-[5px]">
                    <CircularProgressbar
                      value={
                        progressValue !== undefined && !isNaN(progressValue)
                          ? progressValue
                          : totalPercentage !== undefined && !isNaN(totalPercentage)
                          ? totalPercentage
                          : 0
                      }
                      text={
                        progressValue !== undefined && !isNaN(progressValue)
                          ? `${progressValue}%`
                          : totalPercentage !== undefined && !isNaN(totalPercentage)
                          ? `${totalPercentage}%`
                          : ''
                      }
                      circleRatio={0.5}
                      // strokeWidth={10}
                      styles={{
                        path: {
                          stroke: progressPathColor,
                          strokeLinecap: 'round',
                          transition: 'stroke-dashoffset 0.5s ease 0s',
                          transform: 'rotate(0.75turn)',
                          transformOrigin: 'center center',
                        },
                        trail: {
                          stroke: '#EAECF0',
                          strokeLinecap: 'round',
                          transform: 'rotate(0.75turn)',
                          transformOrigin: 'center center',
                        },
                        text: {
                          fill: '#101828',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  </div>
                )}
                {(showOffLevel || openProgress) && (
                  <div className="tw-text-display-sm-regular tw-text-black">
                    {(modifiedLevels &&
                      modifiedLevels.length > 0 &&
                      modifiedLevels.find(
                        (level: LevelDto) =>
                          level.id === (openProgress || openLessonOverview ? nonFocusLevelId : levelId)
                      )?.name + '') ||
                      'Level not found'}
                  </div>
                )}
                {!openProgress && (
                  <div className="tw-text-display-sm-regular tw-text-black tw-line-clamp-1">
                    {(openProgress || openLessonOverview ? nonFocusAreaId : areaId) && areas && areas.length > 0
                      ? areas.map((area: AreaDto) => {
                          let areaIdDisplay;
                          if (openLessonOverview || openProgress) {
                            areaIdDisplay = nonFocusAreaId;
                          } else {
                            areaIdDisplay = areaId;
                          }
                          return area.id === areaIdDisplay && area.name;
                        })
                      : 'All Areas'}
                  </div>
                )}
                {!openProgress && !openLessonOverview && topicId && (
                  <div className="tw-text-xl-regular tw-text-secondary tw-line-clamp-1">
                    {topics &&
                      topics.length > 0 &&
                      topics
                        .filter((topic: TopicDto) => topic.id === topicId)
                        .map((topic: TopicDto) => {
                          return topic.name;
                        })}
                  </div>
                )}
                <div className="tw-cursor-pointer">
                  <FeaturedIcon size="sm" type="light" color="gray">
                    <ChevronDownIcon />
                  </FeaturedIcon>
                </div>
              </div>
              <div
                className={`tw-flex tw-items-center tw-gap-xl ${
                  openLessonOverview &&
                  currentUserRoles?.canUpdateLesson &&
                  (currentUserRoles?.isStaff
                    ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist
                    : true) &&
                  'tw-w-[322px]'
                }`}
              >
                {openLessonOverview &&
                  currentUserRoles?.canUpdateLesson &&
                  (currentUserRoles?.isStaff
                    ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist
                    : true) && (
                    <CustomButton
                      text="Add Extension"
                      heirarchy={`secondary-color`}
                      btnSize="sm"
                      onClick={() => setOpenAddCustomLesson(true)}
                      iconTrailing={<FilePlus />}
                      className="!tw-w-auto"
                    />
                  )}
                {!openLessonOverview && (
                  <CustomButton
                    text="Progress"
                    heirarchy={`${openProgress ? 'primary' : 'secondary-gray'}`}
                    btnSize="sm"
                    onClick={() => setOpenProgress(!openProgress)}
                    iconTrailing={<GlobalSlatedIcon color={openProgress ? 'brand' : 'gray'} />}
                    disabled={!lessons}
                    className="!tw-w-auto"
                  />
                )}
                {!openProgress && (
                  <CustomButton
                    text="Lesson Album"
                    heirarchy={`${openLessonOverview ? 'primary' : 'secondary-gray'}`}
                    btnSize="sm"
                    onClick={() => setOpenLessonOverview(!openLessonOverview)}
                    iconTrailing={<BookOpenIcon color={openLessonOverview ? 'brand' : 'gray'} />}
                    disabled={!lessons}
                    className="!tw-w-auto !tw-flex
                     !tw-truncate"
                  />
                )}
              </div>
            </>
          )}
        </SubjectSearch>
      </div>
      {openAreaPopup && (
        <LessonPicker
          areas={filteredAreas}
          topics={filteredTopics}
          onClose={() => setOpenAreaPopup(false)}
          popperRef={setPopperElement}
          popperElementRef={popperElement}
          popperStyle={popOverStyles.popper}
          popperAttributes={popOverAttributes.popper}
          handleAreaClick={handleAreaClick}
          totalProgress={totalPercentage}
          showAreaProgress={showAreaProgress}
        />
      )}
      <Modal show={opened} onHide={close} dialogClassName="area-color-guide-modal">
        <Modal.Header className="tw-bg-white tw-flex tw-justify-between">
          <Modal.Title className="tw-p-lg next-modal-title">Area Color Guide</Modal.Title>
          <div className="tw-p-lg tw-cursor-pointer" onClick={close}>
            <AttendanceCloseIcon />
          </div>
        </Modal.Header>
        <Modal.Body>
          <AreaColorGuide areas={areas} />
        </Modal.Body>
      </Modal>
      <div>{children}</div>
    </div>
  );
}
