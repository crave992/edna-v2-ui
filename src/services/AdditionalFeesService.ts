import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import AdditionalFeeParams from "@/params/AdditionalFeeParams";
import AdditionalFeeDto, { AdditionalFeeResponseDto } from "@/dtos/AdditionalFeeDto";
import AdditionalFeesModel from "@/models/AdditionalFeesModel";
import IAdditionalFeesService from "./interfaces/IAdditionalFeesService";

@injectable()
export default class AdditionalFeesService implements IAdditionalFeesService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(
        p: AdditionalFeeParams
    ): Promise<AxiosResponse<Response<AdditionalFeeResponseDto>>> {
        let result = this.httpService
            .call()
            .get<AdditionalFeeResponseDto, AxiosResponse<Response<AdditionalFeeResponseDto>>>(
                `/AdditionalFees`,
                {
                    params: p,
                }
            );

        return result;
    }


    getById(id: number): Promise<AxiosResponse<Response<AdditionalFeeDto>>> {
        let result = this.httpService
            .call()
            .get<AdditionalFeeDto, AxiosResponse<Response<AdditionalFeeDto>>>(`/AdditionalFees/${id}`);

        return result;
    }



    getByLevelId(
        levelId: number
    ): Promise<AxiosResponse<Response<AdditionalFeeDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<AdditionalFeeDto[], AxiosResponse<Response<AdditionalFeeDto[]>>>(
                `/Area/GetByLevelId/${levelId}`
            );

        return result;
    }

    add(model: AdditionalFeesModel): Promise<AxiosResponse<Response<AdditionalFeeDto>>> {
        let result = this.httpService
            .call()
            .post<AdditionalFeeDto, AxiosResponse<Response<AdditionalFeeDto>>>(`/AdditionalFees`, model);

        return result;
    }

    update(
        id: number,
        model: AdditionalFeesModel
    ): Promise<AxiosResponse<Response<AdditionalFeeDto>>> {
        let result = this.httpService
            .call()
            .put<AdditionalFeeDto, AxiosResponse<Response<AdditionalFeeDto>>>(`/AdditionalFees/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<AdditionalFeeDto>>> {
        let result = this.httpService
            .call()
            .delete<AdditionalFeeDto, AxiosResponse<Response<AdditionalFeeDto>>>(`/AdditionalFees/${id}`);

        return result;
    }
}
