import { EmploymentFormDto } from "@/dtos/EmploymentFormDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";

export default interface IEmploymentFormService {
    getAll(q?: string): Promise<AxiosResponse<Response<EmploymentFormDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<EmploymentFormDto>>>;
    add(model: FormData): Promise<AxiosResponse<Response<EmploymentFormDto>>>;
    update(id: number, model: FormData): Promise<AxiosResponse<Response<EmploymentFormDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<EmploymentFormDto>>>;
}
