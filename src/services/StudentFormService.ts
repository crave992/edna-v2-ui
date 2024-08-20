import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStudentFormService from "./interfaces/IStudentFormService";
import { StudentFormDto } from "@/dtos/StudentFormDto";

@injectable()
export default class StudentFormService implements IStudentFormService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<StudentFormDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentFormDto[], AxiosResponse<Response<StudentFormDto[]>>>(
                `/StudentForm?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<StudentFormDto>>> {
        let result = this.httpService
            .call()
            .get<StudentFormDto, AxiosResponse<Response<StudentFormDto>>>(`/StudentForm/${id}`);

        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<StudentFormDto>>> {
        let result = this.httpService
            .call()
            .post<StudentFormDto, AxiosResponse<Response<StudentFormDto>>>(`/StudentForm`, model);

        return result;
    }

    update(
        id: number,
        model: FormData
    ): Promise<AxiosResponse<Response<StudentFormDto>>> {
        let result = this.httpService
            .call()
            .put<StudentFormDto, AxiosResponse<Response<StudentFormDto>>>(
                `/StudentForm/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<StudentFormDto>>> {
        let result = this.httpService
            .call()
            .delete<StudentFormDto, AxiosResponse<Response<StudentFormDto>>>(
                `/StudentForm/${id}`
            );

        return result;
    }
}
