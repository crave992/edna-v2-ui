import { EmailSettingDto } from "@/dtos/EmailSettingDto";
import Response from "@/dtos/Response";
import EmailSettingModel from "@/models/EmailSettingModel";

import { AxiosResponse } from "axios";

export default interface IEmailSettingService {

    getEmailSetting(): Promise<AxiosResponse<Response<EmailSettingDto>>>;
    saveEmailSetting(model: EmailSettingModel): Promise<AxiosResponse<Response<EmailSettingDto>>>;
}
