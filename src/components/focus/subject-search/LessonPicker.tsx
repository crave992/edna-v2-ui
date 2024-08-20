import { useFocusContext } from '@/context/FocusContext';
import { FC, Dispatch, SetStateAction, CSSProperties, useState, useEffect } from 'react';
import AreaDto from '@/dtos/AreaDto';
import TopicDto from '@/dtos/TopicDto';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { useClickOutside } from '@mantine/hooks';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { useTopicsByLevelQuery } from '@/hooks/useTopicsQuery';
import { useLevelsQuery } from '@/hooks/queries/useLevelsQuery';
import LevelDto from '@/dtos/LevelDto';
import UncontrolledSelect from '@/components/ui/Uncontrolled/UncontrolledSelect';
import { replaceLevelName } from '@/utils/replaceLevelName';

interface LessonPickerProps {
  areas: AreaDto[] | undefined;
  topics: TopicDto[] | undefined;
  onClose: () => void;
  popperRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  popperElementRef: HTMLDivElement | null;
  popperStyle: CSSProperties;
  popperAttributes: { [key: string]: string } | undefined;
  handleAreaClick: (areaId: number | undefined) => void;
  totalProgress: number;
  fromCustomLessonExtension?: boolean;
  setSelectedTopic?: Function;
  setSelectedArea?: Function;
  showAreaProgress: boolean;
}

