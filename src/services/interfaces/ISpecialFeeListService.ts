import Response from "@/dtos/Response";
import SpecialFeeListDto, { SpecialFeeListResponseDto } from "@/dtos/SpecialFeeListDto";
import SpecialFeeListModel from "@/models/SpecialFeeListModel";
import SpecialFeeListPageParams from "@/params/SpecialFeeListPageParams";
import { AxiosResponse } from "axios";

export default interface ISpecialFeeListService {
    getAll(q?: SpecialFeeListPageParams): Promise<AxiosResponse<Response<SpecialFeeListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<SpecialFeeListDto>>>;    
    add(model: SpecialFeeListModel): Promise<AxiosResponse<Response<SpecialFeeListDto>>>;
    update(id: number, model: SpecialFeeListModel): Promise<AxiosResponse<Response<SpecialFeeListDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<SpecialFeeListDto>>>;
}
