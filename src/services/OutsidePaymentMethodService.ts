import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import OutsidePaymentMethodListParams from "@/params/OutsidePaymentMethodListParams";
import OutsidePaymentMethodDto, { OutSidePaymentMethodListResponseDto } from "@/dtos/OutsidePaymentMethodListResponseDto";
import OutsidePaymentMethodModel from "@/models/OutsidePaymentMethodModel";
import IOutsidePaymentMethodService from "./interfaces/IOutsidePaymentMethodService";

@injectable()
export default class OutsidePaymentMethodService implements IOutsidePaymentMethodService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p?: OutsidePaymentMethodListParams): Promise<AxiosResponse<Response<OutSidePaymentMethodListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<OutSidePaymentMethodListResponseDto, AxiosResponse<Response<OutSidePaymentMethodListResponseDto>>>(`/OutSidePaymentMethod`, {
                params: p
            });

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .get<OutsidePaymentMethodDto, AxiosResponse<Response<OutsidePaymentMethodDto>>>(`/OutSidePaymentMethod/${id}`);

        return result;
    }
    getAllForDropDown(): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .get<OutsidePaymentMethodDto, AxiosResponse<Response<OutsidePaymentMethodDto>>>(`/OutSidePaymentMethod/GetAllForDropdown`);

        return result;
    }

    add(model: OutsidePaymentMethodModel): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .post<OutsidePaymentMethodDto, AxiosResponse<Response<OutsidePaymentMethodDto>>>(`/OutSidePaymentMethod`, model);

        return result;
    }

    update(
        id: number,
        model: OutsidePaymentMethodModel
    ): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .put<OutsidePaymentMethodDto, AxiosResponse<Response<OutsidePaymentMethodDto>>>(
                `/OutSidePaymentMethod/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<OutsidePaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .delete<OutsidePaymentMethodDto, AxiosResponse<Response<OutsidePaymentMethodDto>>>(
                `/OutSidePaymentMethod/${id}`
            );

        return result;
    }
}
