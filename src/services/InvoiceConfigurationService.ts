import { container } from "@/config/ioc";
import IHttpService from "./interfaces/IHttpService";
import { TYPES } from "@/config/types";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import InvoiceConfigurationDto from "@/dtos/InvoiceConfigurationDto";
import IInvoiceConfigurationService from "./interfaces/IInvoiceConfigurationService";
import InvoiceConfigurationModel from "@/models/InvoiceConfigurationModel";

@injectable()
export default class InvoiceConfigurationService
    implements IInvoiceConfigurationService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(): Promise<AxiosResponse<Response<InvoiceConfigurationDto[]>>> {
        let result = this.httpService
            .call()
            .get<
                InvoiceConfigurationDto[],
                AxiosResponse<Response<InvoiceConfigurationDto[]>>
            >(`/InvoiceConfiguration`);

        return result;
    }

    getById(
        id: number
    ): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>> {
        let result = this.httpService
            .call()
            .get<
                InvoiceConfigurationDto,
                AxiosResponse<Response<InvoiceConfigurationDto>>
            >(`/InvoiceConfiguration/${id}`);

        return result;
    }

    add(
        model: InvoiceConfigurationModel
    ): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>> {
        let result = this.httpService
            .call()
            .post<
                InvoiceConfigurationDto,
                AxiosResponse<Response<InvoiceConfigurationDto>>
            >(`/InvoiceConfiguration`, model);

        return result;
    }

    update(
        id: number,
        model: InvoiceConfigurationModel
    ): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>> {
        let result = this.httpService
            .call()
            .put<
                InvoiceConfigurationDto,
                AxiosResponse<Response<InvoiceConfigurationDto>>
            >(`/InvoiceConfiguration/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>> {
        let result = this.httpService
            .call()
            .delete<
                InvoiceConfigurationDto,
                AxiosResponse<Response<InvoiceConfigurationDto>>
            >(`/InvoiceConfiguration/${id}`);

        return result;
    }

    getOrganizationId(): Promise<
        AxiosResponse<Response<InvoiceConfigurationDto>>
    > {
        let result = this.httpService
            .call()
            .get<
                InvoiceConfigurationDto,
                AxiosResponse<Response<InvoiceConfigurationDto>>
            >(`/InvoiceConfiguration/GetOrganizationId`);

        return result;
    }

}
