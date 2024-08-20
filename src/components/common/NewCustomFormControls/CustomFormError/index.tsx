import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface CustomFormErrorProps {
  error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const CustomFormError = ({ error }: CustomFormErrorProps) => {
  return <>{error && <div className="tw-text-error tw-text-xs-regular">{error.toString()}</div>}</>;
};

export default CustomFormError;
