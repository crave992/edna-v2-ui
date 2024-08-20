export interface EmailTemplateModel {
  emailTemplateTypeId: number;
  fromEmail: string;
  ccEmails: string | null;
  bccEmails: string | null;
  subject: string;
  body: string;
}
