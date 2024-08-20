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
import { StaffDeactivateModel } from "@/models/StaffModel";
import { StaffDeactivateValidationSchema } from "@/validation/StaffValidationSchema";

const initialState: InModalState = {
  modalHeading: "Deactivate Staff",
  isActivate: false,
  refreshRequired: false,
  showLoader: false,
};

interface DeactivateStaffProps extends CommonProps {
  isOpen: boolean;
  id: number;
  onClose: (refreshRequired: boolean) => void;
}

const DeactivateStaff: NextPage<DeactivateStaffProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [staffs, dispatch] = useReducer(modalReducer, initialState);

  const {
    handleSubmit,
    register,
    control,
  } = useForm<StaffDeactivateModel>({
    resolver: yupResolver(StaffDeactivateValidationSchema),
    defaultValues: {
      id: props.id,
      employmentEndDate: new Date(),
      deleteReason: "",
    },
  });

  const submitData = async (formData: StaffDeactivateModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    const response = await unitOfService.StaffService.deactivateStaff(
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
              <Form.Label>Employment End Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="employmentEndDate"
                placeholder="Employment End Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Reason*</Form.Label>
              <CustomInput
                control={control}
                name="deleteReason"
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

export default DeactivateStaff;
