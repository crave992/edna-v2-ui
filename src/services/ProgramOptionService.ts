import { TYPES } from "@/config/types";
import IAreaService from "./interfaces/IAreaService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ProgramOptionDto, { ProgramOptionResponseDto } from "@/dtos/ProgramOptionDto";
import ProgramOptionParams from "@/params/ProgramOptionParams";
import ProgramOptionModel from "@/models/ProgramOptionModel";
import IProgramOptionService from "./interfaces/IProgramOptionService";

@injectable()
export default class ProgramOptionService implements IProgramOptionService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: ProgramOptionParams): Promise<AxiosResponse<Response<ProgramOptionResponseDto>>> {
        let result = this.httpService
            .call()
            .get<ProgramOptionResponseDto, AxiosResponse<Response<ProgramOptionResponseDto>>>(
                `/ProgramOption`,
                {
                    params: p,
                }
            );

        return result;
    }
   

    getById(id: number): Promise<AxiosResponse<Response<ProgramOptionDto>>> {
        let result = this.httpService
            .call()
            .get<ProgramOptionDto, AxiosResponse<Response<ProgramOptionDto>>>(`/ProgramOption/${id}`);

        return result;
    }



    getByLevelId(
        levelId: number
    ): Promise<AxiosResponse<Response<ProgramOptionDto[]>, any>> {
        let result = this.httpService
            .call()
            .get<ProgramOptionDto[], AxiosResponse<Response<ProgramOptionDto[]>>>(
                `/ProgramOption/GetByLevelId/${levelId}`
            );

        return result;
    }

    add(model: ProgramOptionModel): Promise<AxiosResponse<Response<ProgramOptionDto>>> {
        let result = this.httpService
            .call()
            .post<ProgramOptionDto, AxiosResponse<Response<ProgramOptionDto>>>(`/ProgramOption`, model);

        return result;
    }

    update(
        id: number,
        model: ProgramOptionModel
    ): Promise<AxiosResponse<Response<ProgramOptionDto>>> {
        let result = this.httpService
            .call()
            .put<ProgramOptionDto, AxiosResponse<Response<ProgramOptionDto>>>(`/ProgramOption/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<ProgramOptionDto>>> {
        let result = this.httpService
            .call()
            .delete<ProgramOptionDto, AxiosResponse<Response<ProgramOptionDto>>>(`/ProgramOption/${id}`);

        return result;
    }
}
