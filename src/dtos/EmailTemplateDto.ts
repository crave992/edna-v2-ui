import { OrganizationDto } from "./OrganizationDto";

export interface EmailTemplateDto {
  organisationId: number;
  organization: OrganizationDto;
  emailTemplateTypeId: number;
  emailTemplateTypeName: string;
  emailTemplateType: EmailTemplateTypeDto;
  fromEmail: string;
  ccEmails: string | null;
  bccEmails: string | null;
  subject: string;
  body: string;
}

export interface EmailTemplateTypeDto {
  id: number;
  name: string;
  displayName: string;
}
