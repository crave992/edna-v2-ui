import LevelDto from "@/dtos/LevelDto";
import Response from "@/dtos/Response";
import LevelModel from "@/models/LevelModel";
import LevelListParams from "@/params/LevelListParams";
import { AxiosResponse } from "axios";

export default interface ILevelService {
    getAll(q?: LevelListParams): Promise<AxiosResponse<Response<LevelDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<LevelDto>>>;
    add(model: LevelModel): Promise<AxiosResponse<Response<LevelDto>>>;
    update(id: number, model: LevelModel): Promise<AxiosResponse<Response<LevelDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<LevelDto>>>;
}
