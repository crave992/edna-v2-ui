import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IRegistrationFeesService from "./interfaces/IRegistrationFeesService";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import RegistrationFeesParams from "@/params/RegistrationFeesParams";
import RegistrationFeesModel from "@/models/RegistrationFeesModel";

@injectable()
export default class RegistrationFeesService implements IRegistrationFeesService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(
        p: RegistrationFeesParams
    ): Promise<AxiosResponse<Response<RegistrationFeesDto[]>>> {
        let result = this.httpService
            .call()
            .get<RegistrationFeesDto[], AxiosResponse<Response<RegistrationFeesDto[]>>>(
                `/RegistrationFees`,
                {
                    params: p,
                }
            );

        return result;
    }


    getById(id: number): Promise<AxiosResponse<Response<RegistrationFeesDto>>> {
        let result = this.httpService
            .call()
            .get<RegistrationFeesDto, AxiosResponse<Response<RegistrationFeesDto>>>(`/RegistrationFees/${id}`);

        return result;
    }



    getByLevelId(
        levelId: number
    ): Promise<AxiosResponse<Response<RegistrationFeesDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<RegistrationFeesDto[], AxiosResponse<Response<RegistrationFeesDto[]>>>(
                `/Area/GetByLevelId/${levelId}`
            );

        return result;
    }

    add(model: RegistrationFeesModel): Promise<AxiosResponse<Response<RegistrationFeesDto>>> {
        let result = this.httpService
            .call()
            .post<RegistrationFeesDto, AxiosResponse<Response<RegistrationFeesDto>>>(`/RegistrationFees`, model);

        return result;
    }

    update(
        id: number,
        model: RegistrationFeesModel
    ): Promise<AxiosResponse<Response<RegistrationFeesDto>>> {
        let result = this.httpService
            .call()
            .put<RegistrationFeesDto, AxiosResponse<Response<RegistrationFeesDto>>>(`/RegistrationFees/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<RegistrationFeesDto>>> {
        let result = this.httpService
            .call()
            .delete<RegistrationFeesDto, AxiosResponse<Response<RegistrationFeesDto>>>(`/RegistrationFees/${id}`);

        return result;
    }

    getOrganizationId(): Promise<
        AxiosResponse<Response<RegistrationFeesDto>>
    > {
        let result = this.httpService
            .call()
            .get<
                RegistrationFeesDto,
                AxiosResponse<Response<RegistrationFeesDto>>
            >(`/RegistrationFees/GetOrganizationId`);

        return result;
    }

    getSchoolFeeSettings(): Promise<
        AxiosResponse<Response<RegistrationFeesDto>>
    > {
        let result = this.httpService
            .call()
            .get<
                RegistrationFeesDto,
                AxiosResponse<Response<RegistrationFeesDto>>
            >(`/RegistrationFees/GetSchoolFeeSettings`);

        return result;
    }
}
