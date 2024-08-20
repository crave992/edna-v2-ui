import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { CertificateDto } from "@/dtos/CertificateDto";
import ICertificateService from "./interfaces/ICertificateService";

@injectable()
export default class CertificateService implements ICertificateService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<CertificateDto[]>>> {
        let result = this.httpService
            .call()
            .get<CertificateDto[], AxiosResponse<Response<CertificateDto[]>>>(
                `/Certificate`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<CertificateDto>>> {
        let result = this.httpService
            .call()
            .get<CertificateDto, AxiosResponse<Response<CertificateDto>>>(
                `/Certificate/${id}`
            );

        return result;
    }
}
