import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import React, { useEffect, useReducer } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import JobTitleModel from "@/models/JobTitleModel";
import { yupResolver } from "@hookform/resolvers/yup";
import JobTitleValidationSchema from "@/validation/JobTitleValidationSchema";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { JobTitleDto } from "@/dtos/JobTitleDto";
import { toast } from "react-toastify";
import ErrorLabel from "../../CustomError/ErrorLabel";
import CustomInput from "../../CustomFormControls/CustomInput";

const initialState: InModalState = {
  modalHeading: "Add Job Title",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddJobTitleProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddJobTitle: NextPage<AddJobTitleProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchJobTitle = async (id: number) => {
    const response = await unitOfService.JobTitleService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let jobTitle = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Job Title",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", jobTitle.id);
      setValue("name", jobTitle.name);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchJobTitle(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<JobTitleModel>({
      resolver: yupResolver(JobTitleValidationSchema),
      defaultValues: {
        id: 0,
        name: "",
      },
    });

  const { errors } = formState;

  const submitData = async (formData: JobTitleModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<JobTitleDto>>;
    if (states.isUpdate) {
      response = await unitOfService.JobTitleService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.JobTitleService.add(formData);
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
      toast.success("Job title saved successfully");
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
          <Form.Control type="hidden" {...register("id")} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <FloatingLabel label="Job Title*">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="Job Title*"
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
    </>
  );
};

export default AddJobTitle;
