import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { PaymentConfigurationBasicDto, PaymentConfigurationDto } from "@/dtos/PaymentConfigurationDto";
import { PaymentGatewayProviderDto } from "@/dtos/PaymentGatewayProviderDto";
import { PaymentConfigurationModel } from "@/models/PaymentConfigurationModel";

export default interface IPaymentConfigurationService {
  getAll(q: string): Promise<AxiosResponse<Response<PaymentConfigurationBasicDto[]>>>;
  getAllPaymentGatewayProviders(): Promise<AxiosResponse<Response<PaymentGatewayProviderDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<PaymentConfigurationDto>>>;
  add(model: PaymentConfigurationModel): Promise<AxiosResponse<Response<PaymentConfigurationDto>>>;
  update(
    id: number,
    model: PaymentConfigurationModel
  ): Promise<AxiosResponse<Response<PaymentConfigurationDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<PaymentConfigurationDto>>>;
}
