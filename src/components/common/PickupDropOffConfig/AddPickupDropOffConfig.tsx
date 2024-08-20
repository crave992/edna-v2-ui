import React, { useEffect, useReducer } from "react";
import CommonProps from "@/models/CommonProps";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { NextPage } from "next";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import PickupDropOffConfigModel from "@/models/PickupDropOffConfigModel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PickupDropoffConfigSchema from "@/validation/PickupDropoffConfigSchema";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import Loader from "../Loader";
import CustomInput from "../CustomFormControls/CustomInput";
const initialState: InModalState = {
  modalHeading: "Add Pickup Drop Off Config",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddPickupDropOffConfigProp extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddPickupDropOffConfig: NextPage<AddPickupDropOffConfigProp> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [pickupDropOffConfigState, dispatch] = useReducer(
    modalReducer,
    initialState
  );

  const fetchPickupDropOffConfig = async (id: number) => {
    const response =
      await unitOfService.PickupDropOffConfigurationService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let pickupDropOffConfig = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Pickup Drop Off Config",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", pickupDropOffConfig.id);
      setValue("minCount", pickupDropOffConfig.minCount);
      setValue("maxCount", pickupDropOffConfig.maxCount);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchPickupDropOffConfig(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue, control } =
    useForm<PickupDropOffConfigModel>({
      resolver: yupResolver(PickupDropoffConfigSchema),
      defaultValues: {
        id: 0,
        minCount: 0,
        maxCount:0,
      },
    });

  const { errors } = formState;
  const submitData = async (formData: PickupDropOffConfigModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<PickupDropoffConfigDto>>;
    if (pickupDropOffConfigState.isUpdate) {
      response = await unitOfService.PickupDropOffConfigurationService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.PickupDropOffConfigurationService.add(
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
      toast.success("Pickup drop-off config saved successfully");

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
          props.onClose(pickupDropOffConfigState.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{pickupDropOffConfigState.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("id")} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <FloatingLabel label="Min Count*">
                <CustomInput
                  control={control}
                  name="minCount"
                  placeholder="Min Count*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Max Count*">
                <CustomInput
                  control={control}
                  name="maxCount"
                  placeholder="Max Count*"
                />
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(pickupDropOffConfigState.refreshRequired);
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

      {pickupDropOffConfigState.showLoader && <Loader />}
    </>
  );
};

export default AddPickupDropOffConfig;
