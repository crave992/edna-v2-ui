import { NextPage } from "next";
import { useState } from "react";
import { Alert } from "react-bootstrap";

interface CustomErrorProps {
  children?: React.ReactNode;
  errorType: string;
  message: string;
  show: boolean;
  hideShowAlert: () => void;
}

const CustomError: NextPage<CustomErrorProps> = (props) => {
  const [show, setShow] = useState(props.show);

  return (
    <>
      <Alert
        show={show}
        key={props.errorType}
        variant={props.errorType}
        onClose={props.hideShowAlert}
        dismissible
      >
        {props.message}
      </Alert>
    </>
  );
};

export default CustomError;
