import Response from "@/dtos/Response";


import { AxiosResponse } from "axios";
import ProgramOptionDto, { ProgramOptionResponseDto } from "@/dtos/ProgramOptionDto";
import ProgramOptionModel from "@/models/ProgramOptionModel";
import ProgramOptionParams from "@/params/ProgramOptionParams";

export default interface IProgramOptionService {
    getAll(
        p: ProgramOptionParams
    ): Promise<AxiosResponse<Response<ProgramOptionResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<ProgramOptionDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<ProgramOptionDto[]>>>;
    add(model: ProgramOptionModel): Promise<AxiosResponse<Response<ProgramOptionDto>>>;
    update(
        id: number,
        model: ProgramOptionModel
    ): Promise<AxiosResponse<Response<ProgramOptionDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<ProgramOptionDto>>>;
}
