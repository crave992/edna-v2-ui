import * as Yup from "yup";

const SEPAssessmentValidationSchema = Yup.object().shape({
    action: Yup.string().required("Action is required"),
    value: Yup.string().required("Note is required")
});

export default SEPAssessmentValidationSchema;