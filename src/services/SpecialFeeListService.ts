import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import SpecialFeeListDto, { SpecialFeeListResponseDto } from "@/dtos/SpecialFeeListDto";
import SpecialFeeListModel from "@/models/SpecialFeeListModel";
import ISpecialFeeListService from "./interfaces/ISpecialFeeListService";
import SpecialFeeListPageParams from "@/params/SpecialFeeListPageParams";

@injectable()
export default class SpecialFeeListService implements ISpecialFeeListService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p?: SpecialFeeListPageParams): Promise<AxiosResponse<Response<SpecialFeeListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<SpecialFeeListResponseDto, AxiosResponse<Response<SpecialFeeListResponseDto>>>(`/SpecialFeeList`, {
                params: p
            });

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<SpecialFeeListDto>>> {
        let result = this.httpService
            .call()
            .get<SpecialFeeListDto, AxiosResponse<Response<SpecialFeeListDto>>>(`/SpecialFeeList/${id}`);

        return result;
    }
   

    add(model: SpecialFeeListModel): Promise<AxiosResponse<Response<SpecialFeeListDto>>> {
        let result = this.httpService
            .call()
            .post<SpecialFeeListDto, AxiosResponse<Response<SpecialFeeListDto>>>(`/SpecialFeeList`, model);

        return result;
    }

    update(
        id: number,
        model: SpecialFeeListModel
    ): Promise<AxiosResponse<Response<SpecialFeeListDto>>> {
        let result = this.httpService
            .call()
            .put<SpecialFeeListDto, AxiosResponse<Response<SpecialFeeListDto>>>(
                `/SpecialFeeList/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<SpecialFeeListDto>>> {
        let result = this.httpService
            .call()
            .delete<SpecialFeeListDto, AxiosResponse<Response<SpecialFeeListDto>>>(
                `/SpecialFeeList/${id}`
            );

        return result;
    }
}
