import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import AdditionalFeeDto, { AdditionalFeeResponseDto } from "@/dtos/AdditionalFeeDto";
import AdditionalFeeParams from "@/params/AdditionalFeeParams";
import AdditionalFeesModel from "@/models/AdditionalFeesModel";

export default interface IAdditionalFeesService {
    getAll(
        p: AdditionalFeeParams
    ): Promise<AxiosResponse<Response<AdditionalFeeResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<AdditionalFeeDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<AdditionalFeeDto[]>>>;
    add(model: AdditionalFeesModel): Promise<AxiosResponse<Response<AdditionalFeeDto>>>;
    update(
        id: number,
        model: AdditionalFeesModel
    ): Promise<AxiosResponse<Response<AdditionalFeeDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<AdditionalFeeDto>>>;
}
