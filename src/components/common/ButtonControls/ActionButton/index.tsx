import { ActionButtonTypes } from "@/helpers/ActionButtonTypes";
import { IconDefinition, faPenToSquare, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface ActionButtonProps {
  id: any;
  onClick?: (id: any) => void;
  actionButtonType: ActionButtonTypes;
  tooltipText: string;
  inPopup?: boolean;
  linkUrl?: string;
  linkTarget?: "_self" | "_blank" | "_parent" | "_top";
  icon?: IconDefinition
}

const ActionButton = ({
  id,
  onClick,
  actionButtonType,
  tooltipText,
  inPopup = true,
  linkUrl,
  linkTarget = "_self",
  icon
}: ActionButtonProps) => {
  const router = useRouter();

  return (
    <>
      <OverlayTrigger
        placement="top"
        delay={{ show: 50, hide: 100 }}
        overlay={<Tooltip>{tooltipText}</Tooltip>}
      >
        <span
          className={`btn_main ${
            actionButtonType === ActionButtonTypes.Edit && "orange_btn"
          } small anchor-span`}
          onClick={() => {
            if (inPopup) {
              if (onClick) {
                onClick(id);
              }
            } else {
              if (linkUrl) {
                router.push(linkUrl);
              }
            }
          }}
        >
          {actionButtonType === ActionButtonTypes.Delete ? (
            <FontAwesomeIcon icon={faTrash} size="1x" />
          ) : (
            <FontAwesomeIcon icon={faPenToSquare} size="1x" />
          )}
        </span>
      </OverlayTrigger>
    </>
  );
};

export default ActionButton;
