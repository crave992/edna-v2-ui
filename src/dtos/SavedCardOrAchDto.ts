import PaymentMethodDto from "./PaymentMethodDto";

export interface SavedCardOrAchDto {
    id: number;
    paymentMethodId: number;
    paymentMethod: PaymentMethodDto;
    cardOrAchHolderName: string;
    aliasCardOrAchName: string;
    cardNumber: string | null;
    expMonth: string | null;
    expYear: string | null;
    routingNumber: string | null;
    accountNumber: string | null;
    billingAddress: string | null;
    billingZipcode: string | null;
    isPrimaryCard: boolean;
    acceptTerms: boolean;
    createdOn: Date;
    updatedOn: Date | null;
}