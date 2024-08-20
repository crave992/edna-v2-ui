import PaymentMethodDto, { PaymentMethodListResponseDto } from "@/dtos/PaymentMethodDto";
import Response from "@/dtos/Response";
import PaymentMethodModel from "@/models/PaymentMethodModel";
import PaymentMethodListParams from "@/params/PaymentMethodListParams";
import { AxiosResponse } from "axios";

export default interface IPaymentMethodService {
    getAll(q?: PaymentMethodListParams): Promise<AxiosResponse<Response<PaymentMethodListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<PaymentMethodDto>>>;
    getAllForDropDown(): Promise<AxiosResponse<Response<PaymentMethodDto[]>>>;
    add(model: PaymentMethodModel): Promise<AxiosResponse<Response<PaymentMethodDto>>>;
    update(id: number, model: PaymentMethodModel): Promise<AxiosResponse<Response<PaymentMethodDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<PaymentMethodDto>>>;
}
