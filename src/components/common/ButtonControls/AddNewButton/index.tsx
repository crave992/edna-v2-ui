import { faPlusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Button } from "react-bootstrap";

interface AddNewButtonProps {
  id?: number;
  onClick?: (id: number) => void;
  title?: string;
  inPopup?: boolean;
  linkUrl?: string;
  linkTarget?: "_self" | "_blank" | "_parent" | "_top";
}

const AddNewButton = ({
  id,
  onClick,
  title = "Add",
  inPopup = true,
  linkUrl,
  linkTarget = "_self",
}: AddNewButtonProps) => {
  return (
    <>
      {inPopup ? (
        <Button
          className="btn_main"
          onClick={() => {
            if (onClick) {
              onClick(id || 0);
            }
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} size="1x" /> {title}
        </Button>
      ) : (
        linkUrl && (
          <Link href={linkUrl} target={linkTarget} className="btn_main">
            <FontAwesomeIcon icon={faPlusCircle} size="1x" /> {title}
          </Link>
        )
      )}
    </>
  );
};

export default AddNewButton;
