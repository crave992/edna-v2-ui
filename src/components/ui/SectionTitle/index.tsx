import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import PlusIcon from '@/components/svg/PlusIcon';
import { LegacyRef, useState, MouseEvent } from 'react';
import Tooltip from '../Tooltip';
import { usePopover } from '@/hooks/usePopover';
import { Placement } from '@popperjs/core';

interface SectionTitleProps {
  type: string;
  lessons?: number;
  students?: number;
  alerts?: number;
  expanded: boolean;
  setExpanded?: () => void;
  handleAdd: Function;
  css?: string;
  containerRef?: LegacyRef<HTMLDivElement> | undefined;
  placement?: Placement | undefined;
  component?: string;
}

export default function SectionTitle({
  type,
  lessons,
  students,
  alerts,
  expanded,
  setExpanded,
  handleAdd,
  css,
  containerRef = null,
  placement = 'top',
  component,
}: SectionTitleProps) {
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
    <div ref={containerRef} className={`${css} tw-flex tw-justify-between tw-cursor-pointer`} onClick={setExpanded}>
      <div className="tw-flex tw-flex-row tw-items-center tw-space-x-xl">
        <div className="tw-text-2xl-medium tw-text-black">{capitalizeFirstLetter(type == "review" ? "Re-Presented" : type)}</div>
        {lessons !== undefined && (
          <div className="tw-text-md-regular tw-text-black">
            {lessons <= 1 ? `${lessons} Lesson` : `${lessons} Lessons`}
          </div>
        )}
        {students !== undefined && (
          <div className="tw-text-md-regular tw-text-black">
            {students <= 1 ? students + ' Student' : `${students} Students`}
          </div>
        )}
        {alerts !== undefined && (
          <div className="tw-text-md-regular tw-text-black">{alerts <= 1 ? `${alerts} Alert` : `${alerts} Alerts`}</div>
        )}
      </div>
      <div className="tw-flex tw-flex-row">
        {type === 'planned' && (
          <div
            className="
              tw-w-[40px]
              tw-h-[40px]
              tw-p-1.5
              tw-items-center
              tw-justify-center
              tw-flex
              tw-border
              tw-rounded-full
              tw-border-dashed
              tw-border-primary
              tw-cursor-pointer
              tw-bg-white
            "
            onClick={(event) => handleAdd(event)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={setReferenceElement}
          >
            <PlusIcon />
          </div>
        )}
        {isPopoverOpen && (
          <div
            className="tw-bg-primary-solid tw-py-md tw-px-lg tw-rounded-md tw-z-[100]"
            ref={setPopperElement}
            style={popOverStyles.popper}
            {...popOverAttributes.popper}
          >
            <div className="tw-text-xs-semibold tw-text-white tw-text-left">{`Add ${component}`}</div>
          </div>
        )}
      </div>
    </div>
  );
}
