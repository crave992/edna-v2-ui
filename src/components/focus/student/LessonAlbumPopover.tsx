import { useFocusContext } from '@/context/FocusContext';
import LessonDto from '@/dtos/LessonDto';
import { FC, useState, Dispatch, SetStateAction, CSSProperties, useRef } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClickOutside } from '@mantine/hooks';
import CustomButton from '@/components/ui/CustomButton';
import { CustomLessonDto } from '@/dtos/LessonDto';
import { useSaveCustomLesson } from '@/hooks/useSaveCustomLesson';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface LessonAlbumPopoverProps {
  lesson: LessonDto | undefined;
  classId: number | undefined;
  levelId: number | undefined;
  areaId: number | undefined;
  studentId: number | undefined;
  onClose: () => void;
  setIsPopoverOpen: Function;
  popperRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  popperElementRef: HTMLDivElement | null;
  popperStyle: CSSProperties;
  popperAttributes: { [key: string]: string } | undefined;
  sequence: string | undefined;
  editLesson: Function;
  totalSequence: number;
  totalLessons: number;
  parentRef?: HTMLDivElement | null;
}

interface ButtonProps {
  title: string;
  imageSrc: string;
  onClick?: () => void;
  disabled?: boolean | undefined;
  disabledMessage?: string;
}

const PopoverButton: FC<ButtonProps> = ({ title, imageSrc, onClick, disabled, disabledMessage }) => (
  <div className="tw-py-xs tw-px-sm">
    {disabled && disabledMessage ? (
      <OverlayTrigger placement="right" overlay={<Tooltip>{disabledMessage}</Tooltip>}>
        <button
          disabled={disabled}
          className="disabled:tw-bg-white disabled:tw-text-fg-disabled disabled:tw-cursor-not-allowed tw-p-9px tw-px-10px tw-space-x-md tw-border-0 tw-bg-white tw-text-sm-medium tw-text-secondary tw-text-left tw-w-full tw-spacing-md hover:tw-bg-secondary"
        >
          <Image src={imageSrc} alt={title} width={16} height={16} />
          <span>{title}</span>
        </button>
      </OverlayTrigger>
    ) : (
      <button
        className="tw-p-9px tw-px-10px tw-space-x-md tw-border-0 tw-bg-white tw-text-sm-medium tw-text-secondary tw-text-left tw-w-full tw-spacing-md hover:tw-bg-secondary"
        onClick={onClick}
      >
        <Image src={imageSrc} alt={title} width={16} height={16} />
        <span>{title}</span>
      </button>
    )}
  </div>
);

