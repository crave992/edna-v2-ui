export interface StudentImmunizationModel {
  studentId: number;
  isChildImmunized: boolean;
  immunizationCertificate: FileList;
  immunizationCertificateUrl: string;
  immunizationExemption: boolean;
  immunizationExemptionApprovalCertificate: FileList;
  immunizationExemptionApprovalCertificateUrl: string;
}
