import { OrganizationPrimaryContactModel } from "./OrganizationPrimaryContactModel";

export interface OrganizationModel {
  userName: string;
  password: string;
  confirmPassword: string;
  schoolName: string;
  schoolEmail: string;
  phoneNumber: string;
  subDomain: string;
  websiteUrl: string;
  about: string;
  addressLine1: string;
  addressLine2: string;
  countryId: number;
  stateId: number;
  city: string;
  zipcode: string;
  primaryContact: OrganizationPrimaryContactModel;
  organizationTypeId: number;
  croppedImage: string;
}

export interface OrganizationUpdateModel {
  schoolName: string;
  schoolEmail: string;
  phoneNumber: string;
  websiteUrl: string;
  about: string;
  addressLine1: string;
  addressLine2: string;
  countryId: number;
  stateId: number;
  city: string;
  zipcode: string;
  timezoneId: string;
  schoolLogo: FileList;
  primaryContact: OrganizationPrimaryContactModel;
  organizationTypeId: number;
  currencyCode: string;
  croppedImage: string;
}
