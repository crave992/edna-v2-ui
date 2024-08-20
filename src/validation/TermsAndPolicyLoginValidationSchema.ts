import * as Yup from "yup";

export const TermsAndPolicyHippaValidationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required")
});

export const TermsAndPolicyParentRegistrationValidationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required")
});

export const TermsAndPolicyCodeOfConductValidationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required")
});