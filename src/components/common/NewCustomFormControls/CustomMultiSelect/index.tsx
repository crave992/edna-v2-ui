import { useRef } from 'react';
import { UseControllerProps, FieldValues, useFormContext, Path } from 'react-hook-form';
import { TagsInput } from 'react-tag-input-component';
interface CustomMultiSelectProps<T extends FieldValues> extends UseControllerProps<T> {
  value: string[];
  placeHolder?: string | undefined;
  onChange?: Function;
  onBlur?: Function;
  field?: any;
  onExisting?: Function;
  separators?: string[];
  name: Path<T>; // Use Path<T> for name type
}

const CustomMultiSelect = <T extends {}>({
  onBlur,
  onChange,
  value,
  placeHolder,
  field,
  onExisting,
  separators,
  name,
}: CustomMultiSelectProps<T>) => {
  const tagInputRef = useRef<any>(null);

  const handleClick = () => {
    const inputElement = document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    }
  };

  return (
    <>
      <div className="tw-w-full tw-cursor-pointer" onClick={() => handleClick()}>
        <TagsInput
          {...field}
          ref={tagInputRef}
          value={value}
          separators={separators}
          onChange={onChange}
          onBlur={onBlur}
          placeHolder={placeHolder}
          onExisting={onExisting}
          name={name}
        />
      </div>
    </>
  );
};

export default CustomMultiSelect;
