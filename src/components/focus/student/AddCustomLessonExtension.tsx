import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { useFocusContext } from '@/context/FocusContext';
import CustomLessonExtensionValidationSchema from '@/validation/CustomLessonExtensionValidationSchema';
import CustomLessonExtensionDto from '@/dtos/CustomLessonExtensionDto';
import CustomButton from '@/components/ui/CustomButton';
import LessonPicker from '../subject-search/LessonPicker';
import { useLocalStorage } from '@mantine/hooks';
import TopicDto from '@/dtos/TopicDto';
import AreaDto from '@/dtos/AreaDto';
import { usePopover } from '@/hooks/usePopover';
import { useRouter } from 'next/router';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import CustomFormError from '@/components/common/NewCustomFormControls/CustomFormError';
import LessonDto from '@/dtos/LessonDto';
import { useSaveCustomLesson } from '@/hooks/useSaveCustomLesson';
import { useUpdateCustomLesson } from '@/hooks/useUpdateCustomLesson';
import { useAreasQuery } from '@/hooks/queries/useAreasQuery';
import { useTopicsByLevelQuery } from '@/hooks/useTopicsQuery';
import { useLessonsQuery } from '@/hooks/queries/useLessonsQuery';

interface AddCustomLessonExtensionProps {
  component: string;
  selectedLesson: LessonDto | null;
  setSelectedLesson: Function;
}

interface SequenceObject {
  sequenceNumber: number;
}

interface CustomLessonDto {
  name: string;
  sequenceName: string;
  description: string;
  materialUsed: string;
  levelId: number;
  areaId: number;
  topicId: number;
  sequenceNumber: number;
  sequentialAssignment: string;
  isCustom: boolean;
}

