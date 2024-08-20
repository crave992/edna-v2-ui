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
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import Loader from "../Loader";
import CustomInput from "../CustomFormControls/CustomInput";
import EmploymentFormValidationSchema from "@/validation/EmploymentFormValidationSchema";
import { EmploymentFormModel } from "@/models/EmploymentFormModel";
import { EmploymentFormDto } from "@/dtos/EmploymentFormDto";
import ErrorLabel from "../CustomError/ErrorLabel";
import Link from "next/link";

const initialState: InModalState = {
  modalHeading: "Add Form",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddEmploymentFormProp extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddEmploymentForm: NextPage<AddEmploymentFormProp> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);
  const [docUrl, setDocUrl] = useState<string>("");
  const fetchEmploymentForm = async (id: number) => {
    const response = await unitOfService.EmploymentFormService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let employmentForm = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Form",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", employmentForm.id);
      setValue("name", employmentForm.name);
      setValue("docUrl", employmentForm.docUrl);
      setDocUrl(employmentForm.docUrl);
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
  } = useForm<EmploymentFormModel>({
    resolver: yupResolver(EmploymentFormValidationSchema),
    defaultValues: {
      id: 0,
      name: "",
      docUrl: "",
    },
  });

  const submitData = async (data: EmploymentFormModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof EmploymentFormModel];
      if (key === "document") {
        formData.append(key, data?.[key][0]);
      } else {
        formData.append(key, value as string);
      }
    });
    let response: AxiosResponse<Response<EmploymentFormDto>>;
    if (states.isUpdate) {
      response = await unitOfService.EmploymentFormService.update(
        data.id,
        formData
      );
    } else {
      response = await unitOfService.EmploymentFormService.add(formData);
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
      toast.success("Form saved successfully");

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
          <CustomInput control={control} name="docUrl" type="hidden" />

          <Modal.Body>
            <Form.Group className="mb-3">
              <FormLabel>Form Name*</FormLabel>
              <CustomInput control={control} name="name" />
            </Form.Group>

            <Form.Group className="mb-3">
              <FormLabel>Document*</FormLabel>
              <Form.Control type="file" {...register("document")} />
              {errors.document && (
                <ErrorLabel message={errors.document.message} />
              )}

              {docUrl && (
                <FormLabel className="mt-3">
                  <Link href={docUrl} target="_blank">
                    {docUrl.split('/')[docUrl.split('/').length - 1]}
                  </Link>
                </FormLabel>
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

export default AddEmploymentForm;
