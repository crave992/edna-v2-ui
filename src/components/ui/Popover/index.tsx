import AttendanceCloseIcon from '@/components/svg/AttendanceCloseIcon';
import { useClickOutside } from '@mantine/hooks';
import { ReactNode, useEffect, useRef } from 'react';

interface PopoverProps {
  top: number;
  left: number;
  header?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
}

export function Popover({ top, left, header, onClose, children }: PopoverProps) {
  const ref = useClickOutside(() => onClose());

  return (
    <div
      ref={ref}
      className="tw-absolute tw-w-[640px] tw-rounded-md tw-bg-white tw-px-0 tw-shadow-md tw-z-10 tw-duration-300"
      style={{ top: `${top - 130}px`, left: `${left}px` }}
    >
      <div className="tw-flex tw-flex-row tw-p-[24px] tw-items-center tw-justify-between tw-border tw-border-solid tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-border-b tw-border-gray-200">
        <div className="tw-text-lg tw-font-semibold">{header}</div>
        <div className="tw-cursor-pointer" onClick={() => onClose()}>
          <AttendanceCloseIcon />
        </div>
      </div>
      {children}
    </div>
  );
}
