import { FC, useState, Dispatch, SetStateAction, CSSProperties, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@mantine/hooks';
import CustomButton from '@/components/ui/CustomButton';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDeleteStudentMilestone } from '@/hooks/useDeleteStudentMilestone';
import { StudentMilestoneDto } from '@/dtos/StudentDto';
import { useMutation } from '@tanstack/react-query';
import { downloadFile } from '@/services/api/downloadMilestoneImage';
import useNotification from '@/hooks/useNotification';
import CheckCircleIcon from '@/components/svg/CheckCircle';
import { useFocusContext } from '@/context/FocusContext';
import TrashIcon from '@/components/svg/TrashIcon';
interface MilestonesPopoverProps {
  onClose: () => void;
  setIsPopoverOpen: Function;
  popperRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  popperElementRef: HTMLDivElement | null;
  popperStyle: CSSProperties;
  popperAttributes: { [key: string]: string } | undefined;
  editLesson: Function;
  parentRef?: HTMLDivElement | null;
  milestone?: StudentMilestoneDto;
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

const MilestonesPopover: FC<MilestonesPopoverProps> = ({
  onClose,
  setIsPopoverOpen,
  popperRef,
  popperStyle,
  popperAttributes,
  popperElementRef,
  editLesson,
  parentRef,
  milestone,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState(false);
  const { currentUserRoles } = useFocusContext();
  const notify = useNotification;
  const heightRef = useRef<HTMLDivElement | null>(null);

  const downloadFileMutation = useMutation(
    async ({ id, fileName }: { id: number; fileName: string }) => {
      return await downloadFile(id, fileName);
    },
    {
      onSuccess: (_, variables) => {
        notify('File downloaded', <CheckCircleIcon />);
        setIsPopoverOpen(false);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const deleteStudentMilestone = useDeleteStudentMilestone({
    handleSuccess: (data, error, variables) => {
      notify(
        'Milestone deleted',
        <TrashIcon color="brand" />,
        'tw-w-[32px] tw-h-[32px] tw-p-md tw-rounded-full tw-bg-button-secondary-bg-hover tw-text-brand tw-flex tw-items-center tw-justify-center'
      );
      setConfirmationPopup(false);
      setIsPopoverOpen(false);
    },
  });

  const handleEdit = () => {
    editLesson(milestone);
    setIsPopoverOpen(false);
  };

  useClickOutside(() => onClose(), null, [popperElementRef, parentRef ? parentRef : null]);

  const handleDelete = () => {
    deleteStudentMilestone.mutate({ milestoneId: Number(milestone?.id) });
  };

  const handleDownload = () => {
    downloadFileMutation.mutateAsync({
      id: milestone?.id ?? 0,
      fileName: 'MilestoneImage',
    });
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
            {currentUserRoles && !currentUserRoles.isAssociateGuide && (
              <div
                className={`
            tw-border
            tw-border-solid
            tw-border-l-0
            tw-border-r-0
            tw-border-t-0
            tw-border-secondary 
          `}
                //onClick={() => handleDuplicate()}
              >
                <PopoverButton title="Edit" imageSrc={'/images/edit-02-new.svg'} onClick={() => handleEdit()} />
                {/* <PopoverButton title="Duplicate" imageSrc={'/images/copy-07.svg'} /> */}
              </div>
            )}
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
                title={`Download`}
                imageSrc={'/images/download-cloud-02.svg'}
                onClick={() => handleDownload()}
                disabled={false ?? false} //Boolean(lesson?.recordKeepings?.length)
                disabledMessage={'This lesson is currently assigned to a student and cannot be deleted.'}
              />
              {currentUserRoles && !currentUserRoles.isAssociateGuide && (
                <PopoverButton
                  title={`Delete`}
                  imageSrc={'/images/trash-01.svg'}
                  onClick={() => setConfirmationPopup(true)}
                  disabled={false ?? false} //Boolean(lesson?.recordKeepings?.length)
                  disabledMessage={'This lesson is currently assigned to a student and cannot be deleted.'}
                />
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="tw-p-14px">Are you sure you want to delete milestone?</div>
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
                isLoading={deleteStudentMilestone.isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestonesPopover;
