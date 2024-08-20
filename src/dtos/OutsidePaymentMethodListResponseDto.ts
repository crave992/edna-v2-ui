
export default interface OutsidePaymentMethodDto {
    id: number;
    name: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface OutSidePaymentMethodListResponseDto {
    totalRecord: number;
    outSidePaymentMethods: OutsidePaymentMethodDto[];
}
