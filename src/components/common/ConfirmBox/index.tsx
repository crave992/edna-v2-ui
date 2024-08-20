import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, Modal } from "react-bootstrap";

interface ConfirmBoxProps extends CommonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  heading?: string;
  noButtonText?: string;
  yesButtonText?: string;
  bodyText?: string;
}

const ConfirmBox: NextPage<ConfirmBoxProps> = (props) => {
  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose();
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>
            {props.heading ? props.heading : "Confirm?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.bodyText ? (
            <p>{props.bodyText}</p>
          ) : (
            <p>Are you sure for this action?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn_main orange_btn"
            onClick={() => {
              props.onClose();
            }}
          >
            {props.noButtonText ? props.noButtonText : "No"}
          </Button>
          <Button
            className="btn_main"
            type="button"
            onClick={() => {
              props.onSubmit();
            }}
          >
            {props.yesButtonText ? props.yesButtonText : "Yes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmBox;
