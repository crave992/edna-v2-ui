import NotesSpinner from '@/components/svg/NotesSpinner';
import cn from '@/utils/cn';
import { HTMLProps, ReactNode, forwardRef } from 'react';

export interface CustomButtonProps extends HTMLProps<HTMLButtonElement> {
  text: string | ReactNode;
  type?: 'button' | 'submit' | 'reset';
  btnSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  heirarchy:
    | 'primary'
    | 'secondary-gray'
    | 'secondary-color'
    | 'tertiary-gray'
    | 'tertiary-color'
    | 'link-gray'
    | 'link-color'
    | 'success';
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const sizeClasses = {
  sm: { container: 'tw-h-[36px] tw-space-x-xs tw-py-md tw-px-lg tw-text-sm-semibold', icon: 'tw-w-[20px]' },
  md: { container: 'tw-h-[40px] tw-space-x-xs tw-py-10px tw-px-14px tw-text-sm-semibold', icon: 'tw-w-[20px]' },
  lg: { container: 'tw-h-[44px] tw-space-x-sm tw-py-10px tw-px-xl tw-text-md-semibold', icon: 'tw-w-[20px]' },
  xl: { container: 'tw-h-[48px] tw-space-x-sm tw-py-lg tw-px-18px tw-text-md-semibold', icon: 'tw-w-[20px]' },
  '2xl': { container: 'tw-h-[60px] tw-space-x-10px tw-py-xl tw-px-22px tw-text-lg-semibold', icon: 'tw-w-[24px]' },
};

const typeClasses = {
  primary: {
    style:
      'tw-text-white tw-bg-button-primary tw-border tw-border-solid tw-border-button-primary hover:tw-bg-button-primary-hover',
  },
  'secondary-gray': {
    style:
      'tw-text-secondary tw-text-button-secondary-fg tw-bg-white tw-shadow-xs tw-border tw-border-solid tw-border-button-secondary hover:tw-bg-button-secondary-hover',
  },
  'secondary-color': {
    style:
      'tw-text-button-tertiary-fg tw-text-button-secondary-color-fg tw-bg-white tw-shadow-xs tw-border tw-border-solid tw-border-button-secondary-color-border hover:tw-bg-button-secondary-bg-hover',
  },
  'tertiary-gray': { style: 'tw-text-tertiary tw-border-transparent tw-bg-white hover:tw-bg-button-secondary-hover' },
  'tertiary-color': {
    style: 'tw-text-button-secondary-color-fg tw-bg-white tw-border-transparent hover:tw-bg-button-secondary-bg-hover',
  },
  'link-gray': { style: 'tw-text-tertiary tw-border-transparent tw-bg-white' },
  'link-color': { style: 'tw-text-button-tertiary-fg tw-border-transparent tw-bg-white' },
  'success': { style: 'tw-bg-success tw-border-transparent tw-text-white hover:tw-bg-success-700' } ,
};

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      type = 'button',
      text,
      btnSize,
      heirarchy,
      iconLeading,
      iconTrailing,
      children,
      className,
      disabled,
      isLoading,
      ...rest
    }: CustomButtonProps,
    ref
  ) => {
    const { container } = sizeClasses[btnSize];
    const { style } = typeClasses[heirarchy];

    return (
      <button
        disabled = {disabled}
        type={type}
        className={cn(
          `
        ${container} ${style}
        tw-flex
        tw-items-center
        tw-justify-center
        tw-w-full
        tw-rounded-md
        tw-transition-all
        tw-duration-300
        disabled:tw-cursor-not-allowed
        disabled:tw-border-secondary
        tw-ease-out`,
          className
        )}
        {...rest}
      >
        {!isLoading && iconLeading}
        <div className="tw-px-xxs">
          {isLoading ? (
            <div role="status">
              <NotesSpinner />
            </div>
          ) : (
            text
          )}
        </div>
        {!isLoading && iconTrailing}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
