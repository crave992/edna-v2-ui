import { ReactNode } from 'react';

export interface FeaturedIconProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
  type: 'light' | 'dark' | 'modern';
  color: 'brand' | 'gray' | 'error' | 'warning' | 'success';
  children?: ReactNode;
}

const sizeClasses = {
  sm: { container: 'tw-w-[32px] tw-h-[32px]', icon: 'tw-w-[16px]' },
  md: { container: 'tw-w-[40px] tw-h-[40px]', icon: 'tw-w-[20px]' },
  lg: { container: 'tw-w-[48px] tw-h-[48px]', icon: 'tw-w-[24px]' },
  xl: { container: 'tw-w-[56px] tw-h-[56px]', icon: 'tw-w-[28px]' },
};

const typeClasses = {
  light: { rounded: 'tw-rounded-full', color: '', bgColor: '' },
  dark: { rounded: '', color: '', bgColor: '' },
  modern: { rounded: '', color: 'tw-text-black', bgColor: 'tw-bg-white' },
};

const sizeRoundedClasses = {
  sm: 'tw-rounded-sm',
  md: 'tw-rounded-md',
  lg: 'tw-rounded-lg',
  xl: 'tw-rounded-xl',
};

const colorClasses = {
  brand: 'tw-bg-button-secondary-bg-hover',
  gray: 'tw-bg-tertiary',
  error: 'tw-bg-error-secondary',
  warning: 'tw-bg-warning-secondary',
  success: 'tw-bg-success-secondary',
};

const FeaturedIcon: React.FC<FeaturedIconProps> = ({ size, type, color, children }) => {
  const { container, icon } = sizeClasses[size];
  const { rounded, color: typeColor, bgColor } = typeClasses[type];
  const colorClass = colorClasses[color];
  const modernSizeRoundedClass = type === 'modern' ? sizeRoundedClasses[size] : '';

  return (
    <div
      className={`tw-border ${
        type == 'modern' && 'tw-border-solid tw-border-secondary'
      } tw-shadow-sm tw-flex tw-items-center tw-justify-center ${container} ${rounded} ${typeColor} ${colorClass} ${modernSizeRoundedClass} ${bgColor}`}
    >
      <div className={`${icon} tw-flex tw-items-center`}>{children}</div>
    </div>
  );
};

export default FeaturedIcon;
