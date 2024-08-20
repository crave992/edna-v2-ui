import { OrganizationDto } from "./OrganizationDto";
import { ParentDto } from "./ParentDto";

export interface PickupAuthorizationEmergencyContactConsentDto {
  id: number;
  organizationId: number;
  organization: OrganizationDto;
  parentId: number;
  parent: ParentDto;
  acceptTerms: boolean | null;
  acceptedDate: string;
}
