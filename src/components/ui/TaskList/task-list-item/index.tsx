import { CustomCheckboxNoControl } from '@/components/common/NewCustomFormControls/CustomCheckbox';
import { StaffTaskDto } from '@/dtos/StaffTaskDto';
import { useState } from 'react';

interface TaskListItemProps {
  task: StaffTaskDto;
  isDone: boolean;
  updateTask: Function;
}
const TaskListItem = ({ task, updateTask }: TaskListItemProps) => {
  const onChange = (newValue: boolean) => {
    if (!task?.isDone) {
      updateTask(task?.id);
    }
  };

  return (
    <div>
      <CustomCheckboxNoControl
        name="sendProfileOnboardingEmail"
        label={task?.task}
        containerClass="tw-border tw-border-transparent tw-text-md-medium tw-text-secondary"
        onChange={onChange}
        value={task?.isDone}
      />
    </div>
  );
};

export default TaskListItem;
