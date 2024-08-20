import RoleDto from './RoleDto';

export default interface UserDto {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  fullName: string;
  companyName: string;
  profilePicture: string;
  isActive: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  TtoFactorEnabled: boolean;
  registerDate: Date;
  lockoutEnd: Date | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  timezoneId: string;
  currencyCode: string;
  locales: string;
  roles: RoleDto[];
  token: string;
  refreshToken: string;
  passwordUpdateRequiredForNewRegistration: boolean;
  registrationStatus: string;
  registrationCompletedDate: Date | null;
  temporaryPassword: string | null;
  staffRoleId: number | null;
  organizationId: number | null;
  organizationName: string | null;
  staffId: number | null;
  hasClass: boolean | null;
  isAssociateGuide: boolean | null;
  isLeadGuide: boolean | null;
  isSpecialist: boolean | null;
  classAssignmentIds: number[] | null;
  studentAssignmentIds: number[] | null;
  hasAcceptedTermsAndConditions: boolean;
}

export interface UserBasicDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  profilePicture: string;
  roles: RoleDto[];
}

export interface UserStatusDto {
  isActive: boolean;
  locales: string;
  currencyCode: string;
}
