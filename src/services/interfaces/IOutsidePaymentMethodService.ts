import OutsidePaymentMethodDto, { OutSidePaymentMethodListResponseDto } from "@/dtos/OutsidePaymentMethodListResponseDto";
import Response from "@/dtos/Response";
import OutsidePaymentMethodModel from "@/models/OutsidePaymentMethodModel";
import OutsidePaymentMethodListParams from "@/params/OutsidePaymentMethodListParams";
import { AxiosResponse } from "axios";

export default interface IOutsidePaymentMethodService {
    getAll(q?: OutsidePaymentMethodListParams): Promise<AxiosResponse<Response<OutSidePaymentMethodListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>>;
    getAllForDropDown(): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>>;
    add(model: OutsidePaymentMethodModel): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>>;
    update(id: number, model: OutsidePaymentMethodModel): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>>;
}
