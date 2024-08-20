import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

export interface ContextMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon: ReactNode;
}

const ContextMenuButton: FC<ContextMenuButtonProps> = ({ title, icon, ...rest }) => (
  <div className="tw-py-xs tw-px-sm">
    <button
      className="tw-p-9px tw-px-10px tw-space-x-md tw-border-0 tw-bg-white tw-text-sm-medium tw-text-secondary tw-text-left tw-w-full tw-spacing-md hover:tw-bg-secondary"
      {...rest}
    >
      {icon}
      <span>{title}</span>
    </button>
  </div>
);

export default ContextMenuButton;
