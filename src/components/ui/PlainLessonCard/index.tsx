import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { useFocusContext } from '@/context/FocusContext';
import LessonDto from '@/dtos/LessonDto';
import { useMemo, useState } from 'react';
import LessonAlbumPopover from '@/components/focus/student/LessonAlbumPopover';
import { usePopover } from '@/hooks/usePopover';
import { isMobile } from 'react-device-detect';
import useLongPress from '@/hooks/useLongPress';

export interface PlainLessonCardProps {
  classId: number | undefined;
  levelId: number | undefined;
  areaId: number | undefined;
  lessonType: string;
  sequence: string | undefined;
  name: string;
  description: string;
  lessonName: string;
  css?: string;
  lesson: LessonDto;
  materialsUsed?: string;
  setSelectedLesson: Function;
  totalSequence: number;
  totalLessons: number;
}

const placeholderText =
  'Lorem ipsum dolor sit amet interdum congue dictum. Leo feugiat eiusmod venenatis libero elit viverra dapibus. Non massa facilisi magna pretium magna a quisque. Eget cursus nibh nec leo cursus hendrerit proin nisi mollis. Molestie habitasse convallis tortor porta tortor odio enim venenatis erat pretium.';

export default function PlainLessonCard({
  levelId,
  classId,
  areaId,
  lessonType,
  sequence,
  name,
  description = placeholderText,
  css,
  lesson,
  lessonName,
  materialsUsed = '',
  setSelectedLesson,
  totalSequence,
  totalLessons,
}: PlainLessonCardProps) {
  const { lessonId, setLessonId, studentId } = useFocusContext();
  const { referenceElement, setReferenceElement, popperElement, setPopperElement, popOverStyles, popOverAttributes } =
    usePopover("plainLessonCard");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const colorScheme = lessonTypeColors[lessonType] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#F2F4F7',
    medium: '#98A2B3',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
  };
  const { veryDark, dark, light, medium } = colorScheme;

  const { currentUserRoles } = useFocusContext();

  const handleClick = () => {
    setLessonId(lesson.id);
    setShowMore(!showMore);
  };

  const handleOpenContextMenu = (event: any) => {
    event.preventDefault();
    if (lesson.isCustom) {
      setLessonId(lesson.id);
      setIsPopoverOpen(true);
    }
  };

  const onLongPressFn = useLongPress(
    {
      onLongPress() {
        if (isMobile) {
          if (lesson.isCustom) {
            // setLessonId(lesson.id);
            // setIsPopoverOpen(true);
          }
        }
      },
      onTouchRightClick(event: any) {
        // if (lesson.isCustom) {
        //   setIsPopoverOpen(true);
        // }
      },
      onDbClick(event: any) {
        event.preventDefault();
        if (event.button == 0 && !isMobile) {
          handleClick();
        }
        if (isMobile && lesson.isCustom) {
          setIsPopoverOpen(true);
        }
      },
      onClick(event: any) {
        if (event.button == 0) {
          //left click
          event.preventDefault();
          handleClick();
        }
      },
    },
    { shouldPreventDefault: false }
  );

  return (
    <>
      <div
        style={{ backgroundColor: light, borderColor: dark }}
        className={`tw-flex tw-flex-row tw-w-[257px] tw-min-h-[87px] tw-p-lg tw-rounded-md tw-justify-between tw-cursor-pointer ${css} tw-border tw-rounded-md ${
          lesson.isCustom ? 'tw-border-dashed' : 'tw-border-solid'
        }`}
        onContextMenu={(event) => handleOpenContextMenu(event)}
        ref={setReferenceElement}
        {...onLongPressFn}
      >
        <div className={`tw-w-full tw-select-none `}>
          <div className="tw-h-[18px] tw-flex tw-flex-nowrap tw-items-center tw-gap-x-xs">
            {sequence && (
              <div
                style={{ color: dark, backgroundColor: medium }}
                className="tw-text-xs-medium tw-rounded-xs tw-px-xs tw-py-0"
              >
                {sequence}
              </div>
            )}
            <div style={{ color: dark }} className="tw-truncate tw-text-xs-medium">
              {name}
            </div>
          </div>
          <div className="tw-text-sm-regular" style={{ color: veryDark }}>
            {lessonName}
          </div>
          <div className="tw-mt-md tw-text-xs-regular" style={{ color: veryDark }}>
            {showMore ? (description ? description : placeholderText) : ''}
          </div>
          <div className="tw-text-xs-regular tw-mt-md" style={{ color: veryDark }}>
            {showMore ? (
              <>
                {materialsUsed && materialsUsed !== null && materialsUsed !== '' && (
                  <>
                    <div className="tw-underline">Materials Used</div>
                    <div>{materialsUsed}</div>
                  </>
                )}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {isPopoverOpen &&
        currentUserRoles?.canUpdateLesson &&
        (currentUserRoles?.isStaff ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist : true) && (
          <LessonAlbumPopover
            classId={classId}
            levelId={levelId}
            areaId={areaId}
            studentId={studentId}
            lesson={lesson}
            editLesson={() => setSelectedLesson(lesson)}
            onClose={() => setIsPopoverOpen(false)}
            setIsPopoverOpen={setIsPopoverOpen}
            popperRef={setPopperElement}
            popperElementRef={popperElement}
            popperStyle={popOverStyles.popper}
            popperAttributes={popOverAttributes.popper}
            sequence={sequence}
            totalSequence={totalSequence}
            totalLessons={totalLessons}
            parentRef={referenceElement}
          />
        )}
    </>
  );
}
