import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";

interface ErrorLabelProps extends CommonProps {
  message?: string;
}

const ErrorLabel: NextPage<ErrorLabelProps> = (props) => {
  return (
    <>
      <span className="text-danger">{props.message}</span>
    </>
  );
};

export default ErrorLabel;
