import * as Yup from "yup";

const StudentQuestionValidationSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    questionType: Yup.string().required("Question type is required"),
    formType: Yup.string().required("Form type is required"),
    levelId: Yup.number()
});

export default StudentQuestionValidationSchema;


