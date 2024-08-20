import * as Yup from "yup";

const PastDueFeeValidationSchema = Yup.object().shape({
    dueFrom: Yup.string().required("From date is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    uptoDate: Yup.string().required("To date is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    dueFee: Yup.string().required("Due fees is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    feeType: Yup.string().required("Fee type is required"),
});

export default PastDueFeeValidationSchema;