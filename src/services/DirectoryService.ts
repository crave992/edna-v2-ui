import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import DirectoryListResponseDto from "@/dtos/DirectoryListResponseDto";

import IDirectoryService from "./interfaces/IDirectoryService";
import { DirectoryListParams } from "@/params/DirectoryListParams";

@injectable()
export default class DirectoryService implements IDirectoryService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: DirectoryListParams): Promise<AxiosResponse<Response<DirectoryListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<DirectoryListResponseDto, AxiosResponse<Response<DirectoryListResponseDto>>>(
                `/Directory`,
                {
                    params: p,
                }
            );

        return result;
    }
    
}
