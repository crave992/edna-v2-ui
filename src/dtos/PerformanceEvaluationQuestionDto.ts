import { OrganizationDto } from "./OrganizationDto";

export default interface PerformanceEvaluationQuestionDto {
  id: number;
  organizationId: number;
  organization: OrganizationDto;
  questions: string;
  createdOn: Date;
  updatedOn: Date | null;
}
