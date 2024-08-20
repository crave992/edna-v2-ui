import { ChangeEvent } from "react";
import { Form, FloatingLabel } from "react-bootstrap";
import {
  Control,
  Controller,
  FieldValues,
  UseControllerProps,
  UseFormHandleSubmit,
} from "react-hook-form";
import CustomFormError from "../CustomFormControls/CustomFormError";

interface FormWithSearchBoxProps<T extends FieldValues>
  extends UseControllerProps<T> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  control: Control<T>;
  displayError?: boolean;
  label?: string;
  handleSubmit: UseFormHandleSubmit<T>;
  search: (formData: T) => void;
}

const FormWithSearchBox = <T extends {}>({
  name,
  defaultValue,
  onChange: onTextChange,
  control,
  displayError,
  label = "Serach by name...",
  handleSubmit,
  search,
}: FormWithSearchBoxProps<T>) => {
  return (
    <>
      <Form method="get" autoComplete="off" onSubmit={handleSubmit(search)}>
        <div className="searchSortBlock">
          <div className="searchBlock">
            <Controller
              control={control}
              name={name}
              defaultValue={defaultValue}
              render={({
                field: { onBlur, onChange, ref, value: inputValue },
                fieldState: { error },
              }) => (
                <>
                  <FloatingLabel
                    controlId={name}
                    label={label}
                    className="mb-3"
                  >
                    <Form.Control
                      placeholder={label}
                      type="text"
                      autoComplete="off"
                      onBlur={onBlur}
                      ref={ref}
                      value={inputValue}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChange(e);
                        if (onTextChange) {
                          onTextChange(e);
                        }
                      }}
                    />
                    {displayError && <CustomFormError error={error} />}
                  </FloatingLabel>
                </>
              )}
            />
          </div>
        </div>
      </Form>
    </>
  );
};

export default FormWithSearchBox;
