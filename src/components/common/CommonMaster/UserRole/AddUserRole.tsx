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
import UserRoleValidationSchema from "@/validation/UserRoleValidationSchema";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import CustomInput from "../../CustomFormControls/CustomInput";
import UserRoleModel from "@/models/UserRoleModel";
import { UserRoleDto } from "@/dtos/UserRoleDto";

const initialState: InModalState = {
  modalHeading: "Add User Role",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddUserRoleProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddUserRole: NextPage<AddUserRoleProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchUserRole = async (id: number) => {
    const response = await unitOfService.UserRoleService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let UserRole = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update User Role",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", UserRole.id);
      setValue("name", UserRole.name);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchUserRole(props.id);
      }
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm<UserRoleModel>({
    resolver: yupResolver(UserRoleValidationSchema),
    defaultValues: {
      id: 0,
      name: "",
    },
  });

  const submitData = async (formData: UserRoleModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<UserRoleDto>>;
    if (states.isUpdate) {
      response = await unitOfService.UserRoleService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.UserRoleService.add(formData);
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
      toast.success("User role saved successfully");
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

export default AddUserRole;
