import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStudentQuestionService from "./interfaces/IStudentQuestionService";
import StudentQuestionDto from "@/dtos/StudentQuestionDto";
import StudentQuestionModel from "@/models/StudentQuestionModel";


@injectable()
export default class StudentQuestionService implements IStudentQuestionService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string, levelId?: number): Promise<AxiosResponse<Response<StudentQuestionDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentQuestionDto[], AxiosResponse<Response<StudentQuestionDto[]>>>(
                `/StudentQuestion?q=${q}&levelId=${levelId}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<StudentQuestionDto>>> {
        let result = this.httpService
            .call()
            .get<StudentQuestionDto, AxiosResponse<Response<StudentQuestionDto>>>(`/StudentQuestion/${id}`);

        return result;
    }

    add(model: StudentQuestionModel): Promise<AxiosResponse<Response<StudentQuestionDto>>> {
        let result = this.httpService
            .call()
            .post<StudentQuestionDto, AxiosResponse<Response<StudentQuestionDto>>>(`/StudentQuestion`, model);

        return result;
    }

    update(
        id: number,
        model: StudentQuestionModel
    ): Promise<AxiosResponse<Response<StudentQuestionDto>>> {
        let result = this.httpService
            .call()
            .put<StudentQuestionDto, AxiosResponse<Response<StudentQuestionDto>>>(
                `/StudentQuestion/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<StudentQuestionDto>>> {
        let result = this.httpService
            .call()
            .delete<StudentQuestionDto, AxiosResponse<Response<StudentQuestionDto>>>(
                `/StudentQuestion/${id}`
            );

        return result;
    }
}
