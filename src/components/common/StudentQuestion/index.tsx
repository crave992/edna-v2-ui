import React, { useEffect, useReducer, useState } from "react";
import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import Loader from "../Loader";
import CustomInput from "../CustomFormControls/CustomInput";
import ErrorLabel from "../CustomError/ErrorLabel";
import StudentQuestionModel from "@/models/StudentQuestionModel";
import StudentQuestionDto from "@/dtos/StudentQuestionDto";
import StudentQuestionValidationSchema from "@/validation/StudentQuestionValidationSchema";
import { StudentQuestionTypes } from "@/helpers/StudentQuestionTypes";
import LevelDto from "@/dtos/LevelDto";
import CustomSelect from "../CustomFormControls/CustomSelect";

const initialState: InModalState = {
  modalHeading: "Add Question",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddStudentQuestionProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddStudentQuestion: NextPage<AddStudentQuestionProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchStudentQuestion = async (id: number) => {
    const response = await unitOfService.StudentQuestionService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let studentQuestion = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Question",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", studentQuestion.id);
      setValue("levelId", studentQuestion.level?.id || 0);
      setValue("question", studentQuestion.question);
      setValue("questionType", studentQuestion.questionType);
      setValue("formType", studentQuestion.formType);
    }
  };

  const [levels, setLevels] = useState<LevelDto[]>([]);
  const fetchLevel = async () => {
    const response = await unitOfService.LevelService.getAll();
    if (response && response.status === 200 && response.data.data) {
      setLevels(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchLevel();
        fetchStudentQuestion(props.id);
      }
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<StudentQuestionModel>({
    resolver: yupResolver(StudentQuestionValidationSchema),
    defaultValues: {
      id: 0,
      levelId: 0,
      question: "",
      questionType: "",
      formType: "",
    },
  });

  const submitData = async (formData: StudentQuestionModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StudentQuestionDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StudentQuestionService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StudentQuestionService.add(formData);
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
      toast.success("Question saved successfully");

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
          <CustomInput control={control} name="id" type="hidden" />

          <Modal.Body>
            <Form.Group className="mb-3">
              <CustomSelect
                name="levelId"
                control={control}
                placeholder="Class Level*"
                isSearchable={true}
                options={levels}
                textField="name"
                valueField="id"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Question*">
                <CustomInput
                  control={control}
                  name="question"
                  placeholder="Question*"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Select Question Type*">
                <Form.Select {...register("questionType")}>
                  <option value="">Select Question Type*</option>
                  <option value={`${StudentQuestionTypes.Subjective}`}>
                    {StudentQuestionTypes.Subjective}
                  </option>
                  <option value={`${StudentQuestionTypes.YesNo}`}>
                    {StudentQuestionTypes.YesNo}
                  </option>
                </Form.Select>
              </FloatingLabel>
              {errors.questionType && (
                <ErrorLabel message={errors.questionType.message} />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Form Type*">
                <Form.Select {...register("formType")}>
                  <option value="">Select Form Type*</option>
                  <option value="StudentInputForm"> Student Input Form</option>
                  <option value="GeneralPermissions">
                    General Permissions
                  </option>
                  <option value="GoingOutForm">Going Out Form</option>
                </Form.Select>
              </FloatingLabel>
              {errors.formType && (
                <ErrorLabel message={errors.formType.message} />
              )}
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

export default AddStudentQuestion;
