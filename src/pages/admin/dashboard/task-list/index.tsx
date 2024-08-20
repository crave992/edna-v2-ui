
import TaskListItem from '@/components/ui/TaskList/task-list-item';
import TaskListInput from '@/components/ui/TaskList/task-list-input';
import { useState } from 'react';
import { StaffTaskDto } from '@/dtos/StaffTaskDto';

interface TaskListProps {
  tasks: StaffTaskDto[];
  addTask: Function;
  updateTask: Function;
  enableInput: boolean;
  setEnableInput: Function;

}
const TaskList = ({ tasks, addTask, updateTask, enableInput, setEnableInput}: TaskListProps) => {
  return (
    <>
      {enableInput && (
        <div className="tw-pb-lg tw-border-0 tw-border-b tw-border-secondary tw-border-solid">
          <TaskListInput addTask={addTask} setEnableInput={setEnableInput} />
        </div>
      )}
      <div className="tw-space-y-lg tw-w-full">
        {tasks &&
          tasks.map((task, index) => {
            return (
              <div
                key={`task-${index}`}
                className="tw-pb-lg tw-border-0 tw-border-b tw-border-secondary tw-border-solid"
              >
                <TaskListItem task={task} isDone={task.isDone} updateTask={updateTask} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default TaskList;
