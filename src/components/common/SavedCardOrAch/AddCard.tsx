import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  Modal,
  NavLink,
  Row,
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
import { SavedCardModel } from "@/models/SavedCardOrAchModel";
import { SavedCardValidationSchema } from "@/validation/SavedCardOrAchModelValidationSchema";
import { SavedCardOrAchDto } from "@/dtos/SavedCardOrAchDto";
import ErrorLabel from "../CustomError/ErrorLabel";

const initialState: InModalState = {
  modalHeading: "Add Card",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddCardProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddCard: NextPage<AddCardProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchCard = async (id: number) => {
    const response = await unitOfService.SavedCardOrAchSrvice.getById(id);
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let card = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Card",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", card.id);
      setValue("paymentMethodId", card.paymentMethodId);
      setValue("cardHolderName", card.cardOrAchHolderName || "");
      setValue("aliasCardName", card.aliasCardOrAchName || "");
      setValue("cardNumber", card.cardNumber || "");
      setValue("expMonth", card.expMonth || "");
      setValue("expYear", card.expYear || "");
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
        response.data.data.filter((e) => e.name.toLowerCase() === "credit card")
      );
    }
  };

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      if (props.isOpen && !isCancelled) {
        await fetchPaymentMethods();
        await fetchCard(props.id);
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
  } = useForm<SavedCardModel>({
    resolver: yupResolver(SavedCardValidationSchema),
    defaultValues: {
      id: 0,
      paymentMethodId: 0,
      cardHolderName: "",
      aliasCardName: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      billingAddress: "",
      billingZipcode: "",
      isPrimaryCard: false,
      acceptTerms: false,
    },
  });

  const submitData = async (formData: SavedCardModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<SavedCardOrAchDto>>;
    if (states.isUpdate) {
      response = await unitOfService.SavedCardOrAchSrvice.updateCard(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.SavedCardOrAchSrvice.addCard(formData);
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
      toast.success("Card saved successfully");
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
              <FloatingLabel label="Card Holder Name*">
                <CustomInput
                  control={control}
                  name="cardHolderName"
                  placeholder="Card Holder Name*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Alias Card Name*">
                <CustomInput
                  control={control}
                  name="aliasCardName"
                  placeholder="Alias Card Name*"
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Card Number*">
                <CustomInput
                  control={control}
                  name="cardNumber"
                  placeholder="Card Number*"
                />
              </FloatingLabel>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Expiry Month*">
                    <CustomInput
                      control={control}
                      name="expMonth"
                      placeholder="Expiry Month*"
                    />
                  </FloatingLabel>
                  <span>In 2 digit format. Example: 01</span>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <FloatingLabel label="Expiry Year*">
                    <CustomInput
                      control={control}
                      name="expYear"
                      placeholder="Expiry Year*"
                    />
                  </FloatingLabel>
                  <span>In 2 digit format Example: 27</span>
                </Form.Group>
              </Col>
            </Row>

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

export default AddCard;
