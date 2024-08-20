import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import CountryDto from "@/dtos/CountryDto";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import StateModel from "@/models/StateModel";
import StateValidationSchema from "@/validation/StateValidationSchema";
import StateDto from "@/dtos/StateDto";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import ErrorLabel from "../CustomError/ErrorLabel";
import Loader from "../Loader";

const initialState: InModalState = {
  modalHeading: "Add State",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddStateProps extends CommonProps {
  countries?: CountryDto[];
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddState: NextPage<AddStateProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchState = async (id: number) => {
    const response = await unitOfService.StateService.getById(id);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      let state = response.data.data;

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update State",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", state.id);
      setValue("code", state.code);
      setValue("name", state.name);
      setValue("countryId", state.countryId);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchState(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue } = useForm<StateModel>({
    resolver: yupResolver(StateValidationSchema),
    defaultValues: {
      id: 0,
      code: "",
      name: "",
    },
  });

  const { errors } = formState;

  const submitData = async (formData: StateModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<StateDto>>;
    if (states.isUpdate) {
      response = await unitOfService.StateService.update(formData.id, formData);
    } else {
      response = await unitOfService.StateService.add(formData);
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
      toast.success("State saved successfully");

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
              <FloatingLabel label="Select Country*">
                <Form.Select {...register("countryId")} defaultValue={""}>
                  <option value={""}>Select Country</option>
                  {props.countries &&
                    props.countries.map((country) => {
                      return (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      );
                    })}
                </Form.Select>
              </FloatingLabel>
              {errors.countryId && (
                <ErrorLabel message={errors.countryId.message} />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="State Code*">
                <Form.Control
                  type="text"
                  placeholder="State Code*"
                  {...register("code")}
                />
              </FloatingLabel>
              {errors.code && <ErrorLabel message={errors.code.message} />}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="State Name*">
                <Form.Control
                  type="text"
                  placeholder="State Name*"
                  {...register("name")}
                />
              </FloatingLabel>
              {errors.name && <ErrorLabel message={errors.name.message} />}
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

export default AddState;
