import { TYPES } from "@/config/types";
import IHolidayTypeService from "./interfaces/IHolidayTypeService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import HolidayTypeModel from "@/models/HolidayTypeModel";
import HolidayTypeDto from "@/dtos/HolidayTypeDto";

@injectable()
export default class HolidayTypeService implements IHolidayTypeService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<HolidayTypeDto[]>>> {
        let result = this.httpService
            .call()
            .get<HolidayTypeDto[], AxiosResponse<Response<HolidayTypeDto[]>>>(
                `/HolidayType?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<HolidayTypeDto>>> {
        let result = this.httpService
            .call()
            .get<HolidayTypeDto, AxiosResponse<Response<HolidayTypeDto>>>(`/HolidayType/${id}`);

        return result;
    }

    add(model: HolidayTypeModel): Promise<AxiosResponse<Response<HolidayTypeDto>>> {
        let result = this.httpService
            .call()
            .post<HolidayTypeDto, AxiosResponse<Response<HolidayTypeDto>>>(`/HolidayType`, model);

        return result;
    }

    update(
        id: number,
        model: HolidayTypeModel
    ): Promise<AxiosResponse<Response<HolidayTypeDto>>> {
        let result = this.httpService
            .call()
            .put<HolidayTypeDto, AxiosResponse<Response<HolidayTypeDto>>>(
                `/HolidayType/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<HolidayTypeDto>>> {
        let result = this.httpService
            .call()
            .delete<HolidayTypeDto, AxiosResponse<Response<HolidayTypeDto>>>(
                `/HolidayType/${id}`
            );

        return result;
    }
}
