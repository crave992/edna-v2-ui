import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import { useState } from 'react';

interface CustomCheckboxNoControlProps {
  name?: string;
  label?: string;
  containerClass?: string;
  displayError?: boolean;
  error?: string;
  onChange?: Function;
  value?: boolean;
  addTask: Function;
  setEnableInput: Function;
}

const TaskListInput = ({
  name,
  label,
  containerClass,
  displayError = true,
  error,
  value,
  onChange,
  addTask,
  setEnableInput,
}: CustomCheckboxNoControlProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [description, setDescription] = useState('');

  const handleAddTask = () => {
    if (description && description !== '') {
      addTask({ isDone: false, task: description });
      setDescription('');
      setEnableInput(false);
    }
  };

  return (
    <div className="tw-flex tw-items-start tw-justify-start tw-space-x-md">
      <div
        className={`tw-group tw-items-start tw-rounded tw-flex tw-bg-secondary tw-cursor-pointer ${containerClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input type="checkbox" name={name} className="tw-hidden" checked={value} />
        <div
          className={`tw-h-[16px] tw-w-[16px] tw-basis-[16px] tw-grow-0 tw-shrink-0 tw-mt-xxs tw-rounded ${
            value
              ? 'tw-bg-brand tw-border tw-border-solid tw-border-primary '
              : 'tw-border tw-border-solid tw-border-primary'
          } ${isHovered ? 'tw-ring-4 tw-ring-gray-secondary/[.14]' : ''}`}
        >
          {value && (
            <div
              className={`tw-w-[16px] tw-h-[16px] tw-flex tw-items-center tw-justify-center tw-rounded tw-border-brand tw-bg-brand-primary tw-cursor-pointer 
                  ${isHovered ? 'tw-ring-4 tw-ring-brand-secondary-brand/[.24]' : ''}`}
            >
              <CheckMarkIcon />
            </div>
          )}
        </div>
      </div>
      <div className="tw-w-full">
        <input
          type="text"
          name={name}
          className="tw-border-0 tw-bg-secondary tw-w-full tw-text-sm-regular tw-text-tertiary"
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleAddTask()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Perform the action when Enter key is pressed
              handleAddTask();
            }
          }}
        />
      </div>
    </div>
  );
};

export default TaskListInput;
