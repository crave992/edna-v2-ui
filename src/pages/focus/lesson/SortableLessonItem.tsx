import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/router';
import StudentFocusAvatar from '@/components/focus/student/StudentFocusAvatar';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { isMobile } from 'react-device-detect';

interface StudentWithCountDto extends StudentBasicDto {
  count: number | null;
}

interface LessonItemProps {
  id: number;
  student: StudentWithCountDto;
  setStudentId: Function;
  status: string;
}

export function LessonItem(props: any) {
  const { student, status } = props;

  const style = {
    height: status == 'planned' ? 45 : 94,
    width: status == 'planned' ? '100%' : 78,
  };

  return (
    <div style={style}>
      {status == 'planned' ? (
        <div className="tw-max-w-[170px] tw-flex tw-justify-center tw-text-center tw-items-center tw-bg-secondary tw-w-full tw-rounded-xl tw-border-[0.5px] tw-border-solid tw-border-secondary tw-p-lg tw-cursor-pointer hover:tw-bg-secondary-hover">
          {student.nickName != null ? student.nickName : student.firstName}
        </div>
      ) : (
        <StudentFocusAvatar key={student.id} student={student} selected={false} setSelected={() => {}} />
      )}
    </div>
  );
}

export default function SortableLessonItem({ student, setStudentId, status, id }: LessonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });
  const router = useRouter();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // height: status == 'planned' ? 45 : 94,
    // width: status == 'planned' ? '100%' : 78,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${status == 'planned' ? 'tw-w-full tw-h-[45px]' : 'md:tw-w-1/2 lg:tw-w-1/4 sm:tw-w-full tw-p-xs'} ${
        isMobile && status != 'planned' ? 'lg:tw-w-1/2' : status != 'planned' ? 'lg:tw-w-1/4' : ''
      }`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {isDragging}
      {status == 'planned' && !isDragging ? (
        <div
          className="tw-max-w-[170px] tw-flex tw-justify-center tw-text-center tw-items-center tw-bg-secondary tw-w-full tw-rounded-xl tw-border-[0.5px] tw-border-solid tw-border-secondary tw-p-lg tw-cursor-pointer hover:tw-bg-secondary-hover tw-h-[45px]"
          onClick={() => {
            setStudentId(student.id);
            router.push('/focus/student');
          }}
        >
          {student.nickName != null ? student.nickName : student.firstName}
        </div>
      ) : status !== 'planned' && !isDragging ? (
        <div>
          <StudentFocusAvatar
            key={student.id}
            student={student}
            selected={false}
            setSelected={() => {
              setStudentId(student.id);
              router.push('/focus/student');
            }}
            className="!tw-w-full !tw-px-0"
          />
        </div>
      ) : status === 'planned' && isDragging ? (
        <div className="tw-max-w-[170px] tw-flex tw-justify-center tw-text-center tw-items-center tw-bg-secondary tw-w-full tw-rounded-xl tw-border-[0.5px] tw-border-solid tw-border-secondary tw-p-lg tw-cursor-pointer hover:tw-bg-secondary-hover tw-h-[45px] tw-bg-quaternary"></div>
      ) : (
        <div className="tw-w-full tw-h-full tw-bg-quaternary tw-rounded-xl"></div>
      )}
    </div>
  );
}
