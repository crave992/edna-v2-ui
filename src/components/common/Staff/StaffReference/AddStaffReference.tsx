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
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import CustomInput from "../../CustomFormControls/CustomInput";
import {
  StaffReferenceModel,
} from "@/models/StaffModel";
import {
  StaffReferenceValidationSchema,
} from "@/validation/StaffValidationSchema";
import { StaffReferenceDto } from "@/dtos/StaffDto";

const initialState: InModalState = {
  modalHeading: "Add Reference",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddStaffReferenceProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddStaffReference: NextPage<AddStaffReferenceProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchStaffReference = async (id: number) => {
    const response = await unitOfService.StaffReferenceService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      const empHistory = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Reference",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", empHistory.id);
      setValue("name", empHistory.name);
      setValue("address", empHistory.address || "");
      setValue("phone", empHistory.phone || "");
      setValue("relationship", empHistory.relationship || "");
      setValue("yearsKnown", empHistory.yearsKnown || "");
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchStaffReference(props.id);
      }
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<StaffReferenceModel>({
    resolver: yupResolver(StaffReferenceValidationSchema),
    defaultValues: {
      id: 0,
      name: "",
      address: "",
      phone: "",
      relationship: "",
      yearsKnown: "",
    },
  });

  const submitData = async (formData: StaffReferenceModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StaffReferenceDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StaffReferenceService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.StaffReferenceService.add(formData);
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
      toast.success("Refrence saved successfully");
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
              <FloatingLabel label="Name*">
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="Name*"
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
              <FloatingLabel label="Relationship">
                <CustomInput
                  control={control}
                  name="relationship"
                  placeholder="Relationship"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3">
              <FloatingLabel label="	Years Known">
                <CustomInput
                  control={control}
                  name="yearsKnown"
                  placeholder="	Years Known"
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

export default AddStaffReference;
