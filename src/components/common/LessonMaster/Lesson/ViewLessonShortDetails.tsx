import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import {
  Button,
  Modal,
  Table,
} from "react-bootstrap";
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
import LessonDto from "@/dtos/LessonDto";

const initialState: InModalState = {
  modalHeading: "Lesson Details",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddLessonProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const ViewLessonShortDetails: NextPage<AddLessonProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [lessons, dispatch] = useReducer(modalReducer, initialState);

  const [lessonDetails, setLessonDetails] = useState<LessonDto>();
  const fetchLesson = async (id: number) => {
    const response = await unitOfService.LessonService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      setLessonDetails(response.data.data);
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
          <Modal.Title>{lessons.modalHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped hover className="custom_design_table mb-0">
            <tbody>
              <tr>
                <td>Level</td>
                <td>{lessonDetails?.level.name}</td>
              </tr>
              <tr>
                <td>Area</td>
                <td>{lessonDetails?.area.name}</td>
              </tr>
              <tr>
                <td>Topic</td>
                <td>{lessonDetails?.topic.name}</td>
              </tr>
              <tr>
                <td>Lesson Name</td>
                <td>{lessonDetails?.name}</td>
              </tr>
              <tr>
                <td>Materials</td>
                <td>{lessonDetails?.materialUsed}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{lessonDetails?.description}</td>
              </tr>
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

export default ViewLessonShortDetails;
