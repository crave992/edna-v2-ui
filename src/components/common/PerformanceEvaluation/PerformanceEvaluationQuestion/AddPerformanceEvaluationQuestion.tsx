import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import CustomInput from "../../CustomFormControls/CustomInput";
import PerformanceEvaluationQuestionDto from "@/dtos/PerformanceEvaluationQuestionDto";
import PerformanceEvaluationQuestionModel from "@/models/PerformanceEvaluationQuestionModel";
import PerformanceEvaluationQuestionValidationSchema from "@/validation/PerformanceEvaluationQuestionValidationSchema";

const initialState: InModalState = {
  modalHeading: "Add Performance Evaluation Question",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddPerformanceEvaluationQuestionProps extends CommonProps {
  semesteryear?: PerformanceEvaluationQuestionDto[];
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddPerformanceEvaluationQuestion: NextPage<
  AddPerformanceEvaluationQuestionProps
> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<PerformanceEvaluationQuestionModel>({
    resolver: yupResolver(PerformanceEvaluationQuestionValidationSchema),
    defaultValues: {
      questions: "",
    },
  });

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchPerformanceEvaluationQuestion = async (id: number) => {
    const response =
      await unitOfService.PerformanceEvaluationQuestionService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let performanceEvaluationQuestion = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Performance Evaluation Question",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("questions", performanceEvaluationQuestion.questions);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchPerformanceEvaluationQuestion(props.id);
      }
    })();
  }, []);

  const submitData = async (formData: PerformanceEvaluationQuestionModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<PerformanceEvaluationQuestionDto>>;
    if (states.isUpdate) {
      response =
        await unitOfService.PerformanceEvaluationQuestionService.update(
          props.id,
          formData
        );
    } else {
      response = await unitOfService.PerformanceEvaluationQuestionService.add(
        formData
      );
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (
      response &&
      (response.status === 200 || response.status === 201) &&
      response.data.data
    ) {
      toast.success("Performance Evaluation Question saved successfully");
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
          <Modal.Body>
            <Form.Group className="mb-3">
              <FloatingLabel label="Question*">
                <CustomInput
                  control={control}
                  name="questions"
                  placeholder="Question*"
                />
              </FloatingLabel>
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

export default AddPerformanceEvaluationQuestion;
