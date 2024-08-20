import { ParentInviteIsValidResponseDto, ParentInviteParamsDto, ParentInviteResultDto } from "@/dtos/ParentInviteDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IParentInviteService from "./interfaces/IParentInviteService";
import { injectable } from "inversify";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";

@injectable()
export default class ParentInviteService implements IParentInviteService {
    private readonly httpService: IHttpService;

    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    isValidInviteCode(code: string): Promise<AxiosResponse<Response<ParentInviteIsValidResponseDto>, any>> {
        let result = this.httpService
            .call()
            .get<ParentInviteIsValidResponseDto, AxiosResponse<Response<ParentInviteIsValidResponseDto>>>(`/ParentInvite/IsValidInviteCode?code=${code}`);
        return result;
    }

    inviteParent(params: ParentInviteParamsDto): Promise<AxiosResponse<Response<ParentInviteResultDto[]>, any>> {
        let result = this.httpService
            .call()
            .post<ParentInviteResultDto[], AxiosResponse<Response<ParentInviteResultDto[]>>>(`/ParentInvite/InviteParent`, params);

        return result;
    }

}