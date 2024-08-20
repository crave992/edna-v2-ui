import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path, PathValue, FieldErrors, FieldError } from 'react-hook-form';
import CustomFormError from '../CustomFormError';

interface CustomCheckboxButtonProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  containerClass?: string;
  displayError?: boolean;
  error?: string;
}

const CustomCheckboxButton = <T extends {}>({
  name,
  label,
  control,
  defaultValue,
  containerClass,
  displayError = true,
  error,
}: CustomCheckboxButtonProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange, ref } }) => {
        return (
          <>
            <div
              className={`tw-group tw-flex tw-items-center tw-rounded-lg tw-flex tw-items-center tw-bg-white tw-p-xl tw-cursor-pointer tw-border tw-border-solid tw-border-secondary ${
                value
                  ? 'tw-ring-xxs tw-ring-brand-primary tw-rounded-lg'
                  : 'hover:tw-ring-0px hover:tw-ring-brand-primary hover:tw-rounded-lg'
              } ${containerClass ? containerClass : ''}`}
              onClick={() => onChange(!value)}
            >
              <input type="checkbox" className="tw-hidden" checked={value} onChange={onChange} ref={ref} />
              <div
                className={`tw-h-[16px] tw-w-[16px] tw-rounded-[4px] ${
                  value ? 'tw-bg-brand' : 'tw-border tw-border-solid tw-border-secondary'
                }`}
              >
                {value && (
                  <div className="tw-w-[16px] tw-h-[16px] tw-flex tw-items-center tw-justify-center tw-rounded-[4px] tw-bg-brand-primary tw-cursor-pointer">
                    <CheckMarkIcon />
                  </div>
                )}
              </div>
              {label && <div className="tw-ml-sm tw-text-sm-medium tw-text-secondary">{label}</div>}
            </div>
            {displayError && error && <CustomFormError error={error} />}
          </>
        );
      }}
    />
  );
};

export default CustomCheckboxButton;
