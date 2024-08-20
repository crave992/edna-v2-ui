import { Form } from 'react-bootstrap';
import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';
import CustomFormError from '../CustomFormError';
import { ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Editor } from '@tinymce/tinymce-react';

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
    | 'editor';
  value?: string | boolean;
  placeholder?: string;
  control: Control<T>;
  displayError?: boolean;
  labelForCheckboxAndRadio?: string;
  idForCheckboxAndRadio?: string;
  makeRadioOrCheckboxInline?: boolean;
  multipleFileUpload?: boolean;
  textAreaRows?: number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDateSelect?: (e: string) => void;
  dateFormat?: string;
  disabled?: boolean;
}

const getApiKey = () => {
  const hostname = window.location.hostname;

  if (hostname !== 'live.noorana.app') {
    return '87f6qtbda7kdqj256aee4z87ic2xeqvho63daz7cliq1i9f1';
  } else {
    return 's99bbwrvh0k6bh9wtcdfalhyw7clyk5e4hs6lpiv6f4y4sdc';
  }
};

const CustomInput = <T extends {}>({
  name,
  type = 'text',
  control,
  placeholder,
  value,
  displayError = true,
  labelForCheckboxAndRadio,
  idForCheckboxAndRadio,
  makeRadioOrCheckboxInline,
  multipleFileUpload,
  textAreaRows = 3,
  onChange: onTextChange,
  onDateSelect: onDateSelect,
  defaultValue,
  dateFormat = 'yyyy-MM-dd',
  disabled = false,
}: CustomInputProps<T>) => {
  if (type === 'radio') {
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <>
              <Form.Check
                type={type}
                autoComplete="off"
                id={idForCheckboxAndRadio || labelForCheckboxAndRadio}
                label={labelForCheckboxAndRadio}
                inline={makeRadioOrCheckboxInline}
                placeholder={placeholder}
                {...field}
                checked={value ? field.value === value : false}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const selectedValue = e.target.checked ? value : '';
                  field.onChange(selectedValue);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
              />
              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else if (type === 'checkbox' || type === 'switch') {
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <>
              <Form.Check
                type={type}
                autoComplete="off"
                id={idForCheckboxAndRadio || labelForCheckboxAndRadio}
                label={labelForCheckboxAndRadio}
                inline={makeRadioOrCheckboxInline}
                placeholder={placeholder}
                {...field}
                checked={field.value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e.target.checked);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
              />
              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else if (type === 'textarea') {
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <>
              <Form.Control
                autoComplete="off"
                placeholder={placeholder}
                {...field}
                as="textarea"
                rows={textAreaRows}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(e);
                  if (onTextChange) {
                    onTextChange(e);
                  }
                }}
                disabled={disabled}
              />
              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else if (type === 'datepicker') {
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <>
              <DatePicker
                innerRef={ref}
                selected={inputValue}
                onChange={(selectedDate: any) => {
                  onChange(selectedDate);
                }}
                onBlur={onBlur}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                className="form-control"
                showYearDropDown
                scrollableYearDropdown
                disabled={disabled}
                onSelect={(selectedDate: any) => {
                  if (onDateSelect) {
                    onDateSelect(selectedDate);
                  }
                }}
              />

              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else if (type === 'editor') {
    const apiKey = getApiKey();
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <>
              <Editor
                apiKey={apiKey}
                value={field.value}
                id={name}
                onEditorChange={field.onChange}
                init={{
                  branding: false,
                  height: 400,
                  menubar: false,
                  verify_html: false,
                  valid_children: '+body[style]',
                  plugins: 'code preview autolink link lists media table image',
                  toolbar:
                    'code | blocks | preview | bold italic underline strikethrough | link image | forecolor backcolor |  undo redo | numlist bullist checklist | alignleft aligncenter alignright alignjustify | outdent indent | table | fontsizeselect | fontselect | formatselect | a11ycheck | casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile media pageembed template anchor codesample | ltr rtl',
                  image_advtab: true,
                  file_picker_types: 'image file', //file image media
                  toolbar_mode: 'floating',
                  convert_urls: false,
                  image_dimensions: false,
                  image_class_list: [
                    { title: 'img-fluid', value: 'img-fluid' },
                    { title: 'None', value: '' },
                  ],
                  file_picker_callback: function (callback, value, meta) {
                    // Create a file input element
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    // Add change event listener to handle file selection
                    input.onchange = function () {
                      const files = input.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        const reader = new FileReader();

                        // Read the file content
                        reader.onload = function (e) {
                          const result = e.target?.result;
                          if (result) {
                            // Pass the result to the callback
                            const dataUrl = result.toString();
                            callback(dataUrl, { text: file.name });
                          }
                        };

                        reader.readAsDataURL(file);
                      }
                    };

                    // Trigger the file input dialog
                    input.click();
                  },
                }}
              />
              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else {
    return (
      <>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field: { onBlur, onChange, ref, value: inputValue }, fieldState: { error } }) => (
            <>
              <Form.Control
                type={type}
                autoComplete="off"
                placeholder={placeholder}
                multiple={multipleFileUpload}
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
              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  }
};

export default CustomInput;
