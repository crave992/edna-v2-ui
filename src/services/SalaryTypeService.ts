import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ISalaryTypeService from "./interfaces/ISalaryTypeService";
import SalaryTypeDto from "@/dtos/SalaryTypeDto";

@injectable()
export default class SalaryTypeService implements ISalaryTypeService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<SalaryTypeDto[]>>> {
        let result = this.httpService
            .call()
            .get<SalaryTypeDto[], AxiosResponse<Response<SalaryTypeDto[]>>>(
                `/SalaryType`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<SalaryTypeDto>>> {
        let result = this.httpService
            .call()
            .get<SalaryTypeDto, AxiosResponse<Response<SalaryTypeDto>>>(`/SalaryType/${id}`);

        return result;
    }
}
