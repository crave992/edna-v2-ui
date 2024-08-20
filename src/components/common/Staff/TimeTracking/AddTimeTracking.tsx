import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import { StaffTimeTrackingModel } from "@/models/StaffTimeTrackingModel";
import StaffTimeTrackingValidationSchema from "@/validation/StaffTimeTrackingValidationSchema";
import { StaffTimeTrackingDto } from "@/dtos/StaffTimeTrackingDto";
import CustomInput from "../../CustomFormControls/CustomInput";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import Loader from "../../Loader";

const initialState: InModalState = {
  modalHeading: "Add Clock-in/out",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddTimeTrackingProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddTimeTracking: NextPage<AddTimeTrackingProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);

  const [trackingDate, settrackingDate] = useState<string>("");

  const fetchClockInOut = async (id: number) => {
    const response = await unitOfService.StaffTimeTrackingService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let clockInOut = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Clock-in/out",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", clockInOut.id);
      setValue(
        "trackingDate",
        new Date(
          unitOfService.DateTimeService.convertToLocalDate(
            clockInOut.trackingDate
          )
        )
      );
      setValue("action", clockInOut.action);
      setValue("time", clockInOut.time);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchClockInOut(props.id);
      }
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffTimeTrackingModel>({
    resolver: yupResolver(StaffTimeTrackingValidationSchema),
    defaultValues: {
      id: 0,
      trackingDate: new Date(),
      action: "",
      time: "",
    },
  });

  const submitData = async (formData: StaffTimeTrackingModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffTimeTrackingDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffTimeTrackingService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StaffTimeTrackingService.add(formData);
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
      toast.success("Record saved successfully");

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
              <Form.Label>TrackingDate Date</Form.Label>
              <CustomInput
                control={control}
                type="datepicker"
                name={"trackingDate"}
                onDateSelect={(selectedDate: string) => {
                  settrackingDate(selectedDate);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <CustomSelect
                name="action"
                control={control}
                placeholder="Action*"
                options={[
                  { value: "IN", label: "IN" },
                  { value: "OUT", label: "OUT" },
                ]}
                textField="label"
                valueField="value"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <h3 className="formBlock-heading">Time</h3>
              <CustomInput control={control} name="time" type="time" />
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

export default AddTimeTracking;
