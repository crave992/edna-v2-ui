import React from 'react';
import Avatar from '@/components/ui/Avatar';

interface UserBadgeProps {
  height?: string;
  photoSize?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  spacing?: string;
  nameClassName?: string;
  className?: string;
}

export const UserBadge = ({
  height,
  photoSize,
  fullName,
  firstName,
  lastName,
  profilePicture,
  spacing,
  nameClassName,
  className,
}: UserBadgeProps) => {
  return (
    <div
      className={`tw-flex tw-py-xs tw-pl-sm tw-pr-lg tw-rounded-full tw-bg-white tw-border tw-border-solid tw-border-secondary tw-items-center tw-justify-left tw-w-fit ${
        height ? height : 'tw-h-[28px]'
      } ${className} ${spacing ?? 'tw-space-x-sm'}`}
    >
      <Avatar link={profilePicture ?? ''} photoSize={photoSize ?? 16} firstName={firstName} lastName={lastName} />
      <div className={`tw-text-sm-medium tw-text-secondary ${nameClassName}`}>
        {fullName ? fullName : `${firstName} ${lastName}`}
      </div>
    </div>
  );
};
