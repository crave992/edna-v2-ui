import LoadingSpinner from '@/components/svg/LoadingSpinner';
import React, { ReactNode } from 'react';
import CustomButton from '../CustomButton';

interface CustomModalProps {
  children: React.ReactNode;
  width?: number;
}

interface CustomModalFooterProps {
  showLoader?: boolean;
  flex?: 'row' | 'col';
  hasCancel?: boolean;
  cancelText?: string;
  cancelLink?: string;
  submitIcon?: ReactNode;
  submitText: string;
  formId?: string;
  onClick?: () => void;
  onCancel?: () => void;
  className?: string;
  submitClass?: string;
  cancelClass?: string;
}

export const CustomModal: React.FC<CustomModalProps> & {
  Header: React.FC<CustomModalProps>;
  Content: React.FC<CustomModalProps>;
  Footer: React.FC<CustomModalFooterProps>;
} = ({ children, width }) => {
  return (
    <div
      className="tw-flex tw-justify-center tw-items-center tw-min-h-screen tw-py-2xl"
      style={{ width: width ?? '400px' }}
    >
      <div className="tw-bg-white tw-w-full tw-rounded-xl tw-border tw-shadow-xl">{children}</div>
    </div>
  );
};

CustomModal.Header = ({ children }) => {
  return <div className="tw-pt-3xl tw-px-3xl tw-pb-2xl">{children}</div>;
};

CustomModal.Content = ({ children }) => {
  return <div className="tw-px-3xl tw-py-0">{children}</div>;
};

CustomModal.Footer = ({
  showLoader,
  flex,
  hasCancel,
  cancelText,
  cancelLink,
  submitIcon,
  submitText,
  formId,
  onClick,
  onCancel,
  className,
  submitClass,
  cancelClass,
}) => {
  return (
    <div
      className={`tw-pt-4xl tw-px-3xl tw-gap-lg tw-pb-3xl tw-flex ${
        flex == 'row' ? 'tw-flex-row' : 'tw-flex-col'
      } ${className}`}
    >
      <button
        type="submit"
        form={formId}
        className={`tw-text-md-semibold tw-rounded-md tw-bg-button-primary tw-w-full tw-text-white tw-shadow-xs tw-px-xl tw-py-10px tw-border-0 hover:tw-bg-button-primary-hover tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-sm ${submitClass}`}
        onClick={onClick}
      >
        <div className="tw-flex tw-items-center tw-justify-center">
          {showLoader ? <LoadingSpinner width={20} /> : submitIcon}
        </div>
        <div className="tw-flex tw-items-center tw-justify-center">{submitText}</div>
      </button>
      {hasCancel && (
        <button
          type="reset"
          className={`tw-h-[44px] tw-w-full tw-text-md-semibold tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-button-secondary-color-fg tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover ${cancelClass}`}
          onClick={onCancel}
        >
          {cancelText}
        </button>
      )}
    </div>
  );
};

CustomModal.displayName = 'CustomModal';
CustomModal.Header.displayName = 'CustomModal.Header';
CustomModal.Content.displayName = 'CustomModal.Content';
CustomModal.Footer.displayName = 'CustomModal.Footer';

export default CustomModal;
