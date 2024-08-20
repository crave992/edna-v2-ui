import { useClickOutside } from '@mantine/hooks';
import React, { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react';

interface ContextMenuProps {
  children?: ReactNode;
  onClose: () => void;
  popperRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  popperElementRef: HTMLDivElement | null;
  popperStyle: CSSProperties;
  popperAttributes: { [key: string]: string } | undefined;
  parentRef?: HTMLDivElement | null;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  onClose,
  popperRef,
  popperStyle,
  popperAttributes,
  popperElementRef,
  parentRef,
}) => {
  useClickOutside(() => onClose(), null, [popperElementRef, parentRef ? parentRef : null]);

  return (
    <div
      className="tw-w-[249px] -tw-mt-md tw-rounded-md tw-shadow-md tw-bg-white tw-px-0 tw-z-[100] tw-border tw-border-solid tw-border-primary"
      ref={popperRef}
      style={popperStyle}
      {...popperAttributes}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
