import { TYPES } from "@/config/types";
import ISemesterService from "./interfaces/ISemesterService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import SemesterModel from "@/models/SemesterModel";
import SemesterDto from "@/dtos/SemesterDto";

@injectable()
export default class SemesterService implements ISemesterService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<SemesterDto[]>>> {
        let result = this.httpService
            .call()
            .get<SemesterDto[], AxiosResponse<Response<SemesterDto[]>>>(
                `/Semester?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<SemesterDto>>> {
        let result = this.httpService
            .call()
            .get<SemesterDto, AxiosResponse<Response<SemesterDto>>>(`/Semester/${id}`);

        return result;
    }

    add(model: SemesterModel): Promise<AxiosResponse<Response<SemesterDto>>> {
        let result = this.httpService
            .call()
            .post<SemesterDto, AxiosResponse<Response<SemesterDto>>>(`/Semester`, model);

        return result;
    }

    update(
        id: number,
        model: SemesterModel
    ): Promise<AxiosResponse<Response<SemesterDto>>> {
        let result = this.httpService
            .call()
            .put<SemesterDto, AxiosResponse<Response<SemesterDto>>>(
                `/Semester/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<SemesterDto>>> {
        let result = this.httpService
            .call()
            .delete<SemesterDto, AxiosResponse<Response<SemesterDto>>>(
                `/Semester/${id}`
            );

        return result;
    }
}
