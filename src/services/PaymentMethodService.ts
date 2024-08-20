import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import PaymentMethodModel from "@/models/PaymentMethodModel";
import IPaymentMethodService from "./interfaces/IPaymentMethodService";
import PaymentMethodListParams from "@/params/PaymentMethodListParams";
import PaymentMethodDto, { PaymentMethodListResponseDto } from "@/dtos/PaymentMethodDto";

@injectable()
export default class PaymentMethodService implements IPaymentMethodService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p?: PaymentMethodListParams): Promise<AxiosResponse<Response<PaymentMethodListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<PaymentMethodListResponseDto, AxiosResponse<Response<PaymentMethodListResponseDto>>>(`/PaymentMethod`, {
                params: p
            });

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<PaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .get<PaymentMethodDto, AxiosResponse<Response<PaymentMethodDto>>>(`/PaymentMethod/${id}`);

        return result;
    }
    getAllForDropDown(): Promise<AxiosResponse<Response<PaymentMethodDto[]>>> {
        let result = this.httpService
            .call()
            .get<PaymentMethodDto[], AxiosResponse<Response<PaymentMethodDto[]>>>(`/PaymentMethod/GetAllForDropdown`);

        return result;
    }

    add(model: PaymentMethodModel): Promise<AxiosResponse<Response<PaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .post<PaymentMethodDto, AxiosResponse<Response<PaymentMethodDto>>>(`/PaymentMethod`, model);

        return result;
    }

    update(
        id: number,
        model: PaymentMethodModel
    ): Promise<AxiosResponse<Response<PaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .put<PaymentMethodDto, AxiosResponse<Response<PaymentMethodDto>>>(
                `/PaymentMethod/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<PaymentMethodDto>>> {
        let result = this.httpService
            .call()
            .delete<PaymentMethodDto, AxiosResponse<Response<PaymentMethodDto>>>(
                `/PaymentMethod/${id}`
            );

        return result;
    }
}
