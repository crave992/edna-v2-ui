import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import PastDueFeeParams from "@/params/PastDueFeeParams";
import PastDueFeeDto from "@/dtos/PastDueFeeDto";
import PastDueFeesModel from "@/models/PastDueFeesModel";
import IPastDueFeesService from "./interfaces/IPastDueFeesService";

@injectable()
export default class PastDueFeesService implements IPastDueFeesService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(
        p: PastDueFeeParams
    ): Promise<AxiosResponse<Response<PastDueFeeDto[]>>> {
        let result = this.httpService
            .call()
            .get<PastDueFeeDto[], AxiosResponse<Response<PastDueFeeDto[]>>>(
                `/LatePaymentFees`,
                {
                    params: p,
                }
            );

        return result;
    }


    getById(id: number): Promise<AxiosResponse<Response<PastDueFeeDto>>> {
        let result = this.httpService
            .call()
            .get<PastDueFeeDto, AxiosResponse<Response<PastDueFeeDto>>>(`/LatePaymentFees/${id}`);

        return result;
    }



    getByLevelId(
        levelId: number
    ): Promise<AxiosResponse<Response<PastDueFeeDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<PastDueFeeDto[], AxiosResponse<Response<PastDueFeeDto[]>>>(
                `/Area/GetByLevelId/${levelId}`
            );

        return result;
    }

    add(model: PastDueFeesModel): Promise<AxiosResponse<Response<PastDueFeeDto>>> {
        let result = this.httpService
            .call()
            .post<PastDueFeeDto, AxiosResponse<Response<PastDueFeeDto>>>(`/LatePaymentFees`, model);

        return result;
    }

    update(
        id: number,
        model: PastDueFeesModel
    ): Promise<AxiosResponse<Response<PastDueFeeDto>>> {
        let result = this.httpService
            .call()
            .put<PastDueFeeDto, AxiosResponse<Response<PastDueFeeDto>>>(`/LatePaymentFees/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<PastDueFeeDto>>> {
        let result = this.httpService
            .call()
            .delete<PastDueFeeDto, AxiosResponse<Response<PastDueFeeDto>>>(`/LatePaymentFees/${id}`);

        return result;
    }
}
