import PerformanceEvaluationQuestionDto from "./PerformanceEvaluationQuestionDto";
import StaffPerformanceEvaluationDto from "./StaffPerformanceEvaluationDto";

export default interface StaffPerformanceEvaluationRatingMappingDto {
  staffPerformanceEvaluationId: number;
  staffPerformanceEvaluation: StaffPerformanceEvaluationDto;
  performanceEvaluationQuestionId: number;
  performanceEvaluationQuestion: PerformanceEvaluationQuestionDto;
  rating: number;
}
