import cn from "@/utils/cn";
import { HTMLProps, ReactNode, forwardRef } from "react";

export interface IconButtonProps extends HTMLProps<HTMLButtonElement> {
  textColor?: string;
  bgColor?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled: boolean;
  buttonSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  children,
  className,
  disabled,
  buttonSize,
  ...rest
}: IconButtonProps, ref) => {
  const sizeClassMap = {
    sm: 'tw-p-md tw-w-[36px] tw-h-[36px]',
    md: 'tw-p-10px tw-w-[40px] tw-h-[40px]',
    lg: 'tw-p-lg tw-w-[44px] tw-h-[44px]',
    xl: 'tw-p-14px tw-w-[48px] tw-h-[48px]',
    '2xl': 'tw-p-xl tw-w-[56px] tw-h-[56px]',
  };
  const sizeClass = sizeClassMap[buttonSize];

  return (
    <button
      ref={ref}
      className={cn(
        `
        tw-flex
        tw-items-center
        tw-border
        tw-border-solid
        tw-rounded-sm
        tw-bg-primary
        ${sizeClass}
        disabled:tw-cursor-not-allowed
        disabled:tw-border-secondary
        active:tw-border-primary
        hover:tw-bg-button-secondary-hover hover:tw-border-button-secondary
        focus:tw-shadow-sm
        tw-transition-all
        tw-duration-300
        tw-ease-out`,
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
