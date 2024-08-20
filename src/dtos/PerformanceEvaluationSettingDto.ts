export default interface PerformanceEvaluationSettingDto {
  id: number;
  organizationId: number;
  basedOn: number;
  createdOn: Date;
  updatedOn: Date | null;
}
