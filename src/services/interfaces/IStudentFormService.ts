import Response from "@/dtos/Response";
import { StudentFormDto } from "@/dtos/StudentFormDto";
import { AxiosResponse } from "axios";

export default interface IStudentFormService {
    getAll(q?: string): Promise<AxiosResponse<Response<StudentFormDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StudentFormDto>>>;
    add(model: FormData): Promise<AxiosResponse<Response<StudentFormDto>>>;
    update(id: number, model: FormData): Promise<AxiosResponse<Response<StudentFormDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StudentFormDto>>>;
}
