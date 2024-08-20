import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path, PathValue } from 'react-hook-form';
import CustomFormError from '@/components/common/NewCustomFormControls/CustomFormError';

interface CustomCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  containerClass?: string;
  labelClass?: string;
  checkBoxClass?: string;
  displayError?: boolean;
  onChange?: Function;
  error?: string;
}

interface CustomCheckboxNoControlProps {
  name: string;
  label?: string;
  containerClass?: string;
  disabled?: boolean;
  displayError?: boolean;
  error?: string;
  onChange: Function;
  value: boolean;
  removeLine?: boolean;
}

const CustomCheckbox = <T extends {}>({
  name,
  label,
  control,
  defaultValue,
  containerClass,
  checkBoxClass,
  labelClass,
  displayError = true,
  error,
}: CustomCheckboxProps<T>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange, ref } }) => {
        return (
          <>
            <div
              className={`tw-group tw-items-center tw-rounded-lg tw-flex tw-bg-white tw-cursor-pointer tw-border tw-border-solid tw-border-primary ${containerClass}`}
              onClick={() => onChange(!value)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <input type="checkbox" className="tw-hidden" checked={value} onChange={onChange} ref={ref} />
              <div
                className={`${checkBoxClass ? checkBoxClass : 'tw-h-[20px] tw-w-[20px] tw-rounded-[6px]'}   ${
                  value
                    ? 'tw-bg-brand tw-border tw-border-solid tw-border-primary '
                    : 'tw-border tw-border-solid tw-border-primary'
                } ${isHovered ? 'tw-ring-4 tw-ring-gray-secondary/[.14]' : ''}`}
              >
                {value && (
                  <div
                    className={`${checkBoxClass ? checkBoxClass : 'tw-h-[20px] tw-w-[20px] tw-rounded-[6px]'} tw-flex tw-items-center tw-justify-center tw-border-brand tw-bg-brand-primary tw-cursor-pointer
                  ${isHovered ? 'tw-ring-4 tw-ring-brand-secondary/[.24]' : ''}`}
                  >
                    <CheckMarkIcon />
                  </div>
                )}
              </div>
              {label && (
                <label className={`tw-ml-3 tw-text-base tw-text-secondary hover:tw-cursor-pointer ${labelClass}`}>{label}</label>
              )}
            </div>
            {displayError && error && <CustomFormError error={error} />}
          </>
        );
      }}
    />
  );
};

export const CustomCheckboxNoControl = ({
  name,
  label,
  containerClass,
  value,
  disabled = false,
  onChange,
  removeLine = false,
}: CustomCheckboxNoControlProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const onChangeInput = () => {

  }

  return (
    <>
      <div
        className={`tw-space-x-md tw-group tw-items-start tw-rounded tw-flex tw-bg-secondary tw-cursor-pointer tw-border tw-border-solid tw-border-primary ${containerClass}`}
        onClick={() => onChange(!value)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
       <div
          className={`tw-h-[16px] tw-w-[16px] tw-basis-[16px] tw-grow-0 tw-shrink-0 tw-mt-xxs tw-ml-0 tw-rounded ${
            value
              ? 'tw-bg-brand tw-border tw-border-solid tw-border-primary '
              : 'tw-border tw-border-solid tw-border-primary'
          } ${isHovered && !disabled ? 'tw-ring-4 tw-ring-gray-secondary/[.14]' : ''} ${
            disabled ? '!tw-bg-gray-50' : '' 
          }` }
        >
          {value && (
            <div
              className={`tw-ml-0 tw-w-[16px] tw-h-[16px] tw-flex tw-items-center tw-justify-center tw-rounded tw-border-brand tw-bg-brand-primary tw-cursor-pointer 
                  ${
                    disabled ? '!tw-bg-gray-50 !tw-w-[14px] !tw-h-[14px]' : '' 
                  }
                  ${isHovered && !disabled ? 'tw-ring-4 tw-ring-brand-secondary-brand/[.24]' : ''}`}
            >
              <CheckMarkIcon stroke={disabled ? '#D0D5DD' : 'white'}/>
            </div>
          )}
        </div>
        <input type="checkbox" name={name} className="tw-hidden" onChange={() => onChangeInput()} checked={value} disabled={disabled}/>
        {label && <label className={`tw-text-sm-regular tw-text-tertiary hover:tw-cursor-pointer
          ${value && (removeLine ? '' : 'tw-line-through')}
        `}>{label}</label>}
      </div>
    </>
  );
};

export default CustomCheckbox;
