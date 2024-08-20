import * as Yup from "yup";

const HolidayTypeValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
});

export default HolidayTypeValidationSchema;

