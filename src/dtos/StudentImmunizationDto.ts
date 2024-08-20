export interface StudentImmunizationDto {
  studentId: number;
  isChildImmunized: boolean;
  immunizationCertificate: string;
  immunizationExemption: boolean;
  immunizationExemptionApprovalCertificate: string;
  createdOn: Date;
  updatedOn: Date;
}
