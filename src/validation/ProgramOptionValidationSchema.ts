import * as Yup from "yup";

const ProgramOptionValidationSchema = Yup.object().shape({
    levelId: Yup.string().required("Level is required"),
    name: Yup.string().required("Name is required"),
    timeSchedule: Yup.string().required("Time is required"),
    fees: Yup.string().required("Time is required").matches(/^[0-9.]+$/, "Only numeric value allowed"),
    order: Yup.string().required("Order is required").matches(/^[0-9]+$/, "Only numeric value allowed"),
});

export default ProgramOptionValidationSchema;