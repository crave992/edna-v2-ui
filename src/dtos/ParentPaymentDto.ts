export interface ParentPaymentDto {
    id: number;
    parentName: string;
    applicationFee: number | null;
    registrationFee: number | null;
    taxPercentage: number | null;
    taxAmount: number | null;
    creditCardProcessingFeePercentage: number | null;
    creditCardProcessingFee: number | null;
    totalAmount: number | null;
    isPaid: boolean | null;
    paidDate: string | null;
}