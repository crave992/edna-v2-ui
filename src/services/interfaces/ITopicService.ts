import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import TopicDto, { TopicListResponseDto } from "@/dtos/TopicDto";
import TopicModel from "@/models/TopicModel";
import TopicListParams from "@/params/TopicListParams";
import { AxiosResponse } from "axios";

export default interface ITopicService {
    getAll(p?: TopicListParams): Promise<AxiosResponse<Response<TopicListResponseDto>>>;
    getTopicByLevelAndArea(levelId: number, areaId: number): Promise<AxiosResponse<Response<TopicDto[]>>>;
    getAllForDropDown(): Promise<AxiosResponse<Response<TopicListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<TopicDto>>>;
    getByName(name: string): Promise<AxiosResponse<Response<TopicDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<TopicDto[]>>>;
    getByAreaId(areaId: number): Promise<AxiosResponse<Response<TopicDto[]>>>;
    add(model: TopicModel): Promise<AxiosResponse<Response<TopicDto>>>;
    postMultipleTopic(model: TopicModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
    update(id: number, model: TopicModel): Promise<AxiosResponse<Response<TopicDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<TopicDto>>>;
}