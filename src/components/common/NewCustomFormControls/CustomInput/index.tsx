import { Control, Controller, FieldValues, UseControllerProps, useForm, useFormContext } from 'react-hook-form';
import CustomFormError from '../CustomFormError';
import { ChangeEvent, useState, DragEvent, useEffect, useRef } from 'react';
import EmailIcon from '@/components/svg/EmailIcon';
import PhoneIcon from '@/components/svg/PhoneIcon';
import PhoneCallIcon from '@/components/svg/PhoneCallIcon';
import Image from 'next/image';
import UserCircleIcon from '@/components/svg/UserCircleIcon';
import CloudIcon from '@/components/svg/CloudIcon';
import JpgIcon from '@/components/svg/JpgIcon';
import CursorIcon from '@/components/svg/CursorIcon';
import PhotoCropper from '@/components/ui/PhotoCropper';
import SearchIcon from '@/components/svg/SearchIcon';
import CloseIcon from '@/components/svg/CloseIcon';
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/components/svg/CalendarIcon';

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
  component?: 'Student' | 'Staff' | 'Parent' | 'Contact' | 'Class' | 'OnboardingParent' | 'OnboardingStudent';
  isProfile?: boolean;
  autoFocus?: boolean;
  code?: string;
  onDateSelect?: (e: string) => void;
  dateFormat?: string;
  noClockIcon?: boolean;
  readOnly?: boolean;
  thumbnail?: string;
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
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

