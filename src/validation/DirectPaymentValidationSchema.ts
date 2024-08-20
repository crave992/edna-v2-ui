import * as Yup from "yup";

const DirectPaymentValidationSchema = Yup.object().shape({
    amount: Yup.string().required("Amount is required")
        .matches(/^\d+\.?\d{0,5}$/, "Invalid amount"),
    paymentDate: Yup.string().required("Payment date is required"),
    comment: Yup.string()
});

export default DirectPaymentValidationSchema;

