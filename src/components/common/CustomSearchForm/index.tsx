import { Form, Row } from "react-bootstrap";
import {
  FieldValues,
  UseControllerProps,
  UseFormHandleSubmit,
} from "react-hook-form";
import CustomInput from "../CustomFormControls/CustomInput";
import CustomSelect from "../CustomFormControls/CustomSelect";
import { Fragment } from "react";

interface CustomSearchFormControls<T extends FieldValues>
  extends UseControllerProps<T> {
  displayOrder: number;
  controlType: typeof CustomInput<T> | typeof CustomSelect<T>;
  render: () => React.ReactNode;
}

interface CustomSearchFormProps<T extends FieldValues> {
  handleSubmit: UseFormHandleSubmit<T>;
  search: (formData: T) => void;
  formControls?: CustomSearchFormControls<T>[];
}

const CustomSearchForm = <T extends {}>({
  handleSubmit,
  search,
  formControls,
}: CustomSearchFormProps<T>) => {
  if (!formControls) return null;

  const sortedFormControls = [...formControls].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <>
      <Form method="get" autoComplete="off" onSubmit={handleSubmit(search)}>
        <Row>
          {sortedFormControls.map((formControl, index) => (
            <Fragment key={index}>{formControl.render()}</Fragment>
          ))}
        </Row>
      </Form>
    </>
  );
};

export default CustomSearchForm;
