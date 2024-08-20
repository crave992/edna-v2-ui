import { Button, Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../CustomFormControls/CustomInput";

import { NextPage } from "next";
import { container } from "@/config/ioc";
import { useForm } from "react-hook-form";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useEffect, useReducer } from "react";

import CommonProps from "@/models/CommonProps";
import {
  InPageAddUpdateActionType,
  InPageAddUpdateState,
  reducer,
} from "@/reducers/InPageAddUpdateAction";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../Loader";
import { toast } from "react-toastify";
import Link from "next/link";
import StudentInputFormModel from "@/models/StudentInputFormModel";
import { StudentInputFormsValidationSchema } from "@/validation/StudentInputFormsValidationSchema";
import { StudentInputFormDto } from "@/dtos/StudentInpurFormDto";
import { StudentQuestionTypes } from "@/helpers/StudentQuestionTypes";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";

const initialPageState: InPageAddUpdateState<StudentInputFormDto[]> = {
  id: 0,
  showLoader: false,
  refreshRequired: false,
  isUpdating: false,
};

interface StudentGoingOutFormProps extends CommonProps {
  studentId: number;
  formType: string;
}

const StudentInputForm: NextPage<StudentGoingOutFormProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(
    reducer<StudentInputFormDto[]>,
    initialPageState
  );

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<StudentInputFormModel>({
    resolver: yupResolver(StudentInputFormsValidationSchema),
    defaultValues: {
      studentId: props.studentId,
      formType: props.formType,
      questions: [],
    },
  });

  const fetchStudentInputForms = async (
    studentId: number,
    formType: string
  ) => {
    const response =
      await unitOfService.StudentConsentAndQuestionForm.getStudentInputFormByStudentIdAndFormType(
        studentId,
        formType
      );
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let inputForm = response.data.data;
      dispatch({
        type: InPageAddUpdateActionType.SET_DATA,
        payload: response.data.data,
      });
      dispatch({
        type: InPageAddUpdateActionType.SHOW_LOADER,
        payload: false,
      });
      setValue("studentId", props.studentId);
      setValue("formType", props.formType);
    }
  };

  const submitData = async (data: StudentInputFormModel) => {
    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: true,
    });
    const response =
      await unitOfService.StudentConsentAndQuestionForm.saveStudentInputFormByStudentIdAndFormType(
        data.studentId,
        data.formType,
        data.questions
      );

    dispatch({
      type: InPageAddUpdateActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200) {
      toast.success("Answer saved successfully");
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudentInputForms(props.studentId, props.formType);
    })();
  }, []);

  return (
    <>
      <Form
        method="post"
        autoComplete="off"
        onSubmit={handleSubmit(submitData)}
      >
        <Form.Control type="hidden" {...register("studentId")} />
        <Form.Control type="hidden" {...register("formType")} />

        {errors.studentId && <ErrorLabel message={errors.studentId.message} />}
        {errors.formType && <ErrorLabel message={errors.formType.message} />}

        <div className="formBlock">
          <Row>
            <Col md={12} lg={12}>
              {states &&
                states.data?.map((ques, index) => {
                  return (
                    <div key={ques.questionId} className="mb-4">
                      <Form.Control
                        type="hidden"
                        {...register(`questions.${index}.questionId`)}
                        defaultValue={ques.questionId}
                      />
                      <Form.Control
                        type="hidden"
                        {...register(`questions.${index}.acceptTerms`)}
                        defaultValue={"false"}
                      />
                      <Form.Control
                        type="hidden"
                        {...register(`questions.${index}.questionType`)}
                        defaultValue={ques.questionType || ""}
                      />

                      <Form.Label>{ques.question}</Form.Label>

                      {ques.questionType === StudentQuestionTypes.Subjective ? (
                        <CustomInput
                          control={control}
                          name={`questions.${index}.answer`}
                          placeholder="Your answer"
                          defaultValue={ques.answer || ""}
                        />
                      ) : (
                        <Form.Group className="mb-3">
                          <Form.Check
                            inline
                            label="Yes"
                            {...register(`questions.${index}.answer`)}
                            value="yes"
                            type="radio"
                            defaultChecked={
                              ques.answer === "yes" ? true : false
                            }
                            id={`answer-${ques.questionId}-1`}
                          />
                          <Form.Check
                            inline
                            label="No"
                            {...register(`questions.${index}.answer`)}
                            value="no"
                            type="radio"
                            defaultChecked={ques.answer === "no" ? true : false}
                            id={`answer-${ques.questionId}-2`}
                          />
                          {errors.questions?.[index]?.answer && (
                            <ErrorLabel
                              message={
                                errors.questions?.[index]?.answer?.message
                              }
                            />
                          )}
                          {errors.questions?.[index]?.questionId && (
                            <ErrorLabel
                              message={
                                errors.questions?.[index]?.questionId?.message
                              }
                            />
                          )}
                          {errors.questions?.[index]?.acceptTerms && (
                            <ErrorLabel
                              message={
                                errors.questions?.[index]?.acceptTerms?.message
                              }
                            />
                          )}
                          {errors.questions?.[index]?.questionType && (
                            <ErrorLabel
                              message={
                                errors.questions?.[index]?.questionType?.message
                              }
                            />
                          )}
                        </Form.Group>
                      )}
                    </div>
                  );
                })}
            </Col>
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Save
          </Button>
          <Link
            href={`/parent/student/profile/${props.studentId}`}
            className="btn_border mx-1"
          >
            Cancel
          </Link>
        </div>
      </Form>
      {states.showLoader && <Loader />}
    </>
  );
};

export default StudentInputForm;
