import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
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

const ViewLesson: NextPage<AddLessonProps> = (props) => {
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
          <Row>
            <Col lg="6">
              <Form.Group className="mb-3">
                <FloatingLabel label="Level">
                  <Form.Control
                    defaultValue={lessonDetails?.level.name}
                    placeholder="Level"
                    readOnly={true}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col lg="6">
              <Form.Group className="mb-3">
                <FloatingLabel label="Area">
                  <Form.Control
                    defaultValue={lessonDetails?.level.name}
                    placeholder="Area"
                    readOnly={true}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col lg="12">
              <Form.Group className="mb-3">
                <FloatingLabel label="Topic">
                  <Form.Control
                    defaultValue={lessonDetails?.topic.name}
                    placeholder="Topic"
                    readOnly={true}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <Form.Group className="mb-3">
                <FloatingLabel label="Lesson Name">
                  <Form.Control
                    defaultValue={lessonDetails?.name}
                    placeholder="Lesson Name"
                    readOnly={true}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Row>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <FloatingLabel label="Sequence Name">
                    <Form.Control
                      defaultValue={lessonDetails?.sequenceName || ""}
                      placeholder="Sequence Name"
                      readOnly={true}
                    />
                  </FloatingLabel>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3">
                  <FloatingLabel label="Sequence Number">
                    <Form.Control
                      defaultValue={lessonDetails?.sequenceNumber}
                      placeholder="Sequence Number"
                      readOnly={true}
                    />
                  </FloatingLabel>
                </Form.Group>
              </Col>
            </Row>
            <Col lg="12">
              <Form.Group className="mb-3">
                <FloatingLabel label="Description">
                  <Form.Control
                    defaultValue={lessonDetails?.description || ""}
                    placeholder="Description"
                    readOnly={true}
                    as="textarea"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col lg="12">
              <Form.Group className="mb-3">
                <FloatingLabel label="Material Used">
                  <Form.Control
                    defaultValue={lessonDetails?.materialUsed || ""}
                    placeholder="Material Used"
                    readOnly={true}
                    as="textarea"
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
            <Col lg="12" className="mb-3">
              <Form.Label>
                Is the lesson to be assigned in sequential order?
              </Form.Label>
              <Form.Group>
                <strong className="text-capitalize">{lessonDetails?.sequentialAssignment}</strong>
              </Form.Group>
            </Col>
          </Row>
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

export default ViewLesson;
