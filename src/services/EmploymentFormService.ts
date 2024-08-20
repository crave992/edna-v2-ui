import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IEmploymentFormService from "./interfaces/IEmploymentFormService";
import { EmploymentFormDto } from "@/dtos/EmploymentFormDto";

@injectable()
export default class EmploymentFormService implements IEmploymentFormService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<EmploymentFormDto[]>>> {
        let result = this.httpService
            .call()
            .get<EmploymentFormDto[], AxiosResponse<Response<EmploymentFormDto[]>>>(
                `/EmploymentForm?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<EmploymentFormDto>>> {
        let result = this.httpService
            .call()
            .get<EmploymentFormDto, AxiosResponse<Response<EmploymentFormDto>>>(`/EmploymentForm/${id}`);

        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<EmploymentFormDto>>> {
        let result = this.httpService
            .call()
            .post<EmploymentFormDto, AxiosResponse<Response<EmploymentFormDto>>>(`/EmploymentForm`, model);

        return result;
    }

    update(
        id: number,
        model: FormData
    ): Promise<AxiosResponse<Response<EmploymentFormDto>>> {
        let result = this.httpService
            .call()
            .put<EmploymentFormDto, AxiosResponse<Response<EmploymentFormDto>>>(
                `/EmploymentForm/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<EmploymentFormDto>>> {
        let result = this.httpService
            .call()
            .delete<EmploymentFormDto, AxiosResponse<Response<EmploymentFormDto>>>(
                `/EmploymentForm/${id}`
            );

        return result;
    }
}
