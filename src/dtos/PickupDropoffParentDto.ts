import { OrganizationDto } from "./OrganizationDto";
import { ParentDto } from "./ParentDto";

export interface PickupDropoffParentDto {
  id: number;
  organizationId: number;
  organization: OrganizationDto;
  parentId: number;
  parent: ParentDto;
  name: string;
  relation: string;
  phoneNumber: string;
  identityProof: string | null;
  isEmergencyContact: boolean | null;
  priority: string | null;
  createdOn: string;
  updatedOn: string | null;
  students: PickupDropoffStudentBasicDto[] | null
}

export interface PickupDropoffStudentBasicDto {
  id: number;
  name: string;
  isMapped: boolean;
}