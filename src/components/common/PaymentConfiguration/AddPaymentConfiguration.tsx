import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorLabel from "../CustomError/ErrorLabel";
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
import { PaymentConfigurationModel } from "@/models/PaymentConfigurationModel";
import PaymentConfigurationValidationSchema from "@/validation/PaymentConfigurationValidationSchema";
import { PaymentConfigurationDto } from "@/dtos/PaymentConfigurationDto";
import CustomInput from "../CustomFormControls/CustomInput";
import CustomSelect from "../CustomFormControls/CustomSelect";
import { PaymentGatewayProviderDto } from "@/dtos/PaymentGatewayProviderDto";

const initialState: InModalState = {
  modalHeading: "Add Payment Configuration",
  isUpdate: false,
  refreshRequired: false,
  showLoader: true,
};

interface AddPaymentConfigurationProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddPaymentConfiguration: NextPage<AddPaymentConfigurationProps> = (
  props
) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [states, dispatch] = useReducer(modalReducer, initialState);

  const fetchPaymentConfiguration = async (id: number) => {
    const response = await unitOfService.PaymentConfigurationService.getById(
      id
    );
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });
    if (response && response.status === 200 && response.data.data) {
      let paymentConfiguration = response.data.data;
      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Payment Configuration",
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });

      setValue("id", paymentConfiguration.id);
      setValue(
        "paymentGatewayProviderId",
        paymentConfiguration.paymentGatewayProviderId
      );
      setValue("displayName", paymentConfiguration.displayName);
      setValue("merchantId", paymentConfiguration.merchantId || "");
      setValue("apiKey", paymentConfiguration.apiKey || "");
      setValue("apiSecret", paymentConfiguration.apiSecret || "");
      setValue("username", paymentConfiguration.username || "");
      setValue("password", paymentConfiguration.password || "");
      setValue("mode", paymentConfiguration.mode || "");
      setValue(
        "sandboxMerchantId",
        paymentConfiguration.sandboxMerchantId || ""
      );
      setValue("sandboxApiKey", paymentConfiguration.sandboxApiKey || "");
      setValue("sandboxApiSecret", paymentConfiguration.sandboxApiSecret || "");
      setValue("sandboxUsername", paymentConfiguration.sandboxUsername || "");
      setValue("sandboxPassword", paymentConfiguration.sandboxPassword || "");
    }
  };

  const [paymentGatewayProviders, setPaymentGatewayProviders] = useState<
    PaymentGatewayProviderDto[]
  >([]);
  const fetchPaymentGatewayProviders = async () => {
    const response =
      await unitOfService.PaymentConfigurationService.getAllPaymentGatewayProviders();
    if (response && response.status === 200 && response.data.data) {
      setPaymentGatewayProviders(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        await fetchPaymentGatewayProviders();
        await fetchPaymentConfiguration(props.id);
      }
    })();
  }, []);

  const { handleSubmit, register, setValue, control } =
    useForm<PaymentConfigurationModel>({
      resolver: yupResolver(PaymentConfigurationValidationSchema),
      defaultValues: {
        id: 0,
        paymentGatewayProviderId: 0,
        displayName: "",
        merchantId: "",
        apiKey: "",
        apiSecret: "",
        username: "",
        password: "",
        mode: "",
        sandboxMerchantId: "",
        sandboxApiKey: "",
        sandboxApiSecret: "",
        sandboxUsername: "",
        sandboxPassword: "",
      },
    });

  const submitData = async (formData: PaymentConfigurationModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<PaymentConfigurationDto>>;
    if (states.isUpdate) {
      response = await unitOfService.PaymentConfigurationService.update(
        formData.id,
        formData
      );
    } else {
      response = await unitOfService.PaymentConfigurationService.add(formData);
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
      toast.success("Payment configuration saved successfully");
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
                name="paymentGatewayProviderId"
                control={control}
                placeholder="Payment Gateway Provider*"
                isSearchable={true}
                options={paymentGatewayProviders}
                textField="name"
                valueField="id"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Display Name*">
                <CustomInput
                  control={control}
                  name="displayName"
                  placeholder="Display Name*"
                />
              </FloatingLabel>
            </Form.Group>

            <fieldset>
              <legend>Production Account Details</legend>
              <Form.Group className="mb-3">
                <FloatingLabel label="Merchant Id*">
                  <CustomInput
                    control={control}
                    name="merchantId"
                    placeholder="Merchant Id*"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Api Key*">
                  <CustomInput
                    control={control}
                    name="apiKey"
                    placeholder="Api Key*"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Api Secret*">
                  <CustomInput
                    control={control}
                    name="apiSecret"
                    placeholder="Api Secret*"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Username*">
                  <CustomInput
                    control={control}
                    name="username"
                    placeholder="Username*"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Password*">
                  <CustomInput
                    control={control}
                    name="password"
                    placeholder="Password*"
                    type="password"
                  />
                </FloatingLabel>
              </Form.Group>
            </fieldset>

            <fieldset>
              <legend>Payment Mode</legend>
              <Form.Group className="mb-3">
                <CustomSelect
                  name="mode"
                  control={control}
                  placeholder="Select Mode*"
                  isSearchable={true}
                  options={[
                    { label: "Production", text: "Production" },
                    { label: "Sandbox", text: "Sandbox" },
                  ]}
                  textField="text"
                  valueField="label"
                />
              </Form.Group>
            </fieldset>

            <fieldset>
              <legend>Sandbox Account Details</legend>
              <Form.Group className="mb-3">
                <FloatingLabel label="Merchant Id">
                  <CustomInput
                    control={control}
                    name="sandboxMerchantId"
                    placeholder="Merchant Id"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Api Key">
                  <CustomInput
                    control={control}
                    name="sandboxApiKey"
                    placeholder="Api Key"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Api Secret">
                  <CustomInput
                    control={control}
                    name="sandboxApiSecret"
                    placeholder="Api Secret"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Username">
                  <CustomInput
                    control={control}
                    name="sandboxUsername"
                    placeholder="Username"
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <FloatingLabel label="Password">
                  <CustomInput
                    control={control}
                    name="sandboxPassword"
                    placeholder="Password"
                    type="password"
                  />
                </FloatingLabel>
              </Form.Group>
            </fieldset>
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

export default AddPaymentConfiguration;
