import SemesterDto from "@/dtos/SemesterDto";
import Response from "@/dtos/Response";
import SemesterModel from "@/models/SemesterModel";
import { AxiosResponse } from "axios";

export default interface ISemesterService {
    getAll(q?: string): Promise<AxiosResponse<Response<SemesterDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<SemesterDto>>>;
    add(model: SemesterModel): Promise<AxiosResponse<Response<SemesterDto>>>;
    update(
        id: number,
        model: SemesterModel
    ): Promise<AxiosResponse<Response<SemesterDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<SemesterDto>>>;
}
