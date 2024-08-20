import { TYPES } from "@/config/types";
import IStaffService from "./interfaces/IStaffService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { EmailSettingDto } from "@/dtos/EmailSettingDto";
import EmailSettingModel from "@/models/EmailSettingModel";
import IEmailSettingService from "./interfaces/IEmailSettingService";

@injectable()
export default class EmailSettingService implements IEmailSettingService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getEmailSetting(): Promise<AxiosResponse<Response<EmailSettingDto>>> {
        let result = this.httpService
            .call()
            .get<EmailSettingDto, AxiosResponse<Response<EmailSettingDto>>>(`/EmailSetting`);

        return result;
    }

    saveEmailSetting(model: EmailSettingModel): Promise<AxiosResponse<Response<EmailSettingDto>>> {
        let result = this.httpService
            .call()
            .post<EmailSettingDto, AxiosResponse<Response<EmailSettingDto>>>(`/EmailSetting`, model);

        return result;
    }
}
