import { FieldError } from "react-hook-form";

interface CustomFormErrorProps {
  error?: FieldError;
}

const CustomFormError = ({ error }: CustomFormErrorProps) => {
  return (
    <>
      {error && error.message && (
        <span className="text-danger">{error.message}</span>
      )}
    </>
  );
};

export default CustomFormError;