const CustomInput = <T extends {}>({
  name,
  type = 'text',
  control,
  placeholder,
  value,
  displayError = true,
  onChange: onTextChange,
  onDateSelect: onDateSelect,
  defaultValue,
  dateFormat = 'MMM dd, yyyy',
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
  autoFocus = false,
  code,
  noClockIcon,
  readOnly = false,
  thumbnail,
  resize = 'none',
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
      else if (name === 'licenseImage') setValue('croppedLicenseImage', picture);
      else setValue('croppedImage', picture);
    }
  }, [picture]);

  useEffect(() => {
    if (openCropper === false) {
      if (isProfile && component?.indexOf('Onboarding') == -1) setImageSource({});
      else setImageSource({ [name]: picture });
      setPicture('');
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  }, [openCropper]);

  return (
    <>
      {(type === 'text' || type === 'password') && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}>
              {label && <div className="tw-text-sm tw-font-medium tw-text-secondary tw-mb-sm">{label}</div>}
              <input
                className={`tw-w-full tw-px-14px tw-py-10px tw-text-md-regular tw-text-primary placeholder:tw-placeholder-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md disabled:tw-cursor-not-allowed disabled:tw-border-secondary ${inputClassName}`}
                type={type}
                placeholder={placeholder}
                onBlur={onBlur}
                ref={ref}
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onChange(e);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
              />
              {displayError && <CustomFormError error={error?.message} />}
            </div>
          )}
        />
      )}
      {type === 'email' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}>
              <div className="tw-relative tw-w-full tw-flex tw-items-center tw-justify-center tw-text-color-primary tw-placeholder-placeholder tw-gap-x-1">
                <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3.5 tw-pointer-events-none">
                  <EmailIcon />
                </div>
                <input
                  className={`${inputClassName} tw-pl-[42px] tw-w-full tw-px-3.5 tw-py-2.5 tw-text-color-primary tw-placeholder-placeholder tw-border-[1px] tw-border-primary tw-border-solid tw-rounded-md tw-text-base disabled:tw-cursor-not-allowed disabled:tw-border-secondary`}
                  placeholder={placeholder}
                  type={type}
                  onBlur={onBlur}
                  ref={ref}
                  value={inputValue}
                  disabled={disabled}
                  readOnly={readOnly}
                  autoFocus={autoFocus}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onChange(e);
                    if (onTextChange) {
                      onTextChange(e);
                    }
                  }}
                />
              </div>
              {displayError && <CustomFormError error={error?.message} />}
            </div>
          )}
        />
      )}
      {type === 'phone' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}>
              <div className="tw-relative tw-w-full tw-flex tw-items-center tw-justify-center tw-text-color-primary tw-placeholder-placeholder tw-gap-x-1">
                <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3.5 tw-pointer-events-none">
                  {icon === 'phone' ? <PhoneIcon /> : <PhoneCallIcon />}
                </div>
                <input
                  className={`${inputClassName} tw-pl-[42px] tw-w-full tw-px-3.5 tw-py-2.5 tw-text-color-primary tw-placeholder-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-text-base`}
                  placeholder={placeholder}
                  type={'text'}
                  onBlur={onBlur}
                  ref={ref}
                  value={inputValue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onChange(e);
                    if (onTextChange) {
                      onTextChange(e);
                    }
                  }}
                  maxLength={12}
                  autoFocus={autoFocus}
                />
              </div>
              {displayError && <CustomFormError error={error?.message} />}
            </div>
          )}
        />
      )}
      {type === 'file' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div
              className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor={name}
                className={`tw-px-6 tw-py-4 tw-flex tw-items-center tw-justify-center tw-flex-col tw-border tw-border-secondary hover:tw-border-brand hover:tw-border-2 tw-border-solid tw-rounded-lg tw-h-[126px] tw-cursor-pointer tw-w-full tw-relative ${labelClassName}`}
              >
                <div className="tw-border tw-border-secondary tw-border-solid tw-rounded-md  tw-p-2.5 tw-mb-3">
                  {imageSource[name] || (thumbnail && !imageSource[name]) ? (
                    <Image
                      width={40}
                      height={40}
                      alt=""
                      className="tw-h-[40px] tw-w-[40px]"
                      src={thumbnail && !imageSource[name] ? thumbnail : imageSource[name]}
                    />
                  ) : icon === 'cloud' ? (
                    <CloudIcon />
                  ) : (
                    <UserCircleIcon />
                  )}
                </div>
                <div className="tw-flex tw-flex-col tw-space-y-xs tw-items-center tw-justify-center ">
                  <div className="tw-flex tw-space-x-xs ">
                    <div className="tw-text-sm-semibold tw-text-button-secondary-color-fg">
                      Click to upload {label ? label : ''}
                    </div>
                    <div className="tw-text-sm-regular tw-text-tertiary">or drag and drop</div>
                  </div>
                  <div className="tw-text-xs-regular tw-text-tertiary">SVG, PNG, JPG or GIF (max. 800x400px)</div>
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
                accept=".png, .jpg, .jpeg"
                ref={inputFileRef}
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
      )}
      {type === 'radio' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <label
              htmlFor={`${name}-${value}`}
              className={`
                ${containerClassName}
                tw-w-full tw-text-sm-medium tw-text-secondary tw-cursor-pointer tw-relative tw-p-xl tw-rounded-xl tw-flex tw-flex-row tw-items-center tw-justify-start tw-border-solid
                ${value == field.value ? 'tw-border-2 tw-border-brand' : 'tw-border tw-border-secondary'}
              `}
            >
              <input
                id={`${name}-${value}`}
                type={type}
                placeholder={placeholder}
                checked={field.value === value || (field.value === false && value === false)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const selectedValue = e.target.checked ? value : '';
                  field.onChange(selectedValue);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
                className={`${inputClassName} tw-hidden tw-peer tw-text-blue-500 tw-w-5 tw-h-5 tw-accent-brand tw-mr-sm tw-cursor-pointer hover:tw-accent-brand`}
              />
              <div className="tw-flex tw-items-center">
                <div
                  className={`tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-mr-2 tw-rounded-full tw-border tw-border-solid  ${
                    value == field.value ? 'tw-bg-brand tw-border-brand' : 'tw-border-secondary'
                  }`}
                >
                  <div className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-white`}></div>
                </div>
                <div className="tw-text-sm-medium tw-text-secondary">{label}</div>
              </div>
              {displayError && <CustomFormError error={error?.message} />}
            </label>
          )}
        />
      )}

      {type === 'time' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}>
              <input
                className={`${inputClassName} tw-w-full tw-px-3.5 tw-py-2.5 tw-text-color-primary tw-placeholder-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-text-base ${
                  noClockIcon ? 'no-clock-icon' : ''
                }`}
                type="time"
                placeholder={placeholder}
                onBlur={onBlur}
                ref={ref}
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onChange(e);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
              />
              {displayError && <CustomFormError error={error?.message} />}
            </div>
          )}
        />
      )}

      {type === 'textarea' && (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <div className={`${containerClassName} tw-flex tw-flex-col tw-items-start tw-justify-start tw-relative`}>
              {label && <div className="tw-text-sm-medium tw-text-secondary tw-mb-sm">{label}</div>}
              <textarea
                className={`${inputClassName} tw-text-md-regular tw-w-full tw-py-10px tw-px-14px tw-h-[80px] tw-border tw-border-secondary tw-rounded-md disabled:tw-bg-white focus:tw-border-primary`}
                placeholder={placeholder}
                onBlur={onBlur}
                ref={ref}
                value={inputValue}
                autoFocus={autoFocus}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  onChange(e);
                  if (onTextChange) {
                    onTextChange(e as unknown as ChangeEvent<HTMLInputElement>);
                  }
                }}
                disabled={disabled}
                readOnly={readOnly}
                style={{ resize: `${resize}` }}
              />
              {displayError && <CustomFormError error={error?.message} />}
            </div>
          )}
        />
      )}

      {type === 'file' && (
        <PhotoCropper
          showModal={openCropper}
          setShowModal={setOpenCropper}
          label={label}
          picture={picture}
          savePicture={setPicture}
          id={id!}
          component={component}
          isProfile={isProfile}
          code={code}
        />
      )}
    </>
  );
};

export const CustomSearchInput = ({ placeholder, disabled = false, searchTerm, setSearchTerm }: CustomSearchProps) => {
  return (
    <div className="tw-relative tw-flex tw-items-center">
      <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-3.5 tw-pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="search"
        className="tw-block tw-w-full tw-py-2.5 tw-px-3.5 tw-ps-11 tw-text-md-regular tw-text-primary placeholder:tw-text-placeholder tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white disabled:tw-bg-secondary disabled:tw-cursor-not-allowed"
        placeholder={placeholder}
        onChange={(event) => setSearchTerm && setSearchTerm(event.target.value)}
        value={searchTerm}
        disabled={disabled}
      />
      {searchTerm && (
        <div
          className="tw-cursor-pointer tw-flex tw-items-center tw-absolute tw-right-3.5"
          onClick={() => setSearchTerm && setSearchTerm('')}
        >
          <CloseIcon />
        </div>
      )}
    </div>
  );
};

export default CustomInput;
