import * as Yup from "yup";

const PerformanceEvaluationSettingValidationSchema = Yup.object().shape({
  basedOn: Yup.number().test(
    "shouldBeGreaterThanZero",
    "BasedOn is required",
    (value) => {
      if (!value || value <= 0) return false;
      return true;
    }
  ),
});

export default PerformanceEvaluationSettingValidationSchema;