const LessonPicker: FC<LessonPickerProps> = ({
  areas,
  onClose,
  popperRef,
  popperStyle,
  popperAttributes,
  handleAreaClick,
  totalProgress,
  fromCustomLessonExtension = false,
  setSelectedTopic,
  setSelectedArea,
  showAreaProgress,
}) => {
  const router = useRouter();
  const {
    areaId,
    setAreaId,
    topicId,
    setTopicId,
    levelId,
    setLevelId,
    nonFocusLevelId,
    setNonFocusLevelId,
    nonFocusAreaId,
    openLessonOverview,
    organization,
    openProgress,
  } = useFocusContext();
  const [hoveredTopic, setHoveredTopic] = useState<number | undefined>(undefined);
  const [hoveredArea, setHoveredArea] = useState<number | undefined>(areaId);
  const [latestHoveredArea, setLatestHoveredArea] = useState<number | undefined>(areaId);
  const outerDivRef = useClickOutside(onClose);

  const { data: topics } = useTopicsByLevelQuery(levelId!);
  const { data: levels } = useLevelsQuery();

  const modifiedLevels =
    levels &&
    levels.length > 0 &&
    levels?.map((level: LevelDto) => ({
      ...level,
      name: replaceLevelName(level.name, organization?.termInfo),
    }));

  useEffect(() => {
    setLatestHoveredArea(hoveredArea);
  }, [hoveredArea]);

  useEffect(() => {
    if (openLessonOverview) setLatestHoveredArea(undefined);
  }, [openLessonOverview]);

  const handleSelectLevel = (selectedLevel: LevelDto) => {
    if (openProgress) {
      setNonFocusLevelId(selectedLevel.id);
      onClose();
    } else {
      setLevelId(selectedLevel.id);
      setAreaId(undefined);
      setHoveredArea(undefined);
    }
  };

  const filteredTopics =
    topics &&
    topics.length > 0 &&
    topics.filter((topic: TopicDto) => topic.areaId === latestHoveredArea ?? topic.areaId === areaId);

  const filteredTopicCount = filteredTopics ? filteredTopics.length : 0;

  return (
    <div
      className="tw-absolute -tw-mt-md tw-px-0 tw-z-[100] tw-rounded-xl"
      ref={(node) => {
        popperRef(node);
        outerDivRef.current = node;
      }}
      style={popperStyle}
      {...popperAttributes}
    >
      <div className="tw-flex tw-flex-row">
        <div
          className={`tw-border box-shadow-custom-left tw-border-solid tw-border-secondary tw-w-[192px] tw-bg-secondary ${
            latestHoveredArea === undefined || hoveredArea == undefined ? 'tw-rounded-xl' : 'tw-rounded-l-xl'
          } ${(openLessonOverview || openProgress) && !fromCustomLessonExtension ? 'tw-rounded-r-xl' : ''}`}
        >
          {!openProgress ? (
            <UncontrolledSelect
              data={modifiedLevels && modifiedLevels.length > 0 ? modifiedLevels : []}
              mainContainerClassName={`!tw-px-4xl !tw-py-xl !tw-space-y-lg ${openProgress && '!tw-border-b-0'}`}
              containerClassName="!tw-border-transparent !tw-cursor-default !tw-bg-secondary !tw-text-left"
              setSelectedItems={handleSelectLevel}
              selectedItems={
                modifiedLevels &&
                modifiedLevels.length > 0 &&
                modifiedLevels.find((level: LevelDto) => level.id == (openProgress ? nonFocusLevelId : levelId))
              }
              dropdownClassName="!tw-bg-secondary !tw-space-y-lg"
              component="Level"
              anchorRight={false}
            />
          ) : (
            <div className="tw-px-2xl tw-py-xl tw-space-y-lg">
              {modifiedLevels && modifiedLevels.length > 0
                ? modifiedLevels
                    .filter((level: LevelDto) => level.id !== nonFocusLevelId)
                    .map((level: LevelDto) => {
                      return (
                        <div
                          key={`${level.id}`}
                          className="tw-text-md-semibold tw-text-secondary tw-cursor-pointer"
                          onClick={() => {
                            setNonFocusLevelId(level.id);
                            onClose();
                          }}
                        >
                          {level.name}
                        </div>
                      );
                    })
                : []}
            </div>
          )}
          {!openProgress && (
            <div
              className={`tw-bg-white tw-px-xl tw-py-lg tw-space-y-xs ${
                latestHoveredArea === undefined || hoveredArea == undefined ? 'tw-rounded-b-xl' : 'tw-rounded-bl-xl'
              }`}
            >
              {router.pathname !== '/focus/class' && !openLessonOverview && !openProgress && (
                <div
                  className={`tw-flex tw-justify-between tw-py-md tw-px-xl tw-w-full tw-rounded-sm tw-cursor-pointer div-for-gradient ${
                    areaId === undefined ? 'div-with-gradient' : ''
                  }`}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHoveredArea(undefined);
                    }
                  }}
                  onClick={() => {
                    handleAreaClick(undefined);
                    onClose();
                  }}
                >
                  <div className="tw-text-sm-medium tw-text-secondary">All Areas</div>
                  {showAreaProgress && <div className="tw-text-sm-medium tw-text-tertiary">{totalProgress}%</div>}
                </div>
              )}
              {areas &&
                areas.length > 0 &&
                areas.map((area: AreaDto) => {
                  const colorScheme = lessonTypeColors[area.name] || {
                    veryDark: '#101828',
                    dark: '#344054',
                    light: '#F2F4F7',
                    medium: '#98A2B3',
                    lightMedium: '#EAECF0',
                    alertColor: '#667085',
                  };
                  const { light } = colorScheme;

                  return (
                    <div
                      key={area.id}
                      className={`tw-flex tw-items-center tw-justify-between tw-py-md tw-px-xl tw-rounded-sm tw-cursor-pointer ${
                        (openLessonOverview || openProgress ? nonFocusAreaId == area.id : areaId == area.id)
                          ? 'tw-bg-secondary'
                          : ''
                      }`}
                      onMouseEnter={() => {
                        if (!isMobile) {
                          setHoveredArea(area.id);
                        }
                      }}
                      style={{
                        backgroundColor:
                          latestHoveredArea == area.id ||
                          (openLessonOverview || openProgress ? nonFocusAreaId == area.id : areaId == area.id)
                            ? light
                            : '#FFF',
                      }}
                      onClick={() => {
                        handleAreaClick(area.id);
                        setHoveredArea(area.id);
                        if (openLessonOverview && !fromCustomLessonExtension) onClose();
                      }}
                    >
                      <div className="tw-text-sm-medium tw-text-secondary">{area.name}</div>
                      {showAreaProgress && (
                        <div className="tw-text-sm-medium tw-text-tertiary">
                          {parseFloat(area.progress.toFixed(0)) ?? 0}%
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        {!openLessonOverview && hoveredArea && !openProgress && filteredTopics && (
          <div
            className={`tw-max-h-[522px] tw-min-h-[192px] tw-border tw-border-solid tw-border-secondary tw-border-l-0 tw-py-lg tw-px-xl tw-gap-y-xs tw-flex tw-flex-col tw-flex-wrap tw-overflow-auto tw-bg-white tw-rounded-r-xl box-shadow-custom-right ${
              isMobile && filteredTopicCount > 14
                ? '!tw-w-[576px]'
                : isMobile && filteredTopicCount > 7
                ? '!tw-w-[384px]'
                : isMobile && filteredTopicCount <= 7
                ? '!tw-w-[192px]'
                : ''
            }`}
          >
            {filteredTopics.map((topic: TopicDto) => {
              const area = areas?.filter((a) => a.id === latestHoveredArea ?? a.id === areaId)[0];
              const colorScheme = lessonTypeColors[area ? area.name : 0] || {
                veryDark: '#101828',
                dark: '#344054',
                light: '#F2F4F7',
                medium: '#98A2B3',
                lightMedium: '#EAECF0',
                alertColor: '#667085',
              };
              const { light } = colorScheme;

              return (
                <div
                  key={topic.id}
                  className={`tw-w-[160px] tw-text-sm-medium tw-py-md tw-px-xl tw-text-secondary tw-rounded-sm tw-cursor-pointer ${
                    topicId === topic.id ? 'tw-bg-secondary' : ''
                  } [&:not(:last-child)]:tw-mr-xl`}
                  onMouseEnter={() => setHoveredTopic(topic.id)}
                  onMouseLeave={() => setHoveredTopic(undefined)}
                  onClick={() => {
                    if (fromCustomLessonExtension && setSelectedArea && setSelectedTopic) {
                      setSelectedArea(area);
                      setSelectedTopic(topic);
                      onClose();
                      return;
                    }
                    setAreaId(area ? area.id : 0);
                    setTopicId(topic.id);

                    onClose();
                  }}
                  style={{ backgroundColor: hoveredTopic === topic.id || topicId === topic.id ? light : '#FFF' }}
                >
                  {topic.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPicker;
