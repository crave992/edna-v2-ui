import {
  faCheckCircle,
  faCompass,
  faTimesCircle,
  faWarning,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";

interface CheckStatusProps {
  status?: string;
  checkingStatusMessage?: string;
  availableMsg?: string;
  notAvailableMsg?: string;
}

const CheckStatus: NextPage<CheckStatusProps> = (props) => {
  const { status, checkingStatusMessage, availableMsg, notAvailableMsg } =
    props;

  if (status === "0") {
    return (
      <p className="checking text-warning">
        <FontAwesomeIcon icon={faWarning} size="1x" />
        {checkingStatusMessage ? ` ${checkingStatusMessage}` : " Checking..."}
      </p>
    );
  } else if (status === "1") {
    return (
      <p className="checking text-success">
        <FontAwesomeIcon icon={faCheckCircle} size="1x" />
        {availableMsg ? ` ${availableMsg}` : " Available"}
      </p>
    );
  } else if (status === "2") {
    return (
      <p className="checking text-danger">
        <FontAwesomeIcon icon={faTimesCircle} size="1x" />
        {notAvailableMsg ? ` ${notAvailableMsg}` : " Not Available"}
      </p>
    );
  }

  return <></>;
};

export default CheckStatus;
