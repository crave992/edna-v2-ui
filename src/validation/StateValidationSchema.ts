import * as Yup from "yup";

const StateValidationSchema = Yup.object().shape({
  countryId: Yup.string().required("Country is required").matches(/^\d+$/, "Only numeric value allowed"),
  code: Yup.string().required("Code is required"),
  name: Yup.string().required("Name is required")
});

export default StateValidationSchema;