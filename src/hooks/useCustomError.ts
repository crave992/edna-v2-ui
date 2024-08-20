import { useState } from "react";

interface CustomErrorParams {
  type:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  message: string;
  show: boolean;
}

const useCustomError = (params?: CustomErrorParams) => {
  const [errorMessage, setMessage] = useState<CustomErrorParams | undefined>(
    params
  );

  const setErrorMessage = (innerParams: CustomErrorParams): void => {
    setMessage({
      type: innerParams.type,
      message: innerParams.message,
      show: innerParams.show,
    });
  };

  return { errorMessage, setErrorMessage };
};

export default useCustomError;
