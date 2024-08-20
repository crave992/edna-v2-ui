export interface SavedCardModel {
    id: number;
    paymentMethodId: number;
    cardHolderName: string;
    aliasCardName: string;
    cardNumber: string;
    expMonth: string;
    expYear: string;
    billingAddress: string | null;
    billingZipcode: string | null;
    isPrimaryCard: boolean;
    acceptTerms: boolean;
}

export interface SavedAchModel {
    id: number;
    paymentMethodId: number;
    achHolderName: string;
    aliasAchName: string;
    routingNumber: string;
    accountNumber: string;
    billingAddress: string | null;
    billingZipcode: string | null;
    isPrimaryCard: boolean;
    acceptTerms: boolean;
}