
export default interface PaymentMethodDto {
    id: number;
    name: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface PaymentMethodListResponseDto {
    totalRecord: number;
    paymentMethods: PaymentMethodDto[];
}
