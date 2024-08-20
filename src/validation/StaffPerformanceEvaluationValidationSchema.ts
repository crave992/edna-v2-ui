import * as Yup from "yup";

const StaffPerformanceEvaluationValidationSchema = Yup.object().shape({
  staffId: Yup.number().test(
    "shouldBeGreaterThanZero",
    "Staff is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  basedOn: Yup.number().test(
    "shouldBeGreaterThanZero",
    "basedOn is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
  notes: Yup.string(),
  suggestion: Yup.string(),
  averageRating: Yup.number(),
  staffPerformanceEvaluationRatingMapping: Yup.array().of(
    Yup.object().shape({
      staffPerformanceEvaluationId: Yup.number(),
      performanceEvaluationQuestionId: Yup.number().test(
        "shouldBeGreaterThanZero",
        "performanceEvaluationQuestionId is required",
        (value) => {
          if (!value || value <= 0) return false;
          return true;
        }
      ),
      rating: Yup.string().required("Select any rating"),
    })
  ),
});

export default StaffPerformanceEvaluationValidationSchema;
