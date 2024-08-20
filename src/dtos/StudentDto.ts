import { ClassBasicDto } from './ClassDto';
import CountryDto from './CountryDto';
import { EthnicityCategoryDto, EthnicityDto } from './EthnicityDto';
import FileDto from './FileDto';
import LevelDto from './LevelDto';
import { ParentBasicDto } from './ParentDto';
import ProgramOptionDto from './ProgramOptionDto';
import { RecordKeepingDto } from './RecordKeepingDto';
import StateDto from './StateDto';
import { StudentAllergyDto } from './StudentAllergyDto';
import { StudentDentistDto } from './StudentDentistDto';
import { StudentImmunizationDto } from './StudentImmunizationDto';
import { StudentPhysicianDto } from './StudentPhysicianDto';
import { UserEmergencyInfoDto } from './UserEmergencyInfoDto';
import UserContactMapModel from '@/models/UserContactModel';

export interface StudentDto {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  fullName: string;
  nickName: string;
  profilePicture: string;
  dateOfBirth: Date;
  dob: Date;
  gender: string;
  levelId: number;
  level: LevelDto;
  ethnicityCategoryId: number;
  ethnicityCategory:EthnicityCategoryDto;
  ethnicityId: number;
  ethnicity:EthnicityDto;
  programOptionId: number;
  programOption: ProgramOptionDto;
  addressLine1: string | null;
  addressLine2: string | null;
  countryId: number | null;
  country: CountryDto | null;
  stateId: number | null;
  state: StateDto | null;
  city: string | null;
  zipcode: string | null;
  hobbies: string | null;
  achievements: string | null;
  likes: string | null;
  dislikes: string | null;
  strengths: string | null;
  areasOfNeededGrowth: string | null;
  siblingAtSchool: boolean;
  includeInformationInDirectory: boolean;
  isBeforeAndAfterSchoolCareRequire: boolean;
  fromTime?: string;
  toTime?: string;
  createdOn: Date;
  updatedOn: Date | null;
  beforeAndAfterSchoolCare: StudentBeforeAndAfterSchoolCareDto | null;
  studentPhysician: StudentPhysicianDto | null;
  studentDentist: StudentDentistDto | null;
  studentAllergy: StudentAllergyDto | null;
  studentImmunization: StudentImmunizationDto | null;

  oldDatabaseId: number | null;
  applicationFee: number | null;
  registrationFee: number | null;
  taxPercentage: number | null;
  taxAmount: number | null;
  creditCardProcessingFeePercentage: number | null;
  creditCardProcessingFee: number | null;
  totalAmount: number;
  isPaid: boolean;
  paidDate: Date;
  userFiles: FileDto[];
  currentOnboardingStep?: number | null;
  userContactMap: UserContactMapModel[];
  userMedicalInformation: UserEmergencyInfoDto | null;
  isActive?: boolean;
  active?: boolean;
  enrolledDate: Date | null;
  startedSchoolDate: Date | null;
  disenrolledDate: Date | null;
}

export interface StudentBeforeAndAfterSchoolCareDto {
  studentId: number;
  student: StudentDto;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean | null;
  sunday: boolean | null;
  fromTime: string | null;
  toTime: string | null;
}

export interface StudentBasicDto {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  dob: Date;
  age: string;
  className: string;
  classes: ClassBasicDto[];
  profilePicture: string;
  allergyName: string;
  siblingAtSchool: boolean;
  siblings: StudentBasicDto[] | null;
  parent: ParentBasicDto[] | null;
  isMappedToClass: boolean;
  levelId: number;
  levelName: string;
  includeInformationInDirectory: boolean;
  level: LevelDto;
  programOption: ProgramOptionDto;
  isPaid: boolean;
  active: boolean;
  userMedicalInformation: UserEmergencyInfoDto | null;
  userContactMap: UserContactMapModel[];
  setupCompleted?: boolean;
  userFiles: FileDto[];
  currentOnboardingStep?: number | null;
}

export interface StudentMostBasicDto {
  id: number;
  name: string;
  isSelected: boolean;
  recordKeeping?: RecordKeepingDto[];
}
export interface StudentBirthdayBasicDto {
  birthday: string;
  firstName: string;
  id: number;
  lastName: string;
  nickName: null | string;
  profilePicture: null | string;
}

export interface StudentListResponseDto {
  totalRecord: number;
  student: StudentBasicDto[];
}

export interface StudentMilestoneDto {
  createdBy: {
    email: string;
    fullName: string;
    id: number;
    profilePicture: string;
    roles: string | null;
    userName: string | null;
  };
  student?: StudentDto;
  createdOn: string;
  id: number;
  lesson: string;
  lessonImageCaption: string;
  lessonImageUrl: string;
  lessonState: string;
  notes: string;
  date?: string;
  title?: string;
}
