import React, { useEffect, useState } from 'react';
import { Controller, Control, FieldValues, Path, PathValue, FieldError } from 'react-hook-form';
import CustomFormError from '@/components/common/CustomFormControls/CustomFormError';

interface BooleanInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  defaultValue: PathValue<T, Path<T>>;
  onChange: (value: boolean) => void;
  displayError?: boolean;
}

const CustomBooleanRadioButton = <T extends {}>({
  name,
  control,
  defaultValue,
  onChange,
  displayError = true,
}: BooleanInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange: onFieldChange, value, ref }}) => {
        return (
        <div className="tw-flex tw-items-center tw-space-x-4 tw-w-full">
          <button
            type="button"
            className={`tw-w-1/2 tw-space-y-lg tw-rounded-xl tw-flex tw-items-center tw-bg-white tw-p-xl tw-cursor-pointer tw-border tw-border-solid  hover:tw-border-brand ${
              value ? 'tw-border-2 tw-border-brand' : 'tw-border-secondary'
            }`}
            onClick={() => {
              onFieldChange(true);
              onChange(true);
            }}
            ref={ref}
          >
            <div className="tw-flex tw-items-center">
              <div
                className={`tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-mr-2 tw-rounded-full tw-border tw-border-solid
                ${value ? 'tw-bg-brand tw-border-brand' : 'tw-border-secondary'}`}
              >
                <div className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-white`}></div>
              </div>
              <div className="tw-text-sm-medium tw-text-secondary">Yes</div>
            </div>
          </button>

          <button
            type="button"
            className={`tw-w-1/2 tw-space-y-lg tw-rounded-lg tw-flex tw-items-center tw-bg-white tw-p-xl tw-cursor-pointer tw-border tw-border-solid hover:tw-border-brand ${
              !value ? 'tw-border-2 tw-border-brand' : 'tw-border-secondary'
            }`}
            onClick={() => {
              onFieldChange(false);
              onChange(false);
            }}
            ref={ref}
          >
            <div className="tw-flex tw-items-center">
              <div
                className={`tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-mr-2 tw-rounded-full tw-border tw-border-solid
                ${!value ? 'tw-bg-brand tw-border-brand' : 'tw-border-secondary'}`}
              >
                <div className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-white`}></div>
              </div>
              <div className="tw-text-sm-medium tw-text-secondary">No</div>
            </div>
          </button>
        </div>
      )}}
    />
  );
};

export default CustomBooleanRadioButton;
