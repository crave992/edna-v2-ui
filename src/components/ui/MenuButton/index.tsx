import StatusDot from '@/components/svg/StatusDot';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import TooltipButton from '../TooltipButton';
import { ChevronDownIcon } from '@/components/svg/ChevronDown';

export interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  active?: boolean;
  disabled?: boolean;
  dot?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  hasDropdown?: boolean;
  openDropdown?: boolean;
  isSecondary?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  name,
  active,
  disabled,
  dot,
  icon,
  badge,
  hasDropdown,
  className,
  openDropdown,
  isSecondary,
  ...props
}) => {
  const buttonClassNames = `
     tw-space-x-md tw-flex tw-items-center tw-justify-center disabled:tw-bg-white disabled:tw-text-fg-disabled disabled:tw-cursor-not-allowed tw-px-lg tw-py-md tw-rounded-sm tw-border tw-border-solid ${
       active ? 'tw-bg-active tw-border-primary' : 'tw-bg-primary tw-border-transparent hover:tw-bg-primary-hover'
     } ${disabled && '!tw-pr-sm'}`;

  return (
    <div className="tw-flex tw-h-[36px]">
      <button type="button" disabled={disabled} {...props} className={buttonClassNames}>
        {dot && <StatusDot />}
        <div
          className={`hover:tw-text-secondary-hover disabled:tw-bg-white disabled:tw-text-fg-disabled disabled:tw-cursor-not-allowed ${
            disabled ? 'tw-text-fg-disabled' : active ? 'tw-text-secondary-hover' : 'tw-text-secondary'
          } ${isSecondary ? 'tw-text-sm-medium' : 'tw-text-sm-semibold '}`}
        >
          {name}
        </div>
        {hasDropdown && (
          <div
            className={`tw-transform tw-transition-all tw-duration-200 tw-ease-in-out ${
              openDropdown ? 'tw-rotate-180' : ''
            }`}
          >
            <ChevronDownIcon stroke="var(--color-primary)" width={20} height={20} />
          </div>
        )}
      </button>
      {disabled && <TooltipButton text="Coming Soon" placement="bottom" />}
    </div>
  );
};

export default MenuButton;
