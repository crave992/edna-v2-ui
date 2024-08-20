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
import { RecordKeepingHistoryDto } from "@/dtos/RecordKeepingDto";

const initialState: InModalState = {
  modalHeading: "History",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddLessonProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const ViewViewRecordKeepingHistory: NextPage<AddLessonProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [lessons, dispatch] = useReducer(modalReducer, initialState);

  const [recordKeepingHistory, setRecordKeepingHistory] =
    useState<RecordKeepingHistoryDto[]>();
  const fetchLesson = async (id: number) => {
    const response =
      await unitOfService.RecordKeepingService.getHistoryByRecordKeepingId(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      setRecordKeepingHistory(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchLesson(props.id);
      }
    })();
  }, []);

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
          <Modal.Title>History</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
          <Table striped hover className="custom_design_table mb-0">
            <thead>
                <tr>
                    <th>Status</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Count</th>
                    <th className="text-center">Notes</th>
                </tr>
            </thead>
            <tbody>
              {recordKeepingHistory &&
                recordKeepingHistory.map((history) => {
                  return (
                    <tr key={history.id}>
                      <td>{history.status}</td>
                      <td className="text-center">{unitOfService.DateTimeService.convertToLocalDate(history.actionDate)}</td>
                      <td className="text-center">{history.count}</td>
                      <td className="text-center">{history.message}</td>
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

export default ViewViewRecordKeepingHistory;
