import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IPaymentConfigurationService from "./interfaces/IPaymentConfigurationService";
import { PaymentConfigurationBasicDto, PaymentConfigurationDto } from "@/dtos/PaymentConfigurationDto";
import { PaymentGatewayProviderDto } from "@/dtos/PaymentGatewayProviderDto";
import { PaymentConfigurationModel } from "@/models/PaymentConfigurationModel";

@injectable()
export default class PaymentConfigurationService implements IPaymentConfigurationService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(q: string): Promise<AxiosResponse<Response<PaymentConfigurationBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<PaymentConfigurationBasicDto[], AxiosResponse<Response<PaymentConfigurationBasicDto[]>>>(
        `/PaymentConfiguration?q=${q}`);    

    return result;
  }
  getAllPaymentGatewayProviders(): Promise<AxiosResponse<Response<PaymentGatewayProviderDto[]>>> {
    let result = this.httpService
      .call()
      .get<PaymentGatewayProviderDto, AxiosResponse<Response<PaymentGatewayProviderDto[]>>>(
        `/PaymentConfiguration/PaymentGatewayProviders`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<PaymentConfigurationDto>>> {
    let result = this.httpService
      .call()
      .get<PaymentConfigurationDto, AxiosResponse<Response<PaymentConfigurationDto>>>(`/PaymentConfiguration/${id}`);

    return result;
  }

  add(model: PaymentConfigurationModel): Promise<AxiosResponse<Response<PaymentConfigurationDto>>> {
    let result = this.httpService
      .call()
      .post<PaymentConfigurationDto, AxiosResponse<Response<PaymentConfigurationDto>>>(`/PaymentConfiguration`, model);

    return result;
  }

  update(
    id: number,
    model: PaymentConfigurationModel
  ): Promise<AxiosResponse<Response<PaymentConfigurationDto>>> {
    let result = this.httpService
      .call()
      .put<PaymentConfigurationDto, AxiosResponse<Response<PaymentConfigurationDto>>>(`/PaymentConfiguration/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<PaymentConfigurationDto>>> {
    let result = this.httpService
      .call()
      .delete<PaymentConfigurationDto, AxiosResponse<Response<PaymentConfigurationDto>>>(`/PaymentConfiguration/${id}`);

    return result;
  }
}
