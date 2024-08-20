import { TYPES } from "@/config/types";
import ILevelService from "./interfaces/ILevelService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import LevelModel from "@/models/LevelModel";
import LevelDto, { LevelListResponseDto } from "@/dtos/LevelDto";
import { SepLevelListResponseDto } from "@/dtos/SepLevelDto";
import LevelListParams from "@/params/LevelListParams";

@injectable()
export default class LevelService implements ILevelService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: LevelListParams): Promise<AxiosResponse<Response<LevelDto[]>>> {
        let result = this.httpService
            .call()
            .get<LevelDto[], AxiosResponse<Response<LevelDto[]>>>(
                `/Level`,
                {
                    params: q,
                }
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<LevelDto>>> {
        let result = this.httpService
            .call()
            .get<LevelDto, AxiosResponse<Response<LevelDto>>>(`/Level/${id}`);

        return result;
    }

    add(model: LevelModel): Promise<AxiosResponse<Response<LevelDto>>> {
        let result = this.httpService
            .call()
            .post<LevelDto, AxiosResponse<Response<LevelDto>>>(`/Level`, model);

        return result;
    }

    update(
        id: number,
        model: LevelModel
    ): Promise<AxiosResponse<Response<LevelDto>>> {
        let result = this.httpService
            .call()
            .put<LevelDto, AxiosResponse<Response<LevelDto>>>(
                `/Level/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<LevelDto>>> {
        let result = this.httpService
            .call()
            .delete<LevelDto, AxiosResponse<Response<LevelDto>>>(
                `/Level/${id}`
            );

        return result;
    }
}
