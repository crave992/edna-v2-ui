import CommonProps from "@/models/CommonProps";
import CountryModel from "@/models/CountryModel";
import CountryValidationSchema from "@/validation/CountryValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "../CustomError/ErrorLabel";
import { useEffect, useReducer } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import Loader from "../Loader";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import CountryDto from "@/dtos/CountryDto";

const initialState: InModalState = {
  modalHeading: "Add Country",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddCountryProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddCountry: NextPage<AddCountryProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchCountry = async (id: number) => {
    const response = await unitOfService.CountryService.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let country = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Country",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
      setValue("id", country.id);
      setValue("code", country.code);
      setValue("name", country.name);
      setValue("locales", country.locales);
      setValue("displayOrder", country.displayOrder);
      setValue("status", country.status);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchCountry(props.id);
      }
    })();
  }, []);

  const { formState, handleSubmit, register, setValue } = useForm<CountryModel>(
    {
      resolver: yupResolver(CountryValidationSchema),
      defaultValues: {
        id: 0,
        code: "",
        name: "",
        locales: "",
        status: false,
      },
    }
  );

  const { errors } = formState;

  const submitData = async (formData: CountryModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<CountryDto>>;
    if (states.isUpdate) {
      response = await unitOfService.CountryService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.CountryService.add(formData);
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
      toast.success("Country saved successfully");
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
              <FloatingLabel label="Country Code*">
                <Form.Control
                  type="text"
                  placeholder="Country Code*"
                  {...register("code")}
                />
              </FloatingLabel>
              {errors.code && <ErrorLabel message={errors.code.message} />}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Country Name*">
                <Form.Control
                  type="text"
                  placeholder="Country Name*"
                  {...register("name")}
                />
              </FloatingLabel>
              {errors.name && <ErrorLabel message={errors.name.message} />}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Country Locales">
                <Form.Control
                  type="text"
                  placeholder="Country Locales"
                  {...register("locales")}
                />
              </FloatingLabel>
              {errors.name && <ErrorLabel message={errors.name.message} />}
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Display Order*">
                <Form.Control
                  type="text"
                  placeholder="Display Order*"
                  {...register("displayOrder")}
                />
              </FloatingLabel>
              {errors.displayOrder && (
                <ErrorLabel message={errors.displayOrder.message} />
              )}
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

export default AddCountry;
