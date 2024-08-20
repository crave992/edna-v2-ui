import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import HolidayDto from "@/dtos/HolidayDto";
import HolidayModel from "@/models/HolidayModel";
import IHolidayService from "./interfaces/IHolidayService";

@injectable()
export default class HolidayService implements IHolidayService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<HolidayDto[]>>> {
        let result = this.httpService
            .call()
            .get<HolidayDto[], AxiosResponse<Response<HolidayDto[]>>>(
                `/Holiday`
            );
        return result;
    }
    getById(id: number): Promise<AxiosResponse<Response<HolidayDto>>> {
        let result = this.httpService
            .call()
            .get<HolidayDto, AxiosResponse<Response<HolidayDto>>>(
                `/Holiday/${id}`
            );
        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<HolidayDto>>> {
        let result = this.httpService
            .call()
            .post<HolidayDto, AxiosResponse<Response<HolidayDto>>>(`/Holiday`, model);

        return result;
    }

    update(id: number, model: FormData): Promise<AxiosResponse<Response<HolidayDto>>> {
        let result = this.httpService
            .call()
            .put<HolidayDto, AxiosResponse<Response<HolidayDto>>>(
                `/Holiday/${id}`,
                model
            );

        return result;
    }
}
