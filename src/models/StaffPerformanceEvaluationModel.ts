import StaffPerformanceEvaluationRatingMappingModel from "./StaffPerformanceEvaluationRatingMappingModel";

export default interface StaffPerformanceEvaluationModel {
  staffId: number;
  basedOn: number;
  averageRating: number;
  notes: string;
  suggestion: string;
  staffPerformanceEvaluationRatingMapping: StaffPerformanceEvaluationRatingMappingModel[];
}
