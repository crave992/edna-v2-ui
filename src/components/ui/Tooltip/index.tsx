import { usePopover } from '@/hooks/usePopover';
import { Placement } from '@popperjs/core';

interface TooltipProps {
  text: string;
  supportingText?: string;
  placement?: Placement | undefined;
}

const Tooltip = ({ text, supportingText }: TooltipProps) => {
  const { setPopperElement, popOverStyles, popOverAttributes } = usePopover();

  return (
    <div
      className={`tw-bg-primary-solid tw-py-md tw-px-lg tw-rounded-md tw-z-[100] ${
        supportingText && 'tw-max-w-[320px]'
      }`}
      style={popOverStyles.popper}
      ref={setPopperElement}
      {...popOverAttributes.popper}
    >
      <div className="tw-text-xs-semibold tw-text-white tw-text-left">{text}</div>
      {supportingText && <div className="tw-text-xs-medium tw-text-supporting-text tw-text-left">{supportingText}</div>}
    </div>
  );
};

export default Tooltip;
