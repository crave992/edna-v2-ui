import { ReactNode } from 'react';
import Image from 'next/image';
import Avatar from '@/components/ui/Avatar';

export interface CustomBadgeProps {
  size: 'sm' | 'md' | 'lg';
  type: 'pill-color' | 'pill-outline' | 'badge-color' | 'badge-modern';
  color: 'brand' | 'gray' | 'error' | 'warning' | 'success';
  icon?: 'avatar';
  children?: ReactNode;
  containerClassName?: string;
  avatarImg?: string;
}

const sizeClasses = {
  sm: { container: 'tw-h-[22px] tw-py-xxs tw-px-md tw-text-xs-medium' },
  md: { container: 'tw-h-[24px] tw-py-xxs tw-px-10px tw-text-sm-medium' },
  lg: { container: 'tw-h-[28px] tw-py-xs tw-px-lg tw-text-sm-medium' },
};

const typeClasses = {
  'pill-color': { rounded: 'tw-rounded-full', color: '', bgColor: '' },
  'pill-outline': { rounded: 'tw-rounded-full', color: '', bgColor: '' },
  'badge-color': { rounded: 'tw-rounded-full', color: '', bgColor: '' },
  'badge-modern': { rounded: 'tw-rounded-full', color: '', bgColor: '' },
};

const sizeRoundedClasses = {
  sm: 'tw-rounded-sm',
  md: 'tw-rounded-md',
  lg: 'tw-rounded-lg',
  xl: 'tw-rounded-xl',
};

const colorClasses = {
  brand: 'tw-bg-brand-50 tw-border-brand-200 tw-border-solid tw-text-[#00466E]',
  gray: 'tw-bg-gray-50 tw-border-gray-200 tw-border-solid tw-text-gray-700',
  error: 'tw-bg-error-50 tw-border-error-200 tw-border-solid tw-text-error-700',
  warning: 'tw-bg-warning-50 tw-border-warning-200 tw-border-solid tw-text-warning-700',
  success: 'tw-bg-success-50 tw-border-success-200 tw-border-solid tw-text-succss-700',
};

const CustomBadge: React.FC<CustomBadgeProps> = ({
  size,
  type,
  color,
  children,
  containerClassName,
  icon,
  avatarImg,
}) => {
  const { container } = sizeClasses[size];
  const { rounded, color: typeColor, bgColor } = typeClasses[type];
  const colorClass = colorClasses[color];
  const modernSizeRoundedClass = type === 'badge-modern' ? sizeRoundedClasses[size] : '';

  return (
    <div
      className={`tw-border ${
        type == 'badge-modern' && 'tw-border-solid tw-border-secondary'
      } tw-flex tw-items-center tw-justify-center ${container} ${rounded} ${typeColor} ${colorClass} ${modernSizeRoundedClass} ${bgColor} ${containerClassName}`}
    >
      {icon && (
        <Avatar
          link={avatarImg ?? ''}
          photoSize={16}
          firstName={children?.toString().split(' ')[0]}
          lastName={children?.toString().split(' ')[1]}
        />
      )}
      <div className={`tw-flex tw-items-center`}>{children}</div>
    </div>
  );
};

export default CustomBadge;
