import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import PastDueFeeDto from "@/dtos/PastDueFeeDto";
import PastDueFeeParams from "@/params/PastDueFeeParams";
import PastDueFeesModel from "@/models/PastDueFeesModel";

export default interface IPastDueFeesService {
    getAll(
        p: PastDueFeeParams
    ): Promise<AxiosResponse<Response<PastDueFeeDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<PastDueFeeDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<PastDueFeeDto[]>>>;
    add(model: PastDueFeesModel): Promise<AxiosResponse<Response<PastDueFeeDto>>>;
    update(
        id: number,
        model: PastDueFeesModel
    ): Promise<AxiosResponse<Response<PastDueFeeDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<PastDueFeeDto>>>;
}
