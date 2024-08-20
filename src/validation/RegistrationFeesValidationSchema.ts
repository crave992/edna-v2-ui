import * as Yup from "yup";

const RegistrationFeesValidationSchema = Yup.object().shape({
    applicationFee: Yup.string().required("Application fee is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    registrationFee: Yup.string().required("Registration fee is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    taxPercentage: Yup.string().required("Tax percentage is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    creditCardCharges: Yup.string().required("Credit card charges is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
});

export default RegistrationFeesValidationSchema;