import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import {
  Button,
  FloatingLabel,
  Form,
  Modal,
  NavLink,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
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
import CustomInput from "../CustomFormControls/CustomInput";
import CustomSelect from "../CustomFormControls/CustomSelect";
import PaymentMethodDto from "@/dtos/PaymentMethodDto";
import { SavedAchModel } from "@/models/SavedCardOrAchModel";
import {
  SavedAchValidationSchema,
} from "@/validation/SavedCardOrAchModelValidationSchema";
import { SavedCardOrAchDto } from "@/dtos/SavedCardOrAchDto";
import ErrorLabel from "../CustomError/ErrorLabel";

const initialState: InModalState = {
  modalHeading: "Add Ach",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddAchProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddAch: NextPage<AddAchProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchAch = async (id: number) => {
    const response = await unitOfService.SavedCardOrAchSrvice.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let card = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Ach",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", card.id);
      setValue("paymentMethodId", card.paymentMethodId);
      setValue("achHolderName", card.cardOrAchHolderName || "");
      setValue("aliasAchName", card.aliasCardOrAchName || "");
      setValue("routingNumber", card.routingNumber || "");
      setValue("accountNumber", card.accountNumber || "");
      setValue("billingAddress", card.billingAddress || "");
      setValue("billingZipcode", card.billingZipcode || "");
      setValue("isPrimaryCard", card.isPrimaryCard);
      setValue("acceptTerms", card.acceptTerms);
    }
  };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
  const fetchPaymentMethods = async () => {
    const response =
      await unitOfService.PaymentMethodService.getAllForDropDown();
    if (response && response.status === 200 && response.data.data) {
      setPaymentMethods(
        response.data.data.filter((e) => e.name.toLowerCase() === "ach")
      );
    }
  };

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (props.isOpen && !isCancelled) {
        await fetchPaymentMethods();
        await fetchAch(props.id);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<SavedAchModel>({
    resolver: yupResolver(SavedAchValidationSchema),
    defaultValues: {
      id: 0,
      paymentMethodId: 0,
      achHolderName: "",
      aliasAchName: "",
      routingNumber: "",
      accountNumber: "",
      billingAddress: "",
      billingZipcode: "",
      isPrimaryCard: false,
      acceptTerms: false,
    },
  });

  const submitData = async (formData: SavedAchModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<SavedCardOrAchDto>>;
    if (states.isUpdate) {
      response = await unitOfService.SavedCardOrAchSrvice.updateAch(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.SavedCardOrAchSrvice.addAch(formData);
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
      toast.success("Ach saved successfully");
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
          <Modal.Body
            style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
          >
            <Form.Group className="mb-3">
              <CustomSelect
                name="paymentMethodId"
                control={control}
                placeholder="Select Type*"
                isSearchable={true}
                options={paymentMethods}
                textField="name"
                valueField="id"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Ach Holder Name*">
                <CustomInput
                  control={control}
                  name="achHolderName"
                  placeholder="Ach Holder Name*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Alias Ach Name*">
                <CustomInput
                  control={control}
                  name="aliasAchName"
                  placeholder="Alias Ach Name*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Routing Number*">
                <CustomInput
                  control={control}
                  name="routingNumber"
                  placeholder="Routing Number*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Account Number*">
                <CustomInput
                  control={control}
                  name="accountNumber"
                  placeholder="Account Number*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Billing Address">
                <CustomInput
                  control={control}
                  name="billingAddress"
                  placeholder="Billing Address"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Billing Zipcode">
                <CustomInput
                  control={control}
                  name="billingZipcode"
                  placeholder="Billing Zipcode"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                inline
                type="checkbox"
                id={`isPrimaryCard`}
                {...register("isPrimaryCard")}
              />
              <Form.Label htmlFor="isPrimaryCard">Make as Primary</Form.Label>
            </Form.Group>
            {errors.isPrimaryCard && (
              <ErrorLabel message={errors.isPrimaryCard.message} />
            )}

            <Form.Group className="mb-3">
              <Form.Check
                inline
                type="checkbox"
                id={`acceptTerms`}
                {...register("acceptTerms")}
              />
              <Form.Label htmlFor="acceptTerms">
                I agree to all the{" "}
                <NavLink className="d-inline">
                  <strong>Terms & Condition</strong>
                </NavLink>
              </Form.Label>
            </Form.Group>
            {errors.acceptTerms && (
              <ErrorLabel message={errors.acceptTerms.message} />
            )}
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

export default AddAch;
