import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, Form, Modal } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import { StaffActivateModel } from "@/models/StaffModel";
import { StaffActivateValidationSchema } from "@/validation/StaffValidationSchema";

const initialState: InModalState = {
  modalHeading: "Activate Staff",
  isActivate: false,
  refreshRequired: false,
  showLoader: false,
};

interface ActivateStaffProps extends CommonProps {
  isOpen: boolean;
  id: number;
  onClose: (refreshRequired: boolean) => void;
  hiredDate: Date;
}

const ActivateStaff: NextPage<ActivateStaffProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [staffs, dispatch] = useReducer(modalReducer, initialState);

  const { handleSubmit, register, control } = useForm<StaffActivateModel>({
    resolver: yupResolver(StaffActivateValidationSchema),
    defaultValues: {
      id: props.id,
      employmentStartDate: new Date(
        unitOfService.DateTimeService.convertToLocalDate(props.hiredDate)
      ),
      reason: "",
    },
  });

  const submitData = async (formData: StaffActivateModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    const response = await unitOfService.StaffService.activateStaff(
      formData.id,
      formData
    );

    if (response && response.status === 200 && response.data.data) {
      toast.success("Staff deactivated successfully");
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
          props.onClose(staffs.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{staffs.modalHeading}</Modal.Title>
        </Modal.Header>

        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("id")} />
          <Modal.Body>
            <Form.Group>
              <Form.Label>Employment Start Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="employmentStartDate"
                placeholder="Employment Start Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Reason*</Form.Label>
              <CustomInput
                control={control}
                name="reason"
                textAreaRows={3}
                placeholder="Reason*"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(staffs.refreshRequired);
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

      {staffs.showLoader && <Loader />}
    </>
  );
};

export default ActivateStaff;
