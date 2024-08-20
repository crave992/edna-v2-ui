import { RefObject, useState } from 'react';
import { Placement } from '@popperjs/core';
import CustomBadge from '@/components/ui/CustomBadge';
import { isMobile } from 'react-device-detect';
import { useFocusContext } from '@/context/FocusContext';

interface FocusHeaderProps {
  type: string;
  lessons?: number;
  students?: number;
  alerts?: number;
  css?: string;
  containerRef?: RefObject<HTMLDivElement> | null;
  placement?: Placement;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function FocusHeader({
  type,
  lessons,
  students,
  alerts,
  css,
  containerRef = null,
  expanded,
  setExpanded,
}: FocusHeaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { organization } = useFocusContext();
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) {
      e.preventDefault();
      setExpanded(!expanded);

      if (containerRef && containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${css} tw-sticky tw-top-0 tw-bg-white tw-flex tw-items-center tw-justify-between tw-cursor-pointer tw-pt-lg tw-px-2xl tw-pb-md tw-border-b-1 tw-border-x-0 tw-border-t-0 tw-border-solid tw-border-secondary tw-rounded-t-xl`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onClick={handleClick}
    >
      <div className="tw-text-xl-regular tw-text-black first-letter:tw-uppercase">
        {type == 'review'
          ? 'Re-Presented'
          : type === 'acquired'
          ? organization && organization?.termInfo && organization?.termInfo?.acquired
            ? organization.termInfo.acquired
            : 'acquired'
          : type}
      </div>
      <div className="tw-flex tw-space-x-md">
        {alerts !== undefined
          ? null
          : lessons !== undefined && (
              <CustomBadge size="sm" type="pill-color" color="gray">
                {lessons <= 1 ? `${lessons} Lesson` : `${lessons} Lessons`}
              </CustomBadge>
            )}
        {students !== undefined && (
          <CustomBadge size="sm" type="pill-color" color="gray">
            {students <= 1 ? students + ' Student' : `${students} Students`}
          </CustomBadge>
        )}
        {alerts !== undefined && (
          <CustomBadge size="sm" type="pill-color" color="warning">
            {alerts <= 1 ? `${alerts} Alert` : `${alerts} Alerts`}
          </CustomBadge>
        )}
      </div>
    </div>
  );
}
