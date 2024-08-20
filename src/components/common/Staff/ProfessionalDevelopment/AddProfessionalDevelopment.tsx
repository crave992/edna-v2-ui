import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "../../CustomError/ErrorLabel";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import CustomInput from "../../CustomFormControls/CustomInput";
import { StaffProfessionalDevelopmentModel } from "@/models/StaffModel";
import { StaffProfessionalDevelopmentValidationSchema } from "@/validation/StaffValidationSchema";
import { StaffProfessionalDevelopmentDto } from "@/dtos/StaffDto";

const initialState: InModalState = {
  modalHeading: "Add Professional Development",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddProfessionalDevelopmentProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddProfessionalDevelopment: NextPage<AddProfessionalDevelopmentProps> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchStaffProfessionalDevelopment = async (id: number) => {
    const response =
      await unitOfService.StaffProfessionalDevelopmentService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let staffProfessionalDevelopment = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Professional Development",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", staffProfessionalDevelopment.id);
      setValue(
        "trainingOrganization",
        staffProfessionalDevelopment.trainingOrganization
      );
      setValue("topic", staffProfessionalDevelopment.topic);
      setValue(
        "remainingHours",
        staffProfessionalDevelopment.remainingHours.toString()
      );
      setValue(
        "entryDate",
        new Date(
          unitOfService.DateTimeService.convertToLocalDate(
            staffProfessionalDevelopment.dateOfEntry
          )
        )
      );
      setValue("note", staffProfessionalDevelopment.note);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchStaffProfessionalDevelopment(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<StaffProfessionalDevelopmentModel>({
      resolver: yupResolver(StaffProfessionalDevelopmentValidationSchema),
      defaultValues: {
        id: 0,
        trainingOrganization: "",
        topic: "",
        remainingHours: "",
        entryDate: new Date(),
        note: "",
      },
    });

  const { errors } = formState;

  const submitData = async (formData: StaffProfessionalDevelopmentModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffProfessionalDevelopmentDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffProfessionalDevelopmentService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StaffProfessionalDevelopmentService.add(
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
      toast.success("Professional development saved successfully");
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
              <FloatingLabel label="Training Organization*">
                <CustomInput
                  control={control}
                  name="trainingOrganization"
                  placeholder="Training Organization*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Topic*">
                <CustomInput
                  control={control}
                  name="topic"
                  placeholder="Topic*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Remaining Hours*">
                <CustomInput
                  control={control}
                  name="remainingHours"
                  placeholder="Remaining Hours*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Entry Date*
              </Form.Label>
              <CustomInput
                  type="datepicker"
                  control={control}
                  name="entryDate"
                  placeholder="Entry Date*"
                  dateFormat="MM/dd/yyyy"
                />
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Note">
                <CustomInput
                  type="textarea"
                  control={control}
                  name="note"
                  placeholder="Note"
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

export default AddProfessionalDevelopment;
