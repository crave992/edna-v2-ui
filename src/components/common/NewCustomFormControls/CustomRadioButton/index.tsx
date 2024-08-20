import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface RadioButtonProps<T extends FieldValues> {
  option: {
    id: number;
    name: string;
    timeSchedule?: string;
  };
  name: Path<T>;
  control: Control<T>;
  onSelectionChange: (selectedId: number) => void;
  icon?: string;
}

const CustomRadioButton = <T extends FieldValues>({
  option,
  name,
  control,
  onSelectionChange,
  icon,
}: RadioButtonProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={`tw-rounded-lg tw-flex tw-items-center tw-bg-white tw-p-xl tw-cursor-pointer tw-border tw-border-solid tw-border-secondary ${
            field.value === option.id ? 'tw-ring-xxs tw-ring-brand-primary tw-rounded-lg' : 'hover:tw-border-brand'
          }`}
          onClick={() => {
            field.onChange(option.id);
            onSelectionChange(option.id);
          }}
        >
          <div className="tw-flex tw-items-center">
            <input
              {...field}
              type="radio"
              id={`radio-${option.id}`}
              value={option.id}
              name={name as any}
              checked={field.value === option.id}
              className={`tw-hidden`}
            />
            <label htmlFor={`radio-${option.id}`} className="tw-flex tw-items-center tw-cursor-pointer">
              <div
                className={`tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-mr-2 ${
                  icon !== 'check' ? 'tw-rounded-full' : 'tw-rounded-xs'
                }  tw-border-[1px] tw-border-solid ${
                  field.value === option.id ? 'tw-border-brand tw-bg-brand' : 'tw-border-secondary'
                }`}
              >
                {icon === 'check' ? (
                  <CheckMarkIcon />
                ) : (
                  <div
                    className={`tw-w-[6px] tw-h-[6px] tw-rounded-full ${
                      field.value === option.id ? 'tw-bg-white' : ''
                    }`}
                  />
                )}
              </div>
              <div className="tw-text-sm-medium tw-text-secondary">{option.name}</div>
              {option.timeSchedule && (
                <div className="tw-text-sm-regular tw-text-tertiary tw-ml-xs">{option.timeSchedule}</div>
              )}
            </label>
          </div>
        </div>
      )}
    />
  );
};

export default CustomRadioButton;
