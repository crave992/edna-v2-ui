import * as Yup from "yup";
export const StudentInputFormsValidationSchema = Yup.object().shape({
    studentId: Yup.number().required("Invalid student"),
    formType: Yup.string().required("Invalid form"),
    questions: Yup.array().of(
        Yup.object().shape({
            questionId: Yup.number(),
            questionType: Yup.string(),
            answer: Yup.string().when(
                "questionType",
                (questionType, schema) => {
                    return questionType && questionType?.[0] === "YesNo" ? schema.required("Please choose any option") : schema;
                }
            ),
            acceptTerms: Yup.string(),
        })
    ),
});