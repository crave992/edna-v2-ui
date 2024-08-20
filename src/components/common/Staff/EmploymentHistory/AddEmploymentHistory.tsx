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
import CustomInput from "../../CustomFormControls/CustomInput";
import { StaffEmploymentHistoryModel } from "@/models/StaffModel";
import { StaffEmploymentHistoryValidationSchema } from "@/validation/StaffValidationSchema";
import { StaffEmploymentHistoryDto } from "@/dtos/StaffDto";

const initialState: InModalState = {
  modalHeading: "Add Employment History",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddEmploymentHistoryProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddEmploymentHistory: NextPage<AddEmploymentHistoryProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchEmploymentHistory = async (id: number) => {
    const response = await unitOfService.StaffEmploymentHistoryService.getById(
      id
    );
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      const empHistory = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Employment History",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", empHistory.id);
      setValue("organisationName", empHistory.organisationName);
      setValue("address", empHistory.address || "");
      setValue("phone", empHistory.phone || "");
      setValue("nameOfSupervisor", empHistory.nameOfSupervisor || "");
      setValue(
        "dateFrom",
        new Date(
          unitOfService.DateTimeService.convertToLocalDate(empHistory.fromDate)
        )
      );

      if (empHistory.toDate) {
        setValue(
          "dateTo",
          new Date(
            unitOfService.DateTimeService.convertToLocalDate(empHistory.toDate)
          )
        );
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchEmploymentHistory(props.id);
      }
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffEmploymentHistoryModel>({
    resolver: yupResolver(StaffEmploymentHistoryValidationSchema),
    defaultValues: {
      id: 0,
      address: "",
      nameOfSupervisor: "",
      organisationName: "",
      phone: "",
    },
  });

  const submitData = async (formData: StaffEmploymentHistoryModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffEmploymentHistoryDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffEmploymentHistoryService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StaffEmploymentHistoryService.add(
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
      toast.success("Employment history saved successfully");
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
              <Form.Label>From Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="dateFrom"
                placeholder="From Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To Date</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="dateTo"
                placeholder="To Date"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Place of Employment*">
                <CustomInput
                  control={control}
                  name="organisationName"
                  placeholder="Place of Employment*"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Address">
                <CustomInput
                  control={control}
                  name="address"
                  placeholder="Address"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Phone">
                <CustomInput
                  control={control}
                  name="phone"
                  placeholder="Phone"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="Name of Supervisor">
                <CustomInput
                  control={control}
                  name="nameOfSupervisor"
                  placeholder="Name of Supervisor"
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

export default AddEmploymentHistory;
