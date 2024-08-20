export interface UserEmergencyInfoDto {
  staffId?: number;
  severeAllergies?: string;
  nonSevereAllergies?: string;
  foodRestrictions?: string;
  medications: string;
  conditionAndImpairments?: string;
  immunizations?: string;
  preferredHospital: string;
  inCaseOfEmergency?: string;
  id?: number;
  studentId?:number;
}
