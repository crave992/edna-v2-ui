export interface StudentAllergyDto {
  studentId: number;
  allergyName: string;
  allergyIndication: string;
  actionTakenAgainstReaction: string;
  actionTakenAgainstSeriousReaction: string;
  contactPersonName1: string;
  contactPersonPhoneNumber1: string;
  contactPersonName2: string;
  contactPersonPhoneNumber2: string;
  callAnAmbulance: boolean;
  medicalForm: string;
  createdOn: Date;
  updatedOn: Date;
}
