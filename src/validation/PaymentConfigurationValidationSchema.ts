import * as Yup from "yup";

const PaymentConfigurationValidationSchema = Yup.object().shape({
    paymentGatewayProviderId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "Provider is required",
        (value) => {
            if (!value || value <= 0) return false;
            return true;
        }
    ),
    displayName: Yup.string().required("Display Name is required"),
    merchantId: Yup.string().required("Merchant Id is required"),
    apiKey: Yup.string().required("Api Key is required"),
    apiSecret: Yup.string().required("Api Secret is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    mode: Yup.string().required("Mode is required"),
    sandboxMerchantId: Yup.string(),
    sandboxApiKey: Yup.string(),
    sandboxApiSecret: Yup.string(),
    sandboxUsername: Yup.string(),
    sandboxPassword: Yup.string()
});

export default PaymentConfigurationValidationSchema;