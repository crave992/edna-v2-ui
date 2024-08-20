import { OrganizationDto } from "./OrganizationDto";
import StaffDto from "./StaffDto";
import StaffPerformanceEvaluationRatingMappingDto from "./StaffPerformanceEvaluationRatingMappingDto";

export default interface StaffPerformanceEvaluationDto {
  id: number;
  organizationId: number;
  organization: OrganizationDto;
  staffId: number;
  staff: StaffDto;
  basedOn: number;
  averageRating: number;
  notes: string | null;
  suggestion: string | null;
  ratingDate: Date;
  ratingUpdatedDate: Date | null;
  addedBy: string;
  staffPerformanceEvaluationRatingMapping: StaffPerformanceEvaluationRatingMappingDto[];
}

export interface StaffPerformanceEvaluationListResponseDto {
  totalRecord: number;
  staffPerformanceEvaluations: StaffPerformanceEvaluationDto[];
}
