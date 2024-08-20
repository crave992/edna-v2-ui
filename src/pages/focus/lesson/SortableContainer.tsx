import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';

import SortableLessonItem from './SortableLessonItem';

export default function SortableContainer(props: any) {
  const { id, items, status, setStudentId } = props;

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="tw-w-full">
      <SortableContext
        id={id?.toString()}
        items={items ?? []}
        strategy={status === 'planned' ? verticalListSortingStrategy : rectSortingStrategy}
      >
        <div ref={setNodeRef} className={`tw-flex tw-flex-wrap t-h-fit ${status === 'planned' && 'tw-gap-xl'}`}>
          {items &&
            Array.isArray(items) &&
            items.length > 0 &&
            items.map((data: any) => (
              <SortableLessonItem
                key={data?.id}
                id={data?.id}
                student={data}
                setStudentId={setStudentId}
                status={status}
              />
            ))}
        </div>
      </SortableContext>
    </div>
  );
}
