import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import TermsAndPolicyDto from "@/dtos/TermsAndPolicyDto";
import ITermsAndPolicyService from "./interfaces/ITermsAndPolicyService";
import { TermsAndPolicyDirectoryCodeOfConductModel, TermsAndPolicyHippaModel, TermsAndPolicyParentRegistrationModel } from "@/models/TermsAndPolicyModel";

@injectable()
export default class TermsAndPolicyService implements ITermsAndPolicyService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<TermsAndPolicyDto>>> {
        let result = this.httpService
            .call()
            .get<TermsAndPolicyDto, AxiosResponse<Response<TermsAndPolicyDto>>>(`/TermsAndPolicy`);

        return result;
    }

    updateHippa(model: TermsAndPolicyHippaModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>> {
        let result = this.httpService
            .call()
            .post<TermsAndPolicyDto, AxiosResponse<Response<TermsAndPolicyDto>>>(`/TermsAndPolicy/UpdateHippa`, model);

        return result;
    }

    updateParentRegistration(model: TermsAndPolicyParentRegistrationModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>> {
        let result = this.httpService
            .call()
            .post<TermsAndPolicyDto, AxiosResponse<Response<TermsAndPolicyDto>>>(`/TermsAndPolicy/UpdateParentRegistration`, model);

        return result;
    }

    updateDirectoryCodeOfConduct(model: TermsAndPolicyDirectoryCodeOfConductModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>> {
        let result = this.httpService
            .call()
            .post<TermsAndPolicyDto, AxiosResponse<Response<TermsAndPolicyDto>>>(`/TermsAndPolicy/UpdateDirectoryCodeOfConduct`, model);

        return result;
    }
}
