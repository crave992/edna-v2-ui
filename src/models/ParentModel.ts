export interface ParentModel {
  userName: string;
  email: string;
  password?: string;
  //confirmPassword: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  homePhone: string;
  chargeApplicationFee: boolean;
  chargeRegistrationFee: boolean;
  croppedImage: string;
  addressLine1?: string;
  addressLine2?: string;
  countryId?: number;
  stateId?: number;
  city?: string;
  zipcode?: string;
  jobTitle?: string;
  employer?: string;
  profession?: string;
  profileImage?: FileList;
  pickupAuthorization?: boolean;
  licenseImage?: FileList;
  licenseNumber?: string;
  contactPosition?: number;
  isEmergencyContact: boolean;
}

export interface ParentUpdateModel {
  parentId?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  cellPhone: string;
  homePhone: string;
  workEmail: string;
  jobTitle: string;
  employer: string;
  profession: string;
  position: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  countryId: number;
  stateId: number;
  city: string;
  zipcode: string;
  timezoneId: string;
  profileImage: FileList;
  croppedImage: string;
  pickupAuthorization?: boolean;
  licenseImage?: FileList;
  licenseNumber?: string;
  contactPosition?: number;
  currentOnboardingStep?: number;
  isEmergencyContact: boolean;
  croppedLicenseImage?:string;
  isActive?: boolean;
}

export interface SecondParentModel {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  homePhone: string;
  workEmail: string;
  employer: string;
  position: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  countryId: number;
  stateId: number;
  city: string;
  zipcode: string;
  timezoneId: string;
  profileImage: FileList;
  croppedImage: string;
}
