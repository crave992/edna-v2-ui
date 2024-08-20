import ClassAttendanceDto from '@/dtos/ClassAttendanceDto';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { getInitials } from '@/utils/focusAvatarFn';
import Image from 'next/image';
import { useState } from 'react';

type AvatarProps = {
  student?: StudentBasicDto;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  attendant?: ClassAttendanceDto;
  photoSize?: number;
  width?: number;
  textWidth?: number;
  direction?: 'column' | 'row';
  count?: number | undefined;
  noHover?: boolean;
  textClass?: string;
};

export default function StudentAvatar({
  student,
  selected,
  setSelected,
  attendant,
  photoSize,
  width,
  textWidth,
  direction = 'column',
  count,
  noHover = false,
  textClass = '',
}: AvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    student !== undefined ? student.profilePicture : attendant !== undefined ? attendant.studentProfilePicture : ''
  );
  const toggleSelection = () => {
    setSelected(!selected);
  };

  const getStudentName = (attendant: ClassAttendanceDto) => {
    if (attendant.studentNickName) {
      const studentName = attendant.studentNickName.trim().split(/\s+/);
      return studentName;
    } else {
      const student = attendant.studentName.trim().split(/\s+/);
      return `${student[0]} ${student[1] && student[1].charAt(0) + '.'}`;
    }
  };

  return (
    <div
      className={`
        ${width ? `tw-w-[${width}px]` : 'tw-w-[70px]'}
        tw-text-center
        tw-mr-[12px]
        tw-group
        tw-cursor-pointer
        ${direction === 'row' ? 'tw-flex tw-flex-row tw-items-center tw-w-max tw-h-max' : 'tw-h-[78px]'}
      `}
      onClick={toggleSelection}
    >
      {(
        student !== undefined ? student.profilePicture : attendant !== undefined ? attendant.studentProfilePicture : ''
      ) ? (
        <Image
          className={`
            tw-rounded-full
            ${noHover ? '' : 'group-hover:tw-ring group-hover:tw-ring-avatar-focus'}
            ${selected && 'tw-ring tw-ring-avatar-focus'}
          `}
          src={imgSrc}
          alt={
            student !== undefined ? student.name.split(' ')[0] : attendant !== undefined ? attendant.studentName : ''
          }
          width={photoSize ? photoSize : 56}
          height={photoSize ? photoSize : 56}
          onError={() => {
            setImgSrc('/images/fallback.png');
          }}
          priority
        />
      ) : (
        <div
          className={`
            tw-flex
            tw-rounded-full
            tw-bg-gray-300
            tw-mx-auto
            tw-items-center
            tw-justify-center
            ${noHover ? '' : 'group-hover:tw-ring group-hover:tw-ring-avatar-focus'}
            ${selected && 'tw-ring tw-ring-avatar-focus tw-ring-inset'}
          `}
          style={{
            width: photoSize ? `${photoSize}px` : '56px',
            height: photoSize ? `${photoSize}px` : '56px',
          }}
        >
          <div
            className={`${
              photoSize == 32
                ? 'tw-text-sm-semibold'
                : photoSize == 40
                ? 'tw-text-md-semibold'
                : photoSize == 48
                ? 'tw-text-lg-semibold'
                : 'tw-text-xl-semibold'
            } tw-text-quarterary`}
          >
            {getInitials(student?.firstName || attendant?.studentName, student?.lastName)}
          </div>
        </div>
      )}
      <p
        className={`
          tw-pt-[5px]
          ${noHover ? '' : 'group-hover:tw-font-selected group-hover:tw-font-bold'}
          tw-truncate
          ${
            student && textWidth
              ? 'tw-text-xs-regular tw-w-[100px]'
              : attendant === undefined
              ? 'tw-text-xs-regular'
              : 'tw-font-regular tw-w-[140px]'
          }
          ${selected && 'tw-font-selected tw-font-bold'}
          ${
            textWidth && direction === 'row'
              ? `tw-w-[${textWidth}px]`
              : direction == 'row'
              ? 'tw-w-[140px]'
              : 'tw-w-[70px]'
          }
          ${direction === 'row' ? 'tw-text-left tw-ml-3 tw-mb-0' : 'tw-text-center'}
          ${textClass}
          
        `}
      >
        {student !== undefined
          ? student.nickName != null
            ? student.nickName
            : student.firstName
          : attendant !== undefined
          ? getStudentName(attendant)
          : ''}{' '}
        {Number(count) > 0 && `(${count})`}
      </p>
    </div>
  );
}
