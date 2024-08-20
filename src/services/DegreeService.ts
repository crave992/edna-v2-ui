import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IDegreeService from "./interfaces/IDegreeService";
import { DegreeDto } from "@/dtos/DegreeDto";

@injectable()
export default class DegreeService implements IDegreeService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<DegreeDto[]>>> {
        let result = this.httpService
            .call()
            .get<DegreeDto[], AxiosResponse<Response<DegreeDto[]>>>(
                `/Degree`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<DegreeDto>>> {
        let result = this.httpService
            .call()
            .get<DegreeDto, AxiosResponse<Response<DegreeDto>>>(
                `/Degree/${id}`
            );

        return result;
    }
}
