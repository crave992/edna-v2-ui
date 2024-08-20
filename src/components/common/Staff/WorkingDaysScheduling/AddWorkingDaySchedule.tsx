import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
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
import CustomSelect from "@/components/common/CustomFormControls/CustomSelect";
import CustomInput from "@/components/common/CustomFormControls/CustomInput";
import Loader from "@/components/common/Loader";
import { StaffSchedulingModel, StaffSchedulingSaveModel } from "@/models/StaffSchedulingModel";
import StaffSchedulingValidationSchema, { StaffSchedulingSaveValidationSchema } from "@/validation/StaffSchedulingValidationSchema";
import { StaffSchedulingDto, WorkingDaysMappedDto } from "@/dtos/StaffSchedulingDto";
import CustomFormError from "../../CustomFormControls/CustomFormError";

const initialState: InModalState = {
  modalHeading: "Add Schedule",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddWorkingDayScheduleProps extends CommonProps {
  id: number;
  staffId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddWorkingDaySchedule: NextPage<AddWorkingDayScheduleProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchStaffSchedulingByStaffIdAndId = async (staffId: number, id: number) => {
    const response =
      await unitOfService.StaffSchedulingService.getStaffSchedulingByStaffIdAndId(
        staffId,
        id
      );

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let staffScheduling = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Schedule",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", staffScheduling.id);
      setValue("staffId", props.staffId);
      setValue("staffWorkingDayId", staffScheduling.staffWorkingDayId);
      setValue("fromTime", staffScheduling.fromTime);
      setValue("toTime", staffScheduling.toTime);
      setValue("notes", staffScheduling.notes);
    }
  };

  const { formState: { errors }, handleSubmit, register, setValue, control, } = useForm<StaffSchedulingModel | StaffSchedulingSaveModel>({
    resolver: yupResolver(states.isUpdate ? StaffSchedulingValidationSchema : StaffSchedulingSaveValidationSchema),
    defaultValues: {
      id: 0,
      staffId: props.staffId,
      fromTime: "",
      toTime: "",
      notes: "",
      staffWorkingDayIds: [],
      staffWorkingDayId: 0,
    },
  });

  const submitData = async (formData: StaffSchedulingModel | StaffSchedulingSaveModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffSchedulingDto | StaffSchedulingDto[]>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffSchedulingService.update(formData.id, formData as StaffSchedulingModel);
    } else {
      response = await unitOfService.StaffSchedulingService.add(formData as StaffSchedulingSaveModel);
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && (response.status === 200 || response.status === 201)) {
      toast.success("Schedule saved successfully");

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

  const [workingDays, setWorkingDays] = useState<WorkingDaysMappedDto[]>([]);
  const fetchStaffWorkingDays = async (staffId: number) => {
    const response =
      await unitOfService.StaffSchedulingService.getWorkingDaysByStaffId(
        staffId
      );
    if (response && response.status === 200 && response.data.data) {
        const mappedWorkingDays = response.data.data.filter(e => e.isMapped === true);
      setWorkingDays(mappedWorkingDays);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchStaffSchedulingByStaffIdAndId(props.staffId, props.id);
        fetchStaffWorkingDays(props.staffId);
      }
    })();
  }, []);

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
          <Form.Control type="hidden" {...register("staffId")} />

          {errors.id && <CustomFormError error={errors.id} />}
          {errors.staffId && <CustomFormError error={errors.staffId} />}
          <Modal.Body>
            <Form.Group className="mb-3">
              {states.isUpdate ? (
                <CustomSelect
                  name="staffWorkingDayId"
                  control={control}
                  placeholder="Select Day*"
                  isSearchable={true}
                  options={workingDays}
                  textField="dayName"
                  valueField="dayId"
                />
              ) : (
                <CustomSelect
                  type="multi"
                  name="staffWorkingDayIds"
                  control={control}
                  placeholder="Select Day*"
                  isSearchable={true}
                  options={workingDays}
                  textField="dayName"
                  valueField="dayId"
                />
              )}
              
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="From Time*">
                <CustomInput
                  control={control}
                  name="fromTime"
                  placeholder="From Time*"
                  type="time"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="To Time*">
                <CustomInput
                  control={control}
                  name="toTime"
                  placeholder="To Time*"
                  type="time"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Notes">
                <CustomInput
                  control={control}
                  name="notes"
                  placeholder="Notes"
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

export default AddWorkingDaySchedule;
