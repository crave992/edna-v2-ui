import { TYPES } from "@/config/types";
import ITopicService from "./interfaces/ITopicService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import TopicListParams from "@/params/TopicListParams";
import TopicDto, { TopicListResponseDto } from "@/dtos/TopicDto";
import TopicModel from "@/models/TopicModel";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class TopicService implements ITopicService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: TopicListParams): Promise<AxiosResponse<Response<TopicListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<TopicListResponseDto, AxiosResponse<Response<TopicListResponseDto>>>(`/Topic`, {
                params: p
            });

        return result;
    }

    getAllTopics(p: TopicListResponseDto): Promise<AxiosResponse<Response<TopicListResponseDto>>> {

        let result = this.httpService
            .call()
            .get<TopicListResponseDto, AxiosResponse<Response<TopicListResponseDto>>>(`/Topic/GetWithoutLogin`, {
                params: p
            });

        return result;
    }

    getTopicByLevelAndArea(levelId: number, areaId: number): Promise<AxiosResponse<Response<TopicDto[]>>> {

        let result = this.httpService
            .call()
            .get<TopicDto[], AxiosResponse<Response<TopicDto[]>>>(`/Topic/GetTopicByLevelAndArea/${levelId}/${areaId}`);

        return result;
    }

    getAllForDropDown(): Promise<AxiosResponse<Response<TopicListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<TopicListResponseDto, AxiosResponse<Response<TopicListResponseDto>>>(
                `/Topic/GetTopicDropdown`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<TopicDto>>> {
        let result = this.httpService
            .call()
            .get<TopicDto, AxiosResponse<Response<TopicDto>>>(`/Topic/${id}`);

        return result;
    }


    getByName(name: string): Promise<AxiosResponse<Response<TopicDto>, any>> {
        let result = this.httpService
            .call()
            .get<TopicDto, AxiosResponse<Response<TopicDto>>>(`/Topic/GetByName/${name}`);

        return result;
    }


    getByLevelId(levelId: number): Promise<AxiosResponse<Response<TopicDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<TopicDto[], AxiosResponse<Response<TopicDto[]>>>(`/Topic/GetByLevelId/${levelId}`);

        return result;
    }

    getByAreaId(areaId: number): Promise<AxiosResponse<Response<TopicDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<TopicDto[], AxiosResponse<Response<TopicDto[]>>>(`/Topic/GetByAreaId/${areaId}`);

        return result;
    }

    add(model: TopicModel): Promise<AxiosResponse<Response<TopicDto>>> {
        let result = this.httpService
            .call()
            .post<TopicDto, AxiosResponse<Response<TopicDto>>>(`/Topic`, model);

        return result;
    }

    postMultipleTopic(model: TopicModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/Topic/PostMultipleTopic`, model);

        return result;
    }

    update(id: number, model: TopicModel): Promise<AxiosResponse<Response<TopicDto>>> {
        let result = this.httpService
            .call()
            .put<TopicDto, AxiosResponse<Response<TopicDto>>>(`/Topic/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<TopicDto>>> {
        let result = this.httpService
            .call()
            .delete<TopicDto, AxiosResponse<Response<TopicDto>>>(`/Topic/${id}`);

        return result;
    }
}
