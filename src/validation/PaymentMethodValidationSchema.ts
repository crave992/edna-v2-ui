import * as Yup from "yup";

const PaymentMethodValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

export default PaymentMethodValidationSchema;

