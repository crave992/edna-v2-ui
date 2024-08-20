import * as Yup from "yup";

const InvoiceConfigurationValidationSchema = Yup.object().shape({
    startWith: Yup.string().required("Start with is required"),
    incrementBy: Yup.string().required("Incremnet by is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    invoiceOn: Yup.string().required("Invoice on is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    payBy: Yup.string().required("Pay by is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    comments: Yup.string().required("Comment is required"),
});

export default InvoiceConfigurationValidationSchema;
