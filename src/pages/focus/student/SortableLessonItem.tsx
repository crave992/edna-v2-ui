import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LessonCard from '@/components/ui/LessonCard';
import LessonDto from '@/dtos/LessonDto';
import PlaceholderIcon from '@/components/svg/PlaceholderIcon';

interface LessonItemProps {
  id: number;
  status: string;
  lesson: LessonDto;
  classId: number;
  levelId: number;
  isDecremented: boolean;
  setDecremented: (isDecremented: boolean) => void;
  onDecrement: () => void;
  css?: string;
  expanded?: boolean;
  isSequential: boolean;
  sequenceNumber: number | undefined;
  totalSequence: number;
}

export function LessonItem(props: any) {
  const { data, status, levelId, classId, isDecremented, setDecremented, onDecrement, expanded } = props;
  const sequenceNumber = data.sequenceNumber || undefined;
  const totalSequence = data.sequenceCount;
  const isSequential = data.sequentialAssignment === 'Yes';

  return (
    <LessonCard
      key={data.id}
      lesson={data}
      classId={classId!}
      levelId={levelId!}
      sequence={isSequential ? `${sequenceNumber}/${totalSequence}` : undefined}
      name={data.topic.name}
      description={data.name}
      lessonType={data.area.name}
      isDecremented={isDecremented}
      setDecremented={setDecremented}
      onDecrement={onDecrement}
      expanded={expanded}
    />
  );
}

export default function SortableLessonItem({
  status,
  id,
  lesson,
  classId,
  levelId,
  isSequential,
  sequenceNumber,
  totalSequence,
  isDecremented,
  setDecremented,
  onDecrement,
  expanded,
}: LessonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // height: status == 'planned' ? 45 : 94,
    // width: status == 'planned' ? '100%' : 78,
  };

  return (
    <div
      ref={setNodeRef}
      className={`${
        expanded && status !== 'planned'
          ? 'tw-w-[257px]'
          : expanded && status === 'planned'
          ? 'tw-w-[170px]'
          : 'tw-w-full'
      }`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {isDragging && (
        <div className="tw-h-[87px]">
          <PlaceholderIcon />
        </div>
      )}
      {!isDragging && (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          classId={classId!}
          levelId={levelId!}
          sequence={isSequential ? `${sequenceNumber}/${totalSequence}` : undefined}
          name={lesson.topic.name}
          description={lesson.name}
          lessonType={lesson.area.name}
          isDecremented={isDecremented}
          setDecremented={setDecremented}
          onDecrement={onDecrement}
          expanded={expanded}
          fromStudentStatus={status}
        />
      )}
    </div>
  );
}
