import * as Yup from "yup";

const SpecialFeeListValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    pricePerUnit: Yup.string().required("Price Per Unit is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
});

export default SpecialFeeListValidationSchema;

