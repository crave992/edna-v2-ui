import CloseIcon from '@/components/svg/CloseIcon';
import React, { ReactNode } from 'react';
import { AlertIcon } from '@/components/ui/AlertIcon';

interface AlertProps {
  type: 'error' | 'succes' | 'warning' | 'info' | 'gray-info';
  icon?: ReactNode;
  errorText: string;
  supportingErrorText?: string;
  onClose: () => void;
  className?: string;
  showCloseIcon?: boolean;
}

const Alert = ({
  type,
  icon,
  errorText,
  supportingErrorText,
  onClose,
  className,
  showCloseIcon = true,
}: AlertProps) => {
  return (
    <div
      className={`tw-flex tw-p-xl tw-mb-xl tw-space-x-xl tw-border tw-border-solid tw-border-primary tw-rounded-xl tw-justify-between ${className}`}
    >
      <div className="tw-space-x-xl">
        {icon && <AlertIcon type={type} icon={icon} />}
        <div className="tw-flex tw-flex-col tw-pl-2xl">
          <div className="tw-text-sm-semibold tw-text-secondary">{errorText}</div>
          <div className="tw-text-sm-regular tw-text-tertiary">{supportingErrorText}</div>
        </div>
      </div>
      {showCloseIcon && (
        <div className="tw-justify-end tw-cursor-pointer" onClick={onClose}>
          <CloseIcon />
        </div>
      )}
    </div>
  );
};

export default Alert;
