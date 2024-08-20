import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IBankAccountTypeService from "./interfaces/IBankAccountTypeService";
import { BankAccountTypeDto } from "@/dtos/BankAccountTypeDto";

@injectable()
export default class BankAccountTypeService implements IBankAccountTypeService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<BankAccountTypeDto[]>>> {
        let result = this.httpService
            .call()
            .get<BankAccountTypeDto[], AxiosResponse<Response<BankAccountTypeDto[]>>>(
                `/BankAccountType`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<BankAccountTypeDto>>> {
        let result = this.httpService
            .call()
            .get<BankAccountTypeDto, AxiosResponse<Response<BankAccountTypeDto>>>(
                `/BankAccountType/${id}`
            );

        return result;
    }
}
