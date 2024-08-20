import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableLessonItem from './SortableLessonItem';
import CustomButton from '@/components/ui/CustomButton';
import PlusIcon from '@/components/svg/PlusIcon';
import { useFocusContext } from '@/context/FocusContext';

export default function SortableContainer(props: any) {
  const {
    id,
    items,
    status,
    classId,
    levelId,
    isDecremented,
    setDecremented,
    onDecrement,
    expanded,
    setShowAddLesson,
  } = props;
  const { currentUserRoles } = useFocusContext();
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="tw-w-full">
      <SortableContext id={id?.toString()} items={items ?? []} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`tw-flex t-h-fit ${expanded ? 'tw-flex-wrap tw-gap-2xl' : 'tw-gap-xl tw-flex-col'} ${
            status === 'planned' && 'tw-gap-xl'
          }`}
        >
          {status === 'planned' &&
            items.length !== 0 &&
            currentUserRoles?.canUpdateLesson &&
            (currentUserRoles?.isStaff ? currentUserRoles?.isLeadGuide || currentUserRoles?.isSpecialist : true) && (
              <div key={`sort-lesson-button-${status}`} className="tw-flex tw-items-center tw-justify-center">
                <CustomButton
                  className={`${expanded ? '!tw-h-[87px]' : ''} !tw-w-[170px]`}
                  text="Plan Lesson"
                  btnSize="sm"
                  heirarchy="secondary-gray"
                  iconTrailing={<PlusIcon />}
                  onClick={() => setShowAddLesson(true)}
                />
              </div>
            )}
          {items &&
            Array.isArray(items) &&
            items.length > 0 &&
            items.map((data: any, index) => {
              const sequenceNumber = data?.sequenceNumber || undefined;
              const totalSequence = data?.sequenceCount;
              const isSequential = data?.sequentialAssignment === 'Yes';

              return (
                <SortableLessonItem
                  key={`sort-lesson-item-${data?.id}`}
                  id={data?.id}
                  status={status}
                  lesson={data}
                  classId={classId}
                  levelId={levelId}
                  isSequential={isSequential}
                  sequenceNumber={sequenceNumber}
                  totalSequence={totalSequence}
                  isDecremented={isDecremented}
                  setDecremented={setDecremented}
                  onDecrement={onDecrement}
                  expanded={expanded}
                />
              );
            })}
        </div>
      </SortableContext>
    </div>
  );
}
