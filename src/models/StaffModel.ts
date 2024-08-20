export default interface StaffModel {
  id: number;
  userName: string;
  // password: string;
  // confirmPassword: string;
  nickName: string;
  title: string;
  firstName: string;
  lastName: string;
  systemRole: string;
  jobTitleId: number;
  email: string;
  empStartDate: Date | null;
  salaryTypeId: number;
  salaryAmount: number;
  description: string;
  profileImage: FileList;
  phoneNumber: string;
  croppedImage?: string;
}

export interface StaffUpdateModel {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  nickName: string;
  systemRole: string;
  jobTitleId: number;
  email: string;
  empStartDate: Date;
  salaryTypeId: number;
  salaryAmount: number;
  description: string;
  profileImage: FileList;
}

export interface StaffUpdateBySelfModel {
  title: string;
  firstName: string;
  lastName: string;
  nickName: string;
  description: string;
  systemRole: string;
  jobTitleId: number;
  countryId: number;
  empStartDate: Date | null;
  stateId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipcode: string;
  email: string;
  personalEmail: string | null;
  phoneNumber: string;
  homePhoneNumber: string | null;
  ssn: string;
  ethnicityCategoryId: number;
  ethnicityId: number;
  profileImage: FileList | null;
  salaryTypeId: number;
  salaryAmount: number;
  certifiedForLevels: number[];
  timezoneId: string;
  deleteReason: string;
  employmentEndDate: Date | null;
  isActive?: boolean;
  employmentRehireDate: Date | null;
}

export interface StaffDeactivateModel {
  id: number;
  employmentEndDate: Date;
  deleteReason: string;
}

export interface StaffActivateModel {
  id: number;
  employmentStartDate: Date;
  reason: string;
}

export interface StaffEmergencyInfoModel {
  whatToDoInCaseOfEmergency: string;
  preferredHospital: string;
  doctorInformation: string;
  phoneNumber: string;
}

export interface StaffMedicalConditionModel {
  conditionOne: string;
  conditionTwo: string;
  medicineNames: string;
  allergies: string;
  physicalImpairmentsNotes: string;
  additionalComments: string;
  acceptHippaTerms: boolean;
}

export interface StaffBankAccountInfoModel {
  bankAccountTypeId: number;
  bankName: string;
  routingNumber: string;
  confirmRoutingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  acceptTerms: boolean;
}

export interface StaffEmploymentFormModel {
  employmentFormId: number;
  document: FileList;
}

export interface StaffDegreeModel {
  id: number;
  degreeId: number;
  name: string;
}

export interface StaffCertificationModel {
  id: number;
  certificateId: number;
  expiryDate: Date;
}

export interface StaffEmergencyContactModel {
  id: number;
  firstName: string;
  lastName: string;
  preferredName: string;
  relationship: string;
  homeAddress: string;
  workAddress: string;
  countryId: number;
  stateId: number;
  city: string;
  zipcode: string;
  email: string;
  phone: string;
  priority: string;
}

export interface StaffReferenceModel {
  id: number;
  name: string;
  address: string;
  phone: string;
  relationship: string;
  yearsKnown: string;
}

export interface StaffProfessionalDevelopmentModel {
  id: number;
  trainingOrganization: string;
  topic: string;
  remainingHours: string;
  entryDate: Date;
  note: string;
}

export interface StaffEmploymentHistoryModel {
  id: number;
  dateFrom: Date;
  dateTo: Date;
  organisationName: string;
  address: string;
  phone: string;
  nameOfSupervisor: string;
}
