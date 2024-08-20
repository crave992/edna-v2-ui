export default interface PerformanceEvaluationMappingQuestionDto {
  id: number;
  organizationId: number;
  questions: string;
  staffPerformanceEvaluationId: number;
  performanceEvaluationQuestionId: number;
  rating: number;
}
