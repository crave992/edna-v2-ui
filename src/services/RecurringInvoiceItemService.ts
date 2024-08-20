import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import IRecurringInvoiceItemService from "./interfaces/IRecurringInvoiceItemService";
import RecurringInvoiceItemParams from "@/params/RecurringInvoiceItemParams";
import { RecurringInvoiceItemDto } from "@/dtos/RecurringInvoiceItemDto";
import { RecurringInvoiceItemModel } from "@/models/RecurringInvoiceItemModel";

@injectable()
export default class RecurringInvoiceItemService implements IRecurringInvoiceItemService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: RecurringInvoiceItemParams): Promise<AxiosResponse<Response<ListResponseDto<RecurringInvoiceItemDto>>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<RecurringInvoiceItemDto>, AxiosResponse<Response<ListResponseDto<RecurringInvoiceItemDto>>>>(
                `/RecurringInvoiceItem`, {
                params: p,
            });
        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>> {
        let result = this.httpService
            .call()
            .get<RecurringInvoiceItemDto, AxiosResponse<Response<RecurringInvoiceItemDto>>>(`/RecurringInvoiceItem/${id}`);

        return result;
    }

    add(model: RecurringInvoiceItemModel): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>> {
        let result = this.httpService
            .call()
            .post<RecurringInvoiceItemDto, AxiosResponse<Response<RecurringInvoiceItemDto>>>(`/RecurringInvoiceItem`, model);

        return result;
    }

    update(id: number, model: RecurringInvoiceItemModel): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>> {
        let result = this.httpService
            .call()
            .put<RecurringInvoiceItemDto, AxiosResponse<Response<RecurringInvoiceItemDto>>>(
                `/RecurringInvoiceItem/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>> {
        let result = this.httpService
            .call()
            .delete<RecurringInvoiceItemDto, AxiosResponse<Response<RecurringInvoiceItemDto>>>(
                `/RecurringInvoiceItem/${id}`
            );

        return result;
    }

}
