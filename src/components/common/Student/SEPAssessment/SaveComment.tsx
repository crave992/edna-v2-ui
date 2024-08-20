import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import { useForm } from "react-hook-form";
import SEPAssessmentModel from "@/models/SEPAssessmentModel";
import { yupResolver } from "@hookform/resolvers/yup";
import SEPAssessmentValidationSchema from "@/validation/SEPAssessmentValidationSchema";
import { toast } from "react-toastify";
import ErrorLabel from "../../CustomError/ErrorLabel";

const initialState: InModalState = {
  modalHeading: "Add Note",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface SaveCommentProps extends CommonProps {
  sepAssessmentId: number;
  studentId: number;
  classId: number;
  sepTopicId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const SaveComment: NextPage<SaveCommentProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchData = async (id: number) => {
    const response = await unitOfService.SEPAssessmentService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let data = response.data.data;
      setValue("action", "comment");
      setValue("value", data.comment || "");
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchData(props.sepAssessmentId);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue } =
    useForm<SEPAssessmentModel>({
      resolver: yupResolver(SEPAssessmentValidationSchema),
      defaultValues: {
        action: "comment",
        value: "",
      },
    });

  const { errors } = formState;

  const submitData = async (formData: SEPAssessmentModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.SEPAssessmentService.save(
      props.studentId,
      props.classId,
      props.sepTopicId,
      formData
    );

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Comment saved successfully");

      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });

      props.onClose(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

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
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("action")} />
          <Modal.Body>
                        
            <Form.Group className="mb-3">
              <FloatingLabel label="Note*">
                <Form.Control
                  type="text"
                  placeholder="Note*"
                  as={"textarea"}
                  {...register("value")}
                />
              </FloatingLabel>
              {errors.value && <ErrorLabel message={errors.value.message} />}
            </Form.Group>            
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
            <Button className="btn_main" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {states.showLoader && <Loader />}
    </>
  );
};

export default SaveComment;
