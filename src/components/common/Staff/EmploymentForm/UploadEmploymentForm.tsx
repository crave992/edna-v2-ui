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
import { toast } from "react-toastify";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import Link from "next/link";
import CustomInput from "../../CustomFormControls/CustomInput";
import ErrorLabel from "../../CustomError/ErrorLabel";
import Loader from "../../Loader";
import { StaffEmploymentFormModel } from "@/models/StaffModel";
import { StaffEmploymentFormValidationSchema } from "@/validation/StaffValidationSchema";

const initialState: InModalState = {
  modalHeading: "Upload Form",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface UploadEmploymentFormProp extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const UploadEmploymentForm: NextPage<UploadEmploymentFormProp> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);  
  const fetchEmploymentForm = async (id: number) => {
    const response = await unitOfService.StaffService.getEmploymentForm();

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      const employmentForm = response.data.data;
      const uploadFormName = employmentForm.find(e => e.employmentFormId == props.id)?.employmentFormName ?? "";
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: `Upload ${uploadFormName} Form`,
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("employmentFormId", props.id);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchEmploymentForm(props.id);
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
  } = useForm<StaffEmploymentFormModel>({
    resolver: yupResolver(StaffEmploymentFormValidationSchema),
    defaultValues: {
      employmentFormId: props.id,
    },
  });

  const submitData = async (data: StaffEmploymentFormModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StaffEmploymentFormModel];
      if (key === "document") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as unknown as string);
      }
    });
    const response = await unitOfService.StaffService.saveEmploymentForm(
      formData
    );

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      toast.success("Form uploaded successfully");

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
          <CustomInput control={control} name="employmentFormId" type="hidden" />

          <Modal.Body>
            
            <Form.Group className="mb-3">
              <FormLabel>Document*</FormLabel>
              <Form.Control type="file" {...register("document")} />
              {errors.document && (
                <ErrorLabel message={errors.document.message} />
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

export default UploadEmploymentForm;
