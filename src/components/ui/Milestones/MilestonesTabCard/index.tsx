import { useFocusContext } from '@/context/FocusContext';
import { usePopover } from '@/hooks/usePopover';
import Image from 'next/image';
import { useState } from 'react';
import MilestonesPopover from '../MilestonesPopover';
import useLongPress from '@/hooks/useLongPress';
import { isMobile } from 'react-device-detect';
import AddMilestone from '@/components/ui/AddNoteorMilestone/AddMilestone';
import { AnimatePresence, motion } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import { StudentDto, StudentMilestoneDto } from '@/dtos/StudentDto';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);
interface MilestoneProps {
  milestone: any;
  isLast: boolean;
  setDisableScroll: Function;
  student: StudentDto | undefined;
}

const MilestonesTabsCard = ({ milestone, isLast, setDisableScroll, student }: MilestoneProps) => {
  const { referenceElement, setReferenceElement, popperElement, setPopperElement, popOverStyles, popOverAttributes } =
    usePopover();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<StudentMilestoneDto>();
  const [showMilestones, setShowMilestones] = useState(false);
  const { openAddNoteOrMilestone, setOpenAddNoteOrMilestone } = useFocusContext();

  const handleOpenContextMenu = (event: any) => {
    event.preventDefault();
    setIsPopoverOpen(true);
  };

  const onLongPressFn = useLongPress(
    {
      onLongPress() {
        if (isMobile) {
        }
      },
      onTouchRightClick(event: any) {
        // setIsPopoverOpen(true);
      },
      onDbClick(event: any) {
        event.preventDefault();
        if (event.button == 0) {
          // handleClick();
        }
        if (isMobile) {
          setIsPopoverOpen(true);
        }
      },
      onClick(event: any) {
        if (event.button == 0) {
          //left click
          event.preventDefault();
          // handleClick();
        }
      },
    },
    { shouldPreventDefault: false }
  );

  const handleEditLesson = (milestone: any) => {
    setDisableScroll(true);
    setSelectedMilestone(milestone);
    setOpenAddNoteOrMilestone('milestone');
    setShowMilestones(true);
  };

  const handleClose = () => {
    setDisableScroll(false);
    setShowMilestones(false);
  };

  return (
    <>
      <div
        className={`tw-w-[300px] tw-flex-wrap tw-flex tw-flex-row tw-items-start tw-justify-start tw-space-x-lg tw-cursor-pointer`}
        onContextMenu={(event) => handleOpenContextMenu(event)}
        ref={setReferenceElement}
        {...onLongPressFn}
      >
        <div className="tw-space-y-lg tw-w-[300px]">
          <div className="">
            <div className="tw-flex tw-items-center tw-justify-start tw-space-x-md">
              <div className="tw-text-sm-medium tw-text-secondary">{milestone?.createdBy?.fullName}</div>
            </div>
            <div>
              <div className="tw-text-sm-regular tw-text-tertiary tw-truncate">
                {/* {milestone?.student?.firstName} {milestone?.student?.lastName} {convertStatus()} {milestone?.lesson} */}
                {milestone?.title}
              </div>
            </div>
          </div>
          <div className="tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-overflow-hidden">
            <div>
              <Image
                width={300}
                height={172}
                alt=""
                className="tw-h-[172px] tw-w-[300px] tw-pointer-events-none"
                src={milestone?.lessonImageUrl}
              />
            </div>
            {milestone?.lessonImageCaption && milestone?.lessonImageCaption !== '' && (
              <div className="tw-p-lg tw-pt-md tw-text-sm-regular tw-text-secondary tw-bg-primary">
                {milestone?.lessonImageCaption ?? ''}
              </div>
            )}
          </div>
        </div>
      </div>
      {
        //currentUserRoles?.canUpdateLesson && (currentUserRoles?.isStaff ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist : true) &&
        isPopoverOpen && (
          <MilestonesPopover
            milestone={milestone}
            editLesson={(milestone: any) => handleEditLesson(milestone)}
            onClose={() => setIsPopoverOpen(false)}
            setIsPopoverOpen={setIsPopoverOpen}
            popperRef={setPopperElement}
            popperElementRef={popperElement}
            popperStyle={popOverStyles.popper}
            popperAttributes={popOverAttributes.popper}
            parentRef={referenceElement}
          />
        )
      }

      <AnimatePresence>
        {showMilestones && (
          <>
            <div
              className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20"
              style={{ margin: 0 }}
            >
              <motion.div
                key="modal"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
                style={{ margin: 0 }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                  }
                }}
              >
                <div className="tw-px-3xl tw-pt-3xl tw-mb-xl">
                  <div className="tw-justify-between tw-flex">
                    <div className="tw-text-primary tw-text-lg-semibold">Edit Milestone</div>
                    <span className="tw-cursor-pointer" onClick={() => handleClose()}>
                      <NotesCloseIcon />
                    </span>
                  </div>
                  <div className="tw-text-sm-regular tw-text-tertiary">
                    {student?.firstName} {student && student.nickName && `(${student?.nickName})`} {student?.lastName} -{' '}
                    {dayjs(selectedMilestone?.createdOn).format('MMMM Do')}
                  </div>
                </div>
                <AddMilestone
                  lessonState={milestone?.lessonState ?? ''}
                  selectedMilestone={selectedMilestone}
                  showModal={openAddNoteOrMilestone}
                  setShowModal={() => setOpenAddNoteOrMilestone(openAddNoteOrMilestone)}
                  handleClose={() => handleClose()}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MilestonesTabsCard;
