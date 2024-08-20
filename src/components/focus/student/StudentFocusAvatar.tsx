import { StudentBasicDto } from '@/dtos/StudentDto';
import cn from '@/utils/cn';
import { HTMLProps, useState } from 'react';
import Image from 'next/image';
import { getInitials } from '@/utils/focusAvatarFn';
import { useRouter } from 'next/router';

export interface StudentFocusAvatarProps extends HTMLProps<HTMLDivElement> {
  student?: StudentBasicDto;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  className?: string;
}

export default function StudentFocusAvatar({ student, selected, setSelected, className }: StudentFocusAvatarProps) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState<string>(student?.profilePicture || '');
  const toggleSelection = () => {
    setSelected(!selected);
  };

  return (
    <div
      className={cn(
        `
        tw-bg-primary
        tw-py-md
        tw-px-xs
        tw-space-x-lg
        tw-border
        tw-rounded-xl
        tw-cursor-pointer
        tw-group
        tw-w-[78px]
        tw-flex
        tw-items-center
        tw-justify-center
        ${selected ? 'tw-border-solid tw-border-brand-900 hover:tw-bg-active' : 'hover:tw-bg-secondary-hover'}
        ${router.pathname == '/focus/lesson' && 'tw-bg-secondary'}
        `,
        className
      )}
      onClick={toggleSelection}
    >
      <div className="tw-w-[70px] tw-h-[78px] tw-space-y-xs tw-flex tw-flex-col tw-items-center tw-justify-center">
        {student?.profilePicture ? (
          <Image
            className="tw-rounded-full"
            src={imgSrc}
            alt={student?.name.split(' ')[0] || ''}
            width={56}
            height={56}
            onError={() => {
              setImgSrc('/images/fallback.png');
            }}
            priority
          />
        ) : (
          <div className="tw-flex tw-rounded-full tw-bg-gray-300 tw-mx-auto tw-items-center tw-justify-center tw-w-[56px] tw-h-[56px]">
            <div className="tw-text-xl-semibold tw-text-quarterary">
              {getInitials(student?.firstName, student?.lastName)}
            </div>
          </div>
        )}
        <div
          className={`tw-flex tw-truncate tw-w-[70px]  ${
            selected
              ? 'tw-text-selected tw-text-brand-900'
              : 'tw-text-xs-regular tw-text-primary group-hover:tw-text-xs-medium'
          } ${student?.firstName && student?.firstName?.length < 10 && 'tw-justify-center'}`}
        >
          {student?.nickName ? student?.nickName : student?.firstName ?? ''}
        </div>
      </div>
    </div>
  );
}
