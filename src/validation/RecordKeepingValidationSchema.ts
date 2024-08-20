import * as Yup from "yup";

const RecordKeepingValidationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
    actionDate: Yup.string(),
    count: Yup.number()
});

export default RecordKeepingValidationSchema;

