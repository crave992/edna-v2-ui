import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import SepTopicDto, { SepTopicListResponseDto } from "@/dtos/SepTopicDto";
import SepTopicModel from "@/models/SepTopicModel";
import SepTopicListParams from "@/params/SepTopicListParams";
import { AxiosResponse } from "axios";

export default interface ISepTopicService {
    getAll(p?: SepTopicListParams): Promise<AxiosResponse<Response<SepTopicListResponseDto>>>;
    getAllAsync(p?: SepTopicListParams): Promise<AxiosResponse<Response<SepTopicDto[]>>>;
    getAllForDropDown(): Promise<AxiosResponse<Response<SepTopicListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<SepTopicDto>>>;
    getByName(name: string): Promise<AxiosResponse<Response<SepTopicDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<SepTopicDto[]>>>;
    getBySepAreaId(sepAreaId: number): Promise<AxiosResponse<Response<SepTopicDto[]>>>;
    add(model: SepTopicModel): Promise<AxiosResponse<Response<SepTopicDto>>>;
    postMultipleSepTopic(model: SepTopicModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
    update(id: number, model: SepTopicModel): Promise<AxiosResponse<Response<SepTopicDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<SepTopicDto>>>;
}
