import CountryDto from './CountryDto';
import { OrganizationPrimaryContactDto } from './OrganizationPrimaryContactDto';
import StateDto from './StateDto';
import UserContactDto from './UserContactDto';

export interface OrganizationDto {
  id: number;
  userId: string;
  userName: string;
  schoolName: string;
  profilePicture: string;
  timezoneId: string;
  schoolEmail: string;
  phoneNumber: string;
  subDomain: string;
  websiteUrl: string;
  about: string;
  isActive: boolean;
  addressLine1: string;
  addressLine2: string;
  countryId: number;
  country: CountryDto;
  stateId: number;
  state: StateDto;
  city: string;
  zipcode: string;
  primaryContact: OrganizationPrimaryContactDto;
  registerDate: Date;
  approvedDate: Date | null;
  organizationTypeId: number;
  organizationType: OrganizationTypeDto;
  currencyCode: string;
}

export interface OrganizationTypeDto {
  id: number;
  name: string;
}

export interface OrganizationBasicDto {
  about: string;
  addressLine1: string;
  addressLine2: string;
  approvedDate: string;
  city: string;
  country: CountryDto;
  countryId: number;
  currencyCode: string;
  id: number;
  isActive: boolean;
  lastImageGalleryUpdate: string;
  organizationType: OrganizationTypeDto;
  organizationTypeId: number;
  phoneNumber: string;
  primaryContact: UserContactDto;
  profilePicture: string;
  registerDate: string;
  schoolEmail: string;
  schoolName: string;
  state: StateDto;
  stateId: number;
  subDomain: string;
  termInfo: TermInfoDto;
  timezoneId: string;
  userId: string;
  userName: string;
  websiteUrl: string;
  zipcode: string;
}

export interface TermInfoDto {
  teacher: string;
  assistant: string;
  specialist: string;
  acquired: string;
  nido: string;
  toddler: string;
  nidoToddler: string;
  primary: string;
  elementary: string;
  lowerElementary: string;
  upperElementary:string;
}
