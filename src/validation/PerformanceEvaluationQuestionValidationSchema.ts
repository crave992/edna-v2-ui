import * as Yup from "yup";

const PerformanceEvaluationQuestionValidationSchema = Yup.object().shape({
  questions: Yup.string().required("Question is required"),
});

export default PerformanceEvaluationQuestionValidationSchema;
