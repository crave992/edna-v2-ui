import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import RecurringInvoiceItemParams from "@/params/RecurringInvoiceItemParams";
import { RecurringInvoiceItemDto } from "@/dtos/RecurringInvoiceItemDto";
import { RecurringInvoiceItemModel } from "@/models/RecurringInvoiceItemModel";

export default interface IRecurringInvoiceItemService {
    getAll(p: RecurringInvoiceItemParams): Promise<AxiosResponse<Response<ListResponseDto<RecurringInvoiceItemDto>>>>;
    getById(id: number): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>>;
    add(model: RecurringInvoiceItemModel): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>>;
    update(id: number, model: RecurringInvoiceItemModel): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<RecurringInvoiceItemDto>>>;
}