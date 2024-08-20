import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import SepLevelListParams from "@/params/SepLevelListParams";
import ISepTopicService from "./interfaces/ISepTopicService";
import SepTopicDto, { SepTopicListResponseDto } from "@/dtos/SepTopicDto";
import SepTopicModel from "@/models/SepTopicModel";
import SepTopicListParams from "@/params/SepTopicListParams";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class SepTopicService implements ISepTopicService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: SepTopicListParams): Promise<AxiosResponse<Response<SepTopicListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<SepTopicListResponseDto, AxiosResponse<Response<SepTopicListResponseDto>>>(`/SepTopic`, {
                params: p
            });

        return result;
    }
    getAllAsync(p: SepTopicListParams): Promise<AxiosResponse<Response<SepTopicDto[]>>> {
        let result = this.httpService
            .call()
            .get<SepTopicListResponseDto, AxiosResponse<Response<SepTopicDto[]>>>(`/SepTopic/GetAllAsync`, {
                params: p
            });

        return result;
    }

    getAllLevels(p: SepTopicListResponseDto): Promise<AxiosResponse<Response<SepTopicListResponseDto>>> {

        let result = this.httpService
            .call()
            .get<SepTopicListResponseDto, AxiosResponse<Response<SepTopicListResponseDto>>>(`/SepTopic/GetWithoutLogin`, {
                params: p
            });

        return result;
    }

    getAllForDropDown(): Promise<AxiosResponse<Response<SepTopicListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<SepTopicListResponseDto, AxiosResponse<Response<SepTopicListResponseDto>>>(
                `/SepTopic/GetTopicDropdown`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<SepTopicDto>>> {
        let result = this.httpService
            .call()
            .get<SepTopicDto, AxiosResponse<Response<SepTopicDto>>>(`/SepTopic/${id}`);

        return result;
    }

    getByName(name: string): Promise<AxiosResponse<Response<SepTopicDto>, any>> {
        let result = this.httpService
            .call()
            .get<SepTopicDto, AxiosResponse<Response<SepTopicDto>>>(`/SepTopic/GetByName/${name}`);

        return result;
    }

    getByLevelId(levelId: number): Promise<AxiosResponse<Response<SepTopicDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<SepTopicDto[], AxiosResponse<Response<SepTopicDto[]>>>(`/SepTopic/GetByLevelId/${levelId}`);

        return result;
    }
    getBySepAreaId(sepAreaId: number): Promise<AxiosResponse<Response<SepTopicDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<SepTopicDto[], AxiosResponse<Response<SepTopicDto[]>>>(`/SepTopic/GetBySepAreaId/${sepAreaId}`);

        return result;
    }

    add(model: SepTopicModel): Promise<AxiosResponse<Response<SepTopicDto>>> {
        let result = this.httpService
            .call()
            .post<SepTopicDto, AxiosResponse<Response<SepTopicDto>>>(`/SepTopic`, model);

        return result;
    }

    postMultipleSepTopic(model: SepTopicModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/SepTopic/PostMultipleSepTopic`, model);

        return result;
    }

    update(id: number, model: SepTopicModel): Promise<AxiosResponse<Response<SepTopicDto>>> {
        let result = this.httpService
            .call()
            .put<SepTopicDto, AxiosResponse<Response<SepTopicDto>>>(`/SepTopic/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<SepTopicDto>>> {
        let result = this.httpService
            .call()
            .delete<SepTopicDto, AxiosResponse<Response<SepTopicDto>>>(`/SepTopic/${id}`);

        return result;
    }
}
