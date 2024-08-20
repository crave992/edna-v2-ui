import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import InvoiceConfigurationDto from "@/dtos/InvoiceConfigurationDto";
import InvoiceConfigurationModel from "@/models/InvoiceConfigurationModel";

export default interface IInvoiceConfigurationService {
    getAll(): Promise<AxiosResponse<Response<InvoiceConfigurationDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>>;
    add(
        model: InvoiceConfigurationModel
    ): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>>;
    update(
        id: number,
        model: InvoiceConfigurationModel
    ): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>>;
    getOrganizationId(): Promise<AxiosResponse<Response<InvoiceConfigurationDto>>>;
}

