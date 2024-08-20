import { BankAccountTypeDto } from './BankAccountTypeDto';
import { ClassBasicDto } from './ClassDto';
import CountryDto from './CountryDto';
import { EmploymentFormDto } from './EmploymentFormDto';
import { EthnicityCategoryDto, EthnicityDto } from './EthnicityDto';
import { JobTitleDto } from './JobTitleDto';
import LevelDto from './LevelDto';
import SalaryTypeDto from './SalaryTypeDto';
import StateDto from './StateDto';
import { UserRoleDto } from './UserRoleDto';
import { UserEmergencyInfoDto } from './UserEmergencyInfoDto';
import UserContactMapModel from '@/models/UserContactModel';
import FileDto from './FileDto';

export default interface StaffDto {
  id: number;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  nickName: string;
  username?: string;
  email: string;
  profilePicture: string;
  roleId: number;
  ssn: string;
  role: UserRoleDto;
  jobTitleId: number;
  jobTitle: JobTitleDto;
  employmentStartDate: Date;
  employmentEndDate: Date | null;
  employmentRehireDate: Date | null;
  salaryTypeId: number;
  salaryType: SalaryTypeDto;
  salaryAmount: number;
  systemRole: string;
  description: string | null;
  deleteReason: string | null;
  countryId: number | null;
  country: CountryDto | null;
  stateId: number | null;
  state: StateDto | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  zipcode: string | null;
  personalEmail: string | null;
  phoneNumber: string | null;
  homePhoneNumber: string | null;
  ethnicityCategoryId: number | null;
  ethnicityCategory: EthnicityCategoryDto | null;
  ethnicityId: number | null;
  ethnicity: EthnicityDto | null;
  isActive?: boolean;
  timezoneId: string;
  createdOn: Date;
  updatedOn: Date | null;
  classAssignment: StaffClassAssignmentDto[];
  certificationByLevel: StaffCertifiedForLevelDto[];
  certification: StaffCertificationDto[];
  degree: StaffDegreeDto[];
  bankAccountInfo: StaffBankAccountInfoDto | null;
  employmentForm: StaffEmploymentFormDto[];
  employmentHistory: StaffEmploymentHistoryDto[];
  reference: StaffReferenceDto[];
  emergencyContact: StaffEmergencyContactDto[];
  emergencyInfo: UserEmergencyInfoDto | null;
  medicalCondition: StaffMedicalConditionDto | null;
  professionalDevelopment: StaffProfessionalDevelopmentDto[];
  userMedicalInformation: UserEmergencyInfoDto | null;
  userContacts: UserContactMapModel[];
  userContactMap: UserContactMapModel[];
  userFiles: FileDto[];
}

export interface StaffClassAssignmentDto {
  staffId: number;
  classId: number;
  class?: ClassBasicDto;
}

export interface StaffCertificationByLevelDto {
  staffId: number;
  staff: StaffDto;
  levelId: number;
  level: LevelDto;
}

export interface StaffCertifiedForLevelDto {
  levelId: number;
  levelName: string;
  fromAge: string;
  toAge: string;
  isCertified: boolean;
}

export interface StaffCertificationDto {
  id: number;
  staffId: number;
  certificateId: number;
  certificateName: string;
  expiryDate: Date;
}

export interface StaffDegreeDto {
  id: number;
  staffId: number;
  degreeId: number;
  degreeName: string;
  name: string;
}

export interface StaffBankAccountInfoDto {
  bankAccountTypeId: number;
  bankAccountType: BankAccountTypeDto;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  acceptTerms: boolean;
}

export interface StaffEmploymentFormDto {
  employmentFormId: number;
  employmentForm: EmploymentFormDto;
  status: string;
  docUrl: string | null;
}

export interface StaffEmploymentFormBasicDto {
  employmentFormId: number;
  employmentFormName: string;
  employmentFormUrl: string;
  employmentFormUrlByStaff: string | null;
  status: string;
  templateId: string;
}

export interface StaffEmploymentHistoryDto {
  id: number;
  fromDate: Date;
  toDate: Date | null;
  organisationName: string;
  address: string | null;
  phone: string | null;
  nameOfSupervisor: string | null;
}

export interface StaffReferenceDto {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  relationship: string | null;
  yearsKnown: string | null;
}

export interface StaffEmergencyContactDto {
  id: number;
  firstName: string;
  lastName: string | null;
  preferredName: string | null;
  relationship: string | null;
  homeAddress: string | null;
  workAddress: string | null;
  countryId: number;
  country: CountryDto | null;
  stateId: number;
  state: StateDto | null;
  city: string;
  zipcode: string;
  email: string | null;
  phone: string | null;
  priority: string | null;
}

export interface StaffEmergencyInfoDto {
  whatToDoInCaseOfEmergency: string | null;
  preferredHospital: string | null;
  doctorInformation: string | null;
  phoneNumber: string | null;
}

export interface StaffMedicalConditionDto {
  conditionOne: string | null;
  conditionTwo: string | null;
  medicineNames: string | null;
  allergies: string | null;
  physicalImpairmentsNotes: string | null;
  additionalComments: string | null;
  acceptHippaTerms: boolean;
}

export interface StaffProfessionalDevelopmentDto {
  id: number;
  trainingOrganization: string;
  topic: string;
  remainingHours: number;
  dateOfEntry: Date;
  status: string;
  note: string;
}

export interface StaffBasicDto {
  id: number;
  name: string;
  email: string;
  username: string;
  jobTitle: string;
  role: string;
  salaryType: string;
  profilePicture: string;
  hiredDate: Date;
  isActive: boolean;
  isMappedToClass: boolean;
  registrationStatus: string;
  classAssignment?: StaffClassAssignmentDto;
  userFiles: FileDto[];
}

export interface StaffListResponseDto {
  totalRecord: number;
  staff: StaffBasicDto[];
}
