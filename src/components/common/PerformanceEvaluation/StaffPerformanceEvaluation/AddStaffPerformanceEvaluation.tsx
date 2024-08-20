import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
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
import StaffPerformanceEvaluationDto from "@/dtos/StaffPerformanceEvaluationDto";
import StaffPerformanceEvaluationModel from "@/models/StaffPerformanceEvaluationModel";
import StaffPerformanceEvaluationValidationSchema from "@/validation/StaffPerformanceEvaluationValidationSchema";
import ErrorLabel from "../../CustomError/ErrorLabel";
import PerformanceEvaluationMappingQuestionDto from "@/dtos/PerformanceEvaluationMappingQuestionDto";

const initialState: InModalState = {
  modalHeading: "Add Rating",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddStaffPerformanceEvaluationProps extends CommonProps {
  semesteryear?: StaffPerformanceEvaluationDto[];
  id: number;
  staffId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddStaffPerformanceEvaluation: NextPage<
  AddStaffPerformanceEvaluationProps
> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<StaffPerformanceEvaluationModel>({
    resolver: yupResolver(StaffPerformanceEvaluationValidationSchema),
    defaultValues: {
      staffId: 0,
      basedOn: 0,
      notes: "",
      suggestion: "",
      averageRating: 0,
      staffPerformanceEvaluationRatingMapping: [],
    },
  });

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchStaffPerformanceEvaluation = async (id: number) => {
    const response =
      await unitOfService.StaffPerformanceEvaluationService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let staffPerformanceEvaluation = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Rating",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("basedOn", staffPerformanceEvaluation.basedOn);
      setValue("notes", staffPerformanceEvaluation.notes ?? "");
      setValue("suggestion", staffPerformanceEvaluation.suggestion ?? "");
      setbasedOnValue(staffPerformanceEvaluation.basedOn);
    } else {
      fetchPerformanceEvaluationSetting();
    }
  };

  const [questions, setQuestions] = useState<
    PerformanceEvaluationMappingQuestionDto[]
  >([]);
  const fetchPerformanceEvaluationMappingQuestions = async (
    staffPerformanceEvaluationId: number
  ) => {
    const response =
      await unitOfService.PerformanceEvaluationQuestionService.getPerformanceEvaluationMappingQuestions(
        staffPerformanceEvaluationId
      );
    if (response && response.status === 200 && response.data.data) {
      setQuestions(response.data.data);
    }
  };

  const [basedOnValue, setbasedOnValue] = useState<number>();
  const fetchPerformanceEvaluationSetting = async () => {
    const response =
      await unitOfService.PerformanceEvaluationSettingService.get();
    if (response && response.status === 200 && response.data.data) {
      setbasedOnValue(response.data.data.basedOn);
      setValue("basedOn", response.data.data.basedOn);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchStaffPerformanceEvaluation(props.id);
        fetchPerformanceEvaluationMappingQuestions(props.id);
        setValue("staffId", props.staffId);
      }
    })();
  }, []);

  const basedOnList: number[] = Array.from(
    { length: basedOnValue ?? 0 },
    (_, index) => index + 1
  );

  const submitData = async (formData: StaffPerformanceEvaluationModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffPerformanceEvaluationDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffPerformanceEvaluationService.update(
        props.id,
        formData
      );
    } else {
      response = await unitOfService.StaffPerformanceEvaluationService.add(
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
      toast.success("Rating saved successfully");
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
        size="lg"
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
            {questions &&
              questions.length > 0 &&
              questions.map(
                (
                  question: PerformanceEvaluationMappingQuestionDto,
                  questionIndex
                ) => {
                  return (
                    <div key={question.id}>
                      <Form.Control
                        type="hidden"
                        {...register(
                          `staffPerformanceEvaluationRatingMapping.${questionIndex}.staffPerformanceEvaluationId`
                        )}
                        defaultValue={0}
                      />
                      <Form.Control
                        type="hidden"
                        {...register(
                          `staffPerformanceEvaluationRatingMapping.${questionIndex}.performanceEvaluationQuestionId`
                        )}
                        defaultValue={question.id}
                      />

                      <Form.Label>
                        <strong>{questionIndex + 1}.</strong>*{" "}
                        {question.questions}
                      </Form.Label>
                      <Form.Group className="mb-3">
                        {basedOnList &&
                          basedOnList.length > 0 &&
                          basedOnList.map((value, basedOnIndex) => {
                            return (
                              <Form.Check
                                key={basedOnIndex}
                                inline
                                label={`${value} Star`}
                                type="radio"
                                id={`${questionIndex}_${value}_star`}
                                value={value}
                                defaultChecked={
                                  question.rating.toString() ===
                                  value.toString()
                                    ? true
                                    : false
                                }
                                {...register(
                                  `staffPerformanceEvaluationRatingMapping.${questionIndex}.rating`
                                )}
                              />
                            );
                          })}
                      </Form.Group>

                      {errors.staffPerformanceEvaluationRatingMapping?.[
                        questionIndex
                      ]?.rating && (
                        <ErrorLabel
                          message={
                            errors.staffPerformanceEvaluationRatingMapping?.[
                              questionIndex
                            ]?.rating?.message
                          }
                        />
                      )}
                      {errors.staffPerformanceEvaluationRatingMapping?.[
                        questionIndex
                      ]?.staffPerformanceEvaluationId && (
                        <ErrorLabel
                          message={
                            errors.staffPerformanceEvaluationRatingMapping?.[
                              questionIndex
                            ]?.staffPerformanceEvaluationId?.message
                          }
                        />
                      )}
                      {errors.staffPerformanceEvaluationRatingMapping?.[
                        questionIndex
                      ]?.performanceEvaluationQuestionId && (
                        <ErrorLabel
                          message={
                            errors.staffPerformanceEvaluationRatingMapping?.[
                              questionIndex
                            ]?.performanceEvaluationQuestionId?.message
                          }
                        />
                      )}
                    </div>
                  );
                }
              )}

            <Form.Group className="mb-3">
              <FloatingLabel
                controlId="floatingInput"
                label="Notes"
                className="mb-3"
              >
                <CustomInput
                  type="textarea"
                  textAreaRows={3}
                  control={control}
                  name="notes"
                  placeholder="Notes"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel
                controlId="floatingInput"
                label="Suggestion"
                className="mb-3"
              >
                <CustomInput
                  type="textarea"
                  textAreaRows={3}
                  control={control}
                  name="suggestion"
                  placeholder="Suggestion"
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

export default AddStaffPerformanceEvaluation;
