import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, Modal, Table } from "react-bootstrap";
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
import { SEPAssessmentHistoryDto } from "@/dtos/SEPAssessmentDto";

const initialState: InModalState = {
  modalHeading: "History",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface ViewHistoryProps extends CommonProps {
  sepAssessmentId: number;
  studentId: number;
  classId: number;
  sepTopicId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const ViewHistory: NextPage<ViewHistoryProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [lessons, dispatch] = useReducer(modalReducer, initialState);

  const [sepAssessmentHistory, setSepAssessmentHistory] =
    useState<SEPAssessmentHistoryDto[]>();
  const fetchHistory = async () => {
    const response = await unitOfService.SEPAssessmentService.getHistory(
      props.sepAssessmentId,
      props.studentId,
      props.classId,
      props.sepTopicId
    );

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      setSepAssessmentHistory(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchHistory();
      }
    })();
  }, []);

  const marks = {
    0: "Not Started",
    1: "Never",
    2: "Sometimes",
    3: "Often",
    4: "Frequently",
    5: "Always",
  };

  const getStatusLabel = (statusId: string): string => {
    let sOut = "";
    if (statusId === "0" || statusId === "") {
      sOut = "Not Started";
    } else if (statusId === "1") {
      sOut = "Never";
    } else if (statusId === "2") {
      sOut = "Sometimes";
    } else if (statusId === "3") {
      sOut = "Often";
    } else if (statusId === "4") {
      sOut = "Frequently";
    } else if (statusId === "5") {
      sOut = "Always";
    }

    return sOut;
  };

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(lessons.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{lessons.modalHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped hover className="custom_design_table mb-0">
            <thead>
              <tr>
                <th>Status</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sepAssessmentHistory &&
                sepAssessmentHistory.map((history) => {
                  return (
                    <tr key={history.id}>
                      <td>{getStatusLabel(history.status)}</td>
                      <td>{history.comment}</td>
                      <td>
                        {unitOfService.DateTimeService.convertToLocalDate(
                          history.assessmentDate
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn_main orange_btn"
            onClick={() => {
              props.onClose(lessons.refreshRequired);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {lessons.showLoader && <Loader />}
    </>
  );
};

export default ViewHistory;
