import { PaymentGatewayProviderDto } from "./PaymentGatewayProviderDto";

export interface PaymentConfigurationDto {
    id: number;
    paymentGatewayProviderId: number;
    paymentGatewayProvider: PaymentGatewayProviderDto;
    displayName: string;
    merchantId: string | null;
    apiKey: string | null;
    apiSecret: string | null;
    username: string | null;
    password: string | null;
    mode: string;
    sandboxMerchantId: string | null;
    sandboxApiKey: string | null;
    sandboxApiSecret: string | null;
    sandboxUsername: string | null;
    sandboxPassword: string | null;
    createdOn: Date;
    updatedOn: Date | null;
}

export interface PaymentConfigurationBasicDto {
    id: number;
    paymentGatewayProviderName: string;
    displayName: string;
    mode: string;
    createdOn: Date;
}