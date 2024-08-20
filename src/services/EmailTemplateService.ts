import { injectable } from "inversify";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import { EmailTemplateDto } from "@/dtos/EmailTemplateDto";
import Response from "@/dtos/Response";
import { EmailTemplateModel } from "@/models/EmailTemplateModel";
import IEmailTemplateService from "./interfaces/IEmailTemplateService";

@injectable()
export default class EmailTemplateService implements IEmailTemplateService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(): Promise<AxiosResponse<Response<EmailTemplateDto[]>>> {
    let result = this.httpService
      .call()
      .get<EmailTemplateDto[], AxiosResponse<Response<EmailTemplateDto[]>>>(
        `/EmailTemplate`
      );

    return result;
  }

  Add(
    model: EmailTemplateModel
  ): Promise<AxiosResponse<Response<EmailTemplateDto>>> {
    let result = this.httpService
      .call()
      .post<EmailTemplateDto, AxiosResponse<Response<EmailTemplateDto>>>(
        `/EmailTemplate`,
        model
      );

    return result;
  }

  getEmailTemplateTypes(): Promise<
    AxiosResponse<Response<EmailTemplateDto[]>>
  > {
    let result = this.httpService
      .call()
      .get<EmailTemplateDto[], AxiosResponse<Response<EmailTemplateDto[]>>>(
        `/EmailTemplate/GetEmailTemplateTypes`
      );

    return result;
  }

  getByTemplateTypeId(
    templateTypeId: number
  ): Promise<AxiosResponse<Response<EmailTemplateDto>, any>> {
    let result = this.httpService
      .call()
      .get<EmailTemplateDto, AxiosResponse<Response<EmailTemplateDto>>>(
        `/EmailTemplate/GetByTemplateTypeId/${templateTypeId}`
      );

    return result;
  }
}
