import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import { usePopover } from '@/hooks/usePopover';
import { Placement } from '@popperjs/core';
import HelpCircleIcon from '@/components/svg/HelpCircle';

interface TooltipProps {
  text: string;
  supportingText?: string;
  placement?: Placement | undefined;
}

const TooltipButton = ({ text, supportingText, placement = 'auto' }: TooltipProps) => {
  const {
    referenceElement,
    setReferenceElement,
    popperElement,
    setPopperElement,
    setPopperPlacement,
    popOverStyles,
    popOverAttributes,
  } = usePopover();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleShowTooltip = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    setPopperPlacement(placement);
    setIsPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div
      data-modal-target="default-modal"
      data-modal-toggle="default-modal"
      className="tw-flex tw-items-center tw-cursor-pointer tw-pointer-events-auto"
      onClick={(e) => handleShowTooltip(e)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={setReferenceElement}
    >
      <HelpCircleIcon size={16} />
      {isPopoverOpen && (
        <div
          className={`tw-bg-primary-solid tw-py-md tw-px-lg tw-rounded-md tw-z-[100] ${
            supportingText && 'tw-max-w-[320px]'
          }`}
          ref={setPopperElement}
          style={popOverStyles.popper}
          {...popOverAttributes.popper}
        >
          <div className="tw-text-xs-semibold tw-text-white tw-text-left">{text}</div>
          {supportingText && (
            <div className="tw-text-xs-medium tw-text-supporting-text tw-text-left">{supportingText}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TooltipButton;
