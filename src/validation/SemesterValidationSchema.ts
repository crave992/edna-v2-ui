import * as Yup from "yup";

const SemesterValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    year: Yup.string().required("Year is required")
        .matches(/^\d+$/, "Only numeric value allowed"),
    semStartDate: Yup.string().required("Start date is required"),
    semEndDate: Yup.string().required("End date is required"),


});

export default SemesterValidationSchema;

