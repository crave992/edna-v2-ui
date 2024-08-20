import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { EmailTemplateDto } from "@/dtos/EmailTemplateDto";
import { EmailTemplateModel } from "@/models/EmailTemplateModel";
export default interface IEmailTemplateService {
  getAll(): Promise<AxiosResponse<Response<EmailTemplateDto[]>>>;
  Add(
    model: EmailTemplateModel
  ): Promise<AxiosResponse<Response<EmailTemplateDto>>>;
  getEmailTemplateTypes(): Promise<AxiosResponse<Response<EmailTemplateDto[]>>>;
  getByTemplateTypeId(
    templateTypeId: number
  ): Promise<AxiosResponse<Response<EmailTemplateDto>>>;
}