export default function AddCustomLessonExtension({ selectedLesson, setSelectedLesson }: AddCustomLessonExtensionProps) {
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
    openAddCustomLesson,
    setOpenAddCustomLesson,
  } = useFocusContext();
  const [filteredTopics, setFilteredTopics] = useState<TopicDto[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<AreaDto[]>([]);
  const [openAreaPopup, setOpenAreaPopup] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<AreaDto | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicDto | null>(null);
  const { setReferenceElement, popperElement, setPopperElement, popOverStyles, popOverAttributes } = usePopover();

  const { areas, areasStudent } = useAreasQuery(levelId!, classId!, studentId!);
  const { data: topics } = useTopicsByLevelQuery(levelId!);

  const saveCustomLesson = useSaveCustomLesson({
    handleSuccess: () => {
      handleSuccess();
    },
  });

  const updateCustomLesson = useUpdateCustomLesson({
    handleSuccess: () => {
      handleSuccess();
    },
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    if (selectedLesson) {
      if (selectedLesson?.name) methods.setValue('title', selectedLesson?.name);
      if (selectedLesson?.description) methods.setValue('description', selectedLesson?.description);
      if (selectedLesson?.materialUsed) methods.setValue('materials', selectedLesson?.materialUsed);
      if (selectedLesson?.area) {
        methods.setValue('areaId', selectedLesson?.area.id);
        setSelectedArea(selectedLesson.area);
      }
      if (selectedLesson?.topic) {
        methods.setValue('topicId', selectedLesson?.topic.id);
        setSelectedTopic(selectedLesson.topic);
      }
    } else {
      methods.reset();
    }
  }, [openAddCustomLesson]);

  const { data: lessons } = useLessonsQuery({
    levelId: levelId!,
    areaId: selectedArea?.id,
    topicId: selectedTopic?.id,
    classId: classId!,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries(['lessons']);
    resetData();
  };

  const methods = useForm<CustomLessonExtensionDto>({
    resolver: yupResolver(CustomLessonExtensionValidationSchema),
  });

  useEffect(() => {
    const body = document.querySelector('body');

    // Add the class to disable scrolling when the modal is open
    if (openAddCustomLesson) {
      body && body.classList.add('body-scroll-lock');
    } else {
      // Remove the class when the modal is closed
      body && body.classList.remove('body-scroll-lock');
    }

    // Cleanup effect
    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [openAddCustomLesson]);

  useEffect(() => {
    if (selectedArea && selectedTopic) {
      methods.setValue('areaId', selectedArea.id);
      methods.setValue('topicId', selectedTopic.id);
      methods.clearErrors('areaId');
    }
  }, [selectedArea, selectedTopic]);

  const resetData = () => {
    methods.reset();
    setSelectedLesson(null);
    setSelectedTopic(null);
    setSelectedArea(null);
    setOpenAddCustomLesson(false);
  };

  const handleSave = async (data: CustomLessonExtensionDto) => {
    const highestSequenceNumber: number = lessons.reduce((highest: number, current: SequenceObject) => {
      return Math.max(highest, current.sequenceNumber);
    }, -Infinity);

    const lessonData: CustomLessonDto = {
      name: data.title,
      sequenceName: '',
      description: data.description,
      materialUsed: data.materials ? data.materials : '',
      levelId: selectedLesson ? selectedLesson.level.id : selectedArea ? selectedArea?.levelId : 0,
      areaId: selectedArea ? selectedArea.id : 0,
      topicId: selectedTopic ? selectedTopic.id : 0,
      sequenceNumber: selectedLesson ? selectedLesson.sequenceNumber : highestSequenceNumber + 1,
      sequentialAssignment: 'No',
      isCustom: true,
    };
    if (selectedLesson) updateCustomLesson.mutate({ data: lessonData, lessonId: selectedLesson.id });
    else saveCustomLesson.mutate(lessonData);
  };

  const handleClose = () => {
    resetData();
    setOpenAddCustomLesson(false);
  };

  const handleAreaClick = (areaId: number | undefined) => {
    setAreaId(areaId);
    setTopicId(undefined);
    setLessonId(undefined);
  };

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

      if (areaId && areas && areas.length > 0) {
        const area = areas.filter((area: AreaDto) => area.id === areaId);
        if (area.length === 0) setAreaId(areas[0].id);
      }

      if (selectedAreaId !== undefined) {
        newFilteredTopics = topics.filter((topic: TopicDto) => topic.area.id === selectedAreaId);
      } else {
        newFilteredTopics = topics;
      }

      setFilteredTopics(newFilteredTopics);

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
    if (router.pathname === '/focus/student' && areasStudent) {
      setFilteredAreas(areasStudent);
    } else if (router.pathname !== '/focus/student' && areas) {
      setFilteredAreas(areas);
    }
  }, [areas, areasStudent, router.pathname, lessonId]);

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

  const getColors = () => {
    if (selectedArea) {
      return (
        lessonTypeColors[selectedArea.name] || {
          veryDark: '#101828',
          dark: '#344054',
          light: '#F2F4F7',
          medium: '#98A2B3',
          lightMedium: '#EAECF0',
          alertColor: '#667085',
        }
      );
    } else return false;
  };

  const colors = getColors();
  const backgroundColor = colors ? colors.light : undefined;
  const borderColor = colors ? colors.dark : undefined;
  const color = colors ? colors.dark : undefined;

  return (
    <AnimatePresence>
      {openAddCustomLesson ? (
        <div className="tw-p-4xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 tw-min-h-screen">
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="tw-p-3xl tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
          >
            <FormProvider {...methods}>
              <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                <div className="tw-justify-between tw-flex tw-mb-2xl">
                  <div className="tw-font-black tw-text-lg">Add Lesson Extension</div>
                  <span className="tw-cursor-pointer" onClick={() => handleClose()}>
                    <NotesCloseIcon />
                  </span>
                </div>

                <div className="tw-space-y-xl">
                  <div className="tw-relative" ref={setReferenceElement}>
                    <CustomButton
                      text={`${
                        selectedArea && selectedTopic
                          ? `${selectedArea.name}, ${selectedTopic.name}`
                          : 'Choose Area & Topic'
                      }`}
                      heirarchy={`secondary-gray`}
                      btnSize="md"
                      onClick={() => setOpenAreaPopup(true)}
                      style={{
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        color: color,
                      }}
                      className={`${selectedArea && selectedTopic ? `tw-border-solid` : ''}`}
                    />
                    {methods.formState.errors['areaId'] && (
                      <CustomFormError error={methods.formState.errors['areaId'].message} />
                    )}
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
                        fromCustomLessonExtension={true}
                        setSelectedArea={setSelectedArea}
                        setSelectedTopic={setSelectedTopic}
                        showAreaProgress={true}
                      />
                    )}
                  </div>

                  <div className="">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">Title</div>
                    <div className="tw-flex tw-w-full">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="title"
                        placeholder="Lesson Title"
                        containerClassName="tw-flex-1"
                      />
                    </div>
                  </div>

                  <div className="">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">Description</div>

                    <textarea
                      rows={4}
                      className="tw-h-[154px] tw-block tw-py-lg tw-px-14px tw-w-full tw-text-md-regular tw-text-placeholder-900 tw-bg-white tw-rounded-md tw-border tw-border-primary tw-resize-none"
                      placeholder="Enter a lesson description..."
                      {...methods.register('description')}
                    />
                    {methods.formState.errors.description && (
                      <CustomFormError error={methods.formState.errors.description.message} />
                    )}
                  </div>

                  <div className="">
                    <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">Materials</div>
                    <div className="tw-flex tw-w-full">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="materials"
                        placeholder="Bead board, globe, construction paper..."
                        containerClassName="tw-flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-pt-0 tw-mt-4xl tw-flex tw-items-center tw-justify-end">
                  <div className="tw-flex tw-items-center tw-justify-center tw-gap-x-lg">
                    <CustomButton
                      text="Cancel"
                      heirarchy="secondary-gray"
                      btnSize="lg"
                      onClick={() => handleClose()}
                      type="button"
                    />
                    <CustomButton
                      text="Save"
                      heirarchy="primary"
                      btnSize="lg"
                      type="submit"
                      iconLeading={<SaveIcon />}
                      isLoading={saveCustomLesson.isLoading || updateCustomLesson.isLoading}
                    />
                  </div>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
