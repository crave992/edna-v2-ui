import * as Yup from "yup";

const StudentConsentFormValidationSchema = Yup.object().shape({
    acceptTerms: Yup.boolean().required("Accept the terms"),
});

export default StudentConsentFormValidationSchema;