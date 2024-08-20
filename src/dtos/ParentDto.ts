import CountryDto from './CountryDto';
import { OrganizationDto } from './OrganizationDto';
import StateDto from './StateDto';
import { StudentBasicDto } from './StudentDto';

export interface ParentDto {
  id: number;
  userId: string;
  email: string;
  username: string;
  timezoneId: string;
  profilePicture: string;
  organizationId: number;
  organization: OrganizationDto;
  firstName: string;
  lastName: string;
  cellPhone: string | null;
  homePhone: string | null;
  chargeApplicationFee: boolean;
  chargeRegistrationFee: boolean;
  acceptTerms: boolean;
  employer: string | null;
  position: string | null;
  profession: string | null;
  jobTitle: string | null;
  workEmail: string | null;
  ssn: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  countryId: number | null;
  country: CountryDto | null;
  stateId: number | null;
  state: StateDto | null;
  city: string | null;
  zipcode: string | null;
  parentId: number | null;
  passwordUpdateRequiredForNewRegistration: boolean;
  registrationStatus: string | null;
  registrationCompletedDate: Date | null;
  temporaryPassword: string | null;
  mainParent: ParentDto | null;
  createdOn: Date;
  updatedOn: Date | null;
  students: StudentBasicDto[] | null;
  isFullOnboarding: boolean;
  isActive?: boolean;
  currentOnboardingStep?: number;
}

export interface ParentBasicDto {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  profilePicture: string;
  isActive: boolean;
  passwordUpdateRequiredForNewRegistration: boolean;
  registrationStatus: string | null;
  registrationCompletedDate: Date | null;
  temporaryPassword: string | null;
  secondParent: ParentBasicDto[] | null;
  students: StudentBasicDto[] | null;
  isFullOnboarding: boolean;
}

export interface ParentListResponseDto {
  totalRecord: number;
  parent: ParentBasicDto[];
}
