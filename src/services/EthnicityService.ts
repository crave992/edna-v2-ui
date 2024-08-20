import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IEthnicityService from "./interfaces/IEthnicityService";
import { EthnicityCategoryDto, EthnicityDto } from "@/dtos/EthnicityDto";

@injectable()
export default class EthnicityService implements IEthnicityService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getEthnicityCategory(): Promise<AxiosResponse<Response<EthnicityCategoryDto[]>>> {
        let result = this.httpService
            .call()
            .get<EthnicityCategoryDto[], AxiosResponse<Response<EthnicityCategoryDto[]>>>(
                `/Ethnicity/GetEthnicityCategory`
            );

        return result;
    }

    getEthnicityByCategoryId(categoryId: number): Promise<AxiosResponse<Response<EthnicityDto[]>>> {
        let result = this.httpService
            .call()
            .get<EthnicityDto[], AxiosResponse<Response<EthnicityDto[]>>>(
                `/Ethnicity/GetByCategoryId/${categoryId}`
            );

        return result;
    }
}