const LessonAlbumPopover: FC<LessonAlbumPopoverProps> = ({
  levelId,
  classId,
  areaId,
  lesson,
  studentId,
  onClose,
  setIsPopoverOpen,
  popperRef,
  popperStyle,
  popperAttributes,
  popperElementRef,
  editLesson,
  totalSequence,
  totalLessons,
  parentRef,
}) => {
  const { setOpenAddCustomLesson } = useFocusContext();
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const heightRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const saveCustomlesson = useSaveCustomLesson({ handleSuccess: () => handleSuccess() });

  useClickOutside(() => onClose(), null, [popperElementRef, parentRef ? parentRef : null]);

  const deleteCustomLessonMutate = useMutation(
    (lessonId: number | undefined) =>
      fetch(`/api/lesson/custom-lesson/${lessonId}`, {
        method: 'DELETE',
      }),
    {
      onMutate: async (variables) => {
        //update add lesson popup lessons
        await queryClient.cancelQueries(['lessons', { level: levelId }]);
        const previousAddLessonPopupLessons = queryClient.getQueryData<LessonDto[]>(['lessons', { level: levelId }]);

        queryClient.setQueryData(['lessons', { level: levelId }], (old: LessonDto[] | undefined) => {
          if (!old) return [];

          const lessonIndex = old.findIndex((l) => l.id === lesson?.id);
          if (lessonIndex === -1) return old;
          const lessonToUpdate = old[lessonIndex];
          if (!lessonToUpdate.recordKeepings) return old;

          const updatedLessons = [...old];
          updatedLessons.splice(lessonIndex, 1);
          return updatedLessons;
        });

        //if (router.pathname === '/focus/class') {
        await queryClient.cancelQueries(['lessonsByLevelClassAreaTopic', levelId, classId, areaId, lesson?.topic.id]);
        const previousFocusClassLessons = queryClient.getQueryData<LessonDto[]>([
          'lessonsByLevelClassAreaTopic',
          levelId,
          classId,
          areaId,
          lesson?.topic.id,
        ]);

        queryClient.setQueryData(
          ['lessonsByLevelClassAreaTopic', levelId, classId, areaId, lesson?.topic.id],
          (old: LessonDto[] | undefined) => {
            if (!old) return [];

            const lessonIndex = old.findIndex((l) => l.id === lesson?.id);
            if (lessonIndex === -1) return old;

            const updatedLessons = [...old];
            updatedLessons.splice(lessonIndex, 1);
            return updatedLessons;
          }
        );

        //if (router.pathname === '/focus/lesson') {
        await queryClient.cancelQueries(['lessons', { level: levelId }]);
        const previousLessonFocusLessons = queryClient.getQueryData<LessonDto[]>(['lessons', { level: levelId }]);

        queryClient.setQueryData(['lessons', { level: levelId }], (old: LessonDto[] | undefined) => {
          if (!old) return [];

          const lessonIndex = old.findIndex((l) => l.id === lesson?.id);
          if (lessonIndex === -1) return old;

          const updatedLessons = [...old];
          updatedLessons.splice(lessonIndex, 1);
          return updatedLessons;
        });

        return { previousAddLessonPopupLessons, previousFocusClassLessons, previousLessonFocusLessons };
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries(['lessons', { level: levelId }]);
        queryClient.invalidateQueries(['lessonsByLevelClassAreaTopic', levelId, classId, areaId, lesson?.topic.id]);
        queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);

        setIsPopoverOpen(false);
      },
      onError: (error, variables, context) => {
        queryClient.setQueryData(
          ['student-lessons', { level: levelId, class: classId, student: studentId }],
          context?.previousAddLessonPopupLessons
        );

        //if (router.pathname === '/focus/class') {
        queryClient.setQueryData(
          ['lessonsByLevelClassAreaTopic', levelId, classId, areaId, lesson?.topic.id],
          context?.previousFocusClassLessons
        );

        //if (router.pathname === '/focus/lesson') {
        queryClient.setQueryData(['lessons', { level: levelId }], context?.previousLessonFocusLessons);
      },
    }
  );

  const handleSuccess = () => {
    queryClient.invalidateQueries(['lessons', { level: levelId }]);
    queryClient.invalidateQueries(['student-lessons', { level: levelId, class: classId, student: studentId }]);
  };

  const handleEdit = () => {
    editLesson();
    setIsPopoverOpen(false);
    setOpenAddCustomLesson(true);
  };

  const handleDelete = () => {
    let lessonId = lesson && lesson.id;
    deleteCustomLessonMutate.mutate(lessonId);
  };

  const modifyString = (str: string) => {
    // Regular expression to match a number inside parentheses
    let match = str.match(/\((\d+)\)/);

    if (match) {
      // If a number inside parentheses is found, increment it
      let number = parseInt(match[1]);
      let newNumber = number + 1;
      let modifiedString = str.replace(/\(\d+\)/, `(${newNumber})`);
      return modifiedString;
    } else {
      // If no number inside parentheses is found, add "(2)"
      return str + ' (2)';
    }
  };

  const handleDuplicate = () => {
    if (lesson) {
      const lessonData: CustomLessonDto = {
        name: modifyString(lesson.name),
        sequenceName: '',
        description: lesson.description,
        materialUsed: lesson.materialUsed,
        levelId: lesson.level.id,
        areaId: lesson.area.id,
        topicId: lesson.topic.id,
        sequenceNumber: totalLessons + 1,
        sequentialAssignment: 'No',
        isCustom: true,
      };
      saveCustomlesson.mutate(lessonData);
    }
  };

  return (
    <div
      className="tw-m-2 tw-absolute tw-rounded-xl tw-bg-white tw-px-0 tw-shadow-md tw-z-[100] tw-border tw-border-solid tw-border-primary"
      ref={popperRef}
      style={popperStyle}
      {...popperAttributes}
    >
      <div className="tw-flex tw-flex-row tw-max-h-[398px]" ref={heightRef}>
        {!confirmationPopup ? (
          <div
            className={`tw-w-[249px] tw-basis-[249px] tw-grow-0 tw-shrink-0 tw-max-w-[249px] tw-border-0 tw-border-solid tw-border-secondary`}
          >
            <div
              className={`
            tw-border
            tw-border-solid
            tw-border-l-0
            tw-border-r-0
            tw-border-t-0
            tw-border-secondary
          `}
            >
              <PopoverButton title="Edit" imageSrc={'/images/edit-02-new.svg'} onClick={() => handleEdit()} />
              <PopoverButton title="Duplicate" imageSrc={'/images/copy-07.svg'} onClick={() => handleDuplicate()} />
            </div>
            <div
              className={`
            tw-border
            tw-border-solid
            tw-border-l-0
            tw-border-r-0
            tw-border-t-0
            tw-border-secondary
          `}
            >
              <PopoverButton
                title={`Delete`}
                imageSrc={'/images/trash-01.svg'}
                onClick={() => setConfirmationPopup(true)}
                disabled={Boolean(lesson?.recordKeepings?.length) ?? false}
                disabledMessage={'This lesson is currently assigned to a student and cannot be deleted.'}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="tw-p-14px">Are you sure you want to delete custom lesson?</div>
            <div className="tw-p-14px tw-flex tw-gap-x-md">
              <CustomButton
                text="Cancel"
                heirarchy={`secondary-gray`}
                btnSize="sm"
                onClick={() => setConfirmationPopup(false)}
                type="button"
              />
              <CustomButton
                text="Delete"
                heirarchy={`primary`}
                btnSize="sm"
                type="button"
                onClick={() => handleDelete()}
                isLoading={deleteCustomLessonMutate.isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonAlbumPopover;
