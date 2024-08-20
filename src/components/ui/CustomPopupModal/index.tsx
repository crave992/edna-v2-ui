import { NotesSpinner } from '@/components/svg/NotesSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface CustomPopupModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  children: React.ReactNode;
  width?: number;
  mainClass?: string;
  backdropClass?: string;
}

interface CustomPopupModalContentProps {
  children: React.ReactNode;
}

interface CustomPopupModalFooterProps {
  type?: 'submit' | 'button' | 'reset';
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

export const CustomPopupModal: React.FC<CustomPopupModalProps> & {
  Header: React.FC<CustomPopupModalContentProps>;
  Content: React.FC<CustomPopupModalContentProps>;
  Footer: React.FC<CustomPopupModalFooterProps>;
} = ({ showModal, children, width, backdropClass, mainClass }) => {
  return (
    <AnimatePresence>
      {showModal && (
        <>
          <div className={`${backdropClass} tw-bg-black/[0.5] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-20`} />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: '-65%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-65%' }}
            transition={{ duration: 0.3 }}
            className={`tw-fixed tw-top-2/4 tw-left-2/4 tw-translate-y-[-50%] tw-translate-x-[-50%] tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 ${mainClass}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

CustomPopupModal.Header = ({ children }) => {
  return <div className="tw-pt-3xl tw-px-3xl tw-pb-2xl">{children}</div>;
};

CustomPopupModal.Content = ({ children }) => {
  return <div className="tw-px-3xl tw-py-0">{children}</div>;
};

CustomPopupModal.Footer = ({
  type,
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
        type={type ? type : 'submit'}
        form={formId}
        className={`${submitClass} tw-text-md-semibold tw-rounded-md tw-bg-button-primary tw-w-full tw-text-white tw-shadow-xs tw-px-xl tw-py-10px tw-border-0 hover:tw-bg-button-primary-hover tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-sm`}
        onClick={onClick}
      >
        <div className="tw-flex tw-items-center tw-justify-center">{submitIcon}</div>
        <div className="tw-flex tw-items-center tw-justify-center">{showLoader ? <NotesSpinner /> : submitText}</div>
      </button>
      {hasCancel && (
        <button
          type="reset"
          className={`${cancelClass} tw-h-[44px] tw-w-full tw-text-md-semibold tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-button-secondary-color-fg tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover`}
          onClick={onCancel}
        >
          {cancelText}
        </button>
      )}
    </div>
  );
};

CustomPopupModal.displayName = 'CustomPopupModal';
CustomPopupModal.Header.displayName = 'CustomPopupModal.Header';
CustomPopupModal.Content.displayName = 'CustomPopupModal.Content';
CustomPopupModal.Footer.displayName = 'CustomPopupModal.Footer';

export default CustomPopupModal;
