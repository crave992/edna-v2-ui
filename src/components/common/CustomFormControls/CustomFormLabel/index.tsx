import {
  IconDefinition,
  faQuestionCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormLabel, OverlayTrigger, Tooltip } from "react-bootstrap";

interface CustomFormLabelProps {
  label?: string;
  tooltip?: string;
  tooltipIcon?: IconDefinition;
}

const CustomFormLabel = ({
  label,
  tooltip,
  tooltipIcon,
}: CustomFormLabelProps) => {
  return (
    <>
      {label && (
        <FormLabel>
          {label}
          {tooltip && (
            <OverlayTrigger
              placement="top"
              delay={{ show: 50, hide: 100 }}
              overlay={
                <Tooltip style={{ position: "fixed" }}>
                  <span dangerouslySetInnerHTML={{ __html: tooltip }} />
                </Tooltip>
              }
            >
              <FontAwesomeIcon
                icon={tooltipIcon ? tooltipIcon : faQuestionCircle}
                size="1x"
                className="ms-1"
              />
            </OverlayTrigger>
          )}
        </FormLabel>
      )}
    </>
  );
};

export default CustomFormLabel;
