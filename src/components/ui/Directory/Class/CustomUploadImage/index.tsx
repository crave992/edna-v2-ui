import { Control, Controller, FieldValues, UseControllerProps, useFormContext } from 'react-hook-form';
import CustomFormError from '../../../../common/NewCustomFormControls/CustomFormError';
import { ChangeEvent, useState, DragEvent, useEffect, useRef } from 'react';
import CloudIcon from '@/components/svg/CloudIcon';
import JpgIcon from '@/components/svg/JpgIcon';
import CursorIcon from '@/components/svg/CursorIcon';

interface CustomInputProps<T extends FieldValues> extends UseControllerProps<T> {
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'date'
    | 'time'
    | 'hidden'
    | 'password'
    | 'file'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'textarea'
    | 'datepicker'
    | 'editor'
    | 'phone';
  value?: string | boolean | number;
  placeholder?: string;
  control: Control<T>;
  displayError?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  icon?: string;
  label?: string;
  withJpg?: boolean;
  id?: number;
  component?: 'Student' | 'Staff' | 'Parent' | 'Contact' | 'Class';
  isProfile?: boolean;
  acceptedFiles?: string;
}

interface CustomSearchProps {
  value?: string | boolean | number;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  label?: string;
  id?: number;
  searchTerm: string;
  setSearchTerm: Function;
}

const CustomUploadImage = <T extends {}>({
  name,
  type = 'text',
  control,
  placeholder,
  value,
  displayError = true,
  onChange: onTextChange,
  defaultValue,
  disabled = false,
  inputClassName = '',
  containerClassName = '',
  labelClassName = '',
  icon,
  label,
  withJpg,
  id,
  component,
  isProfile,
  acceptedFiles = ".png,.jpg,.jpeg,.heif,.svg"
}: CustomInputProps<T>) => {
  const [imageSource, setImageSource] = useState<{ [key: string]: string }>({});
  const [openCropper, setOpenCropper] = useState<boolean>(false);
  const [picture, setPicture] = useState<string>('');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [customFileError, setCustomFileError] = useState<boolean>(false);
  const { setValue } = useFormContext();

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files && files.length > 0) {
      handleFile(files, name);
    }
  };

  const handleFile = (files: FileList, inputName: string) => {
    if (files[0].size > 25 * 1024 * 1024) {
      setCustomFileError(true);
      setPicture('');
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }

      return;
    }
    setCustomFileError(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImageSource((prevState) => ({ ...prevState, [inputName]: reader.result as string }));
        setPicture(reader.result as string);
      }
    };
    reader.readAsDataURL(files[0]);
    setOpenCropper(true);
  };

  useEffect(() => {
    if (picture) {
      if (component === 'Contact') setValue('croppedProfileImage', picture);
      else if (name === 'licenseImage') setValue('croppedImage', picture);
      else setValue('croppedImage', picture);
    }
  }, [picture]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
        <div
          className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label
            htmlFor={name}
            className={`tw-px-6 tw-py-4 tw-flex tw-items-center tw-justify-center tw-flex-col tw-border tw-border-secondary hover:tw-border-2 tw-border-solid tw-rounded-lg tw-h-[126px] tw-cursor-pointer tw-w-full tw-relative ${labelClassName} ${
              disabled ? 'hover:tw-border-red-500' : 'hover:tw-border-brand'
            }`}
          >
            <div className="tw-border tw-border-secondary tw-border-solid tw-rounded-md  tw-p-2.5 tw-mb-3">
              <CloudIcon />
            </div>
            <div className="tw-flex tw-flex-col tw-space-y-xs tw-items-center tw-justify-center ">
              <div className="tw-flex tw-space-x-xs ">
                <div className="tw-text-sm-semibold tw-text-button-secondary-color-fg">
                  Click to upload {label ? label : ''}
                </div>
                <div className="tw-text-sm-regular tw-text-tertiary">or drag and drop</div>
              </div>
              <div className="tw-text-xs-regular tw-text-tertiary">SVG, PNG, JPG or HEIF</div>
            </div>
            {withJpg && (
              <div className="tw-absolute tw-bottom-[16px] tw-right-[24px]">
                <div className="tw-relative">
                  <JpgIcon />
                  <div className="tw-w-[26px] tw-h-[17px] tw-absolute tw-bottom-[5px] tw-left-[-5px] tw-text-[10px] tw-font-bold tw-text-white tw-bg-[#005B85] tw-py-0.5 tw-px-[3px]">
                    JPG
                  </div>
                  <div className="tw-absolute tw-bottom-[-8px] tw-right-[-9px]">
                    <CursorIcon />
                  </div>
                </div>
              </div>
            )}
          </label>
          <input
            id={name}
            readOnly
            type="file"
            placeholder={placeholder}
            accept={acceptedFiles}
            ref={inputFileRef}
            disabled={disabled}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFile(files, name);
              }
              onChange(e);
              if (onTextChange) {
                onTextChange(e);
              }
            }}
            className="tw-hidden"
          />
          {displayError && <CustomFormError error={error?.message} />}
          {customFileError && <CustomFormError error="Maximum 25mb image file allowed." />}
        </div>
      )}
    />
  );
};

export default CustomUploadImage;
