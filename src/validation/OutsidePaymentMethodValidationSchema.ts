import * as Yup from "yup";

const OutsidePaymentMethodValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
});

export default OutsidePaymentMethodValidationSchema;

