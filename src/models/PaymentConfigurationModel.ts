export interface PaymentConfigurationModel {
    id: number;
    paymentGatewayProviderId: number;
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
}