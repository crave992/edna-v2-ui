import * as Yup from "yup";

const CountryValidationSchema = Yup.object().shape({
    code: Yup.string().required("Code is required"),
    name: Yup.string().required("Name is required"),
    displayOrder: Yup.string().required("Display order is required")
        .matches(/^\d+$/, "Only numeric value allowed"),
    status: Yup.boolean(),
    locales: Yup.string(),
});

export default CountryValidationSchema;