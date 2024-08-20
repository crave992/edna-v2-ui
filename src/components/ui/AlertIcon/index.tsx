import AlertCircleIcon from '@/components/svg/AlertCircle';
import React, { ReactNode } from 'react';

interface AlertIconProps {
  type?: string;
  icon?: ReactNode;
}

export const AlertIcon = ({ type, icon }: AlertIconProps) => {
  return (
    <div className="tw-flex">
      <div className="tw-relative">
        <div
          className={`tw-absolute tw-h-[24px] tw-w-[24px] tw-p-0 tw-rounded-full tw-opacity-10 tw-ring-[2px] ${
            type === 'error' ? 'tw-ring-red-500' : ''
          } tw-ring-offset-4`}
        ></div>
        <div
          className={`tw-absolute tw-h-[20px] tw-w-[20px] tw-top-[2px] tw-left-[2px] tw-p-0 tw-rounded-full tw-opacity-40 tw-ring-[2px] ${
            type === 'error' ? 'tw-ring-red-500' : ''
          } tw-ring-offset-2`}
        ></div>
        <div className="tw-absolute tw-w-[20px] tw-h-[20px] tw-left-[2px]">
          {icon ?? <AlertCircleIcon color={type} />}
        </div>
      </div>
    </div>
  );
};
