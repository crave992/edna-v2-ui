import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import { SEPAssessmentDto } from "@/dtos/SEPAssessmentDto";

const initialState: InModalState = {
  modalHeading: "Note",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface ViewCommentProps extends CommonProps {
  sepAssessmentId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const ViewComment: NextPage<ViewCommentProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);
  const [sepAssessment, setSepAssessment] = useState<SEPAssessmentDto>();

  const fetchData = async (id: number) => {
    const response = await unitOfService.SEPAssessmentService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let data = response.data.data;
      setSepAssessment(data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchData(props.sepAssessmentId);
      }
    })();
  }, []);

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(states.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{states.modalHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{sepAssessment?.comment}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn_main orange_btn"
            onClick={() => {
              props.onClose(states.refreshRequired);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {states.showLoader && <Loader />}
    </>
  );
};

export default ViewComment;
