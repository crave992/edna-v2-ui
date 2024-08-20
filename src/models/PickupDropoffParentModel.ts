export interface PickupDropoffParentModel {
  id: number;
  name: string;
  relation: string;
  phoneNumber: string;
  identityProof: FileList;
  identityProofUrl: string;
  isEmergencyContact: string;
  priority: string;
  studentIds: number[]
}
