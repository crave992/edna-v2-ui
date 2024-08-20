import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
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
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import Loader from "@/components/common/Loader";
import ErrorLabel from "@/components/common/CustomError/ErrorLabel";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import StudentConsentFormModel from "@/models/StudentConsentFormModel";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";
import StudentConsentFormValidationSchema from "@/validation/StudentConsentFormValidationSchema";
import { DocuSignModel, DocuSignStudentConsentFormModel } from "@/models/DocuSignModel";

const initialState: InModalState = {
  modalHeading: "Update Consent",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};
interface AddConsentFormProps extends CommonProps {
  id: number;
  studentId: number;
  isOpen: boolean;
  templateId: string;
  onClose: (refreshRequired: boolean) => void;
}

const AddConsentForm: NextPage<AddConsentFormProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);
  const [formDetails, setFromDetails] = useState<StudentConsentFormDto>();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    control,
  } = useForm<StudentConsentFormModel>({
    resolver: yupResolver(StudentConsentFormValidationSchema),
    defaultValues: {
      studentId: props.studentId,
      studentFormId: props.id,
      acceptTerms: false,
    },
  });

  const submitData = async (formData: StudentConsentFormModel) => {
    let response =
      await unitOfService.StudentConsentAndQuestionForm.updateStudentConsentAndQuestionForm(
        formData
      );
    if (
      response &&
      (response.status === 200 || response.status === 201) && response.data.data) {
      dispatch({
        type: InModalActionType.SHOW_LOADER,
        payload: false,
      });
      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });
      toast.success("Form saved successfully");
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
        size="lg"
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
          <CustomInput control={control} name="studentId" type="hidden" />
          <CustomInput control={control} name="studentFormId" type="hidden" />

          <Modal.Body>
            <iframe
              src={formDetails?.docUrl}
              className="w-100 mb-3"
              style={{ minHeight: "450px" }}
            ></iframe><Form.Group className="mb-3">
              <Form.Check
                inline
                type="checkbox"
                id="acceptTerms"
                label="By checking this box, I agree that I have read this form and understood the terms and conditions. I agree to abide by it."
                {...register("acceptTerms")} />
              {errors.acceptTerms && (
                <ErrorLabel message={errors.acceptTerms.message} />
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

export default AddConsentForm;
