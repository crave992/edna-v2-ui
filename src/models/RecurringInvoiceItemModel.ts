export interface RecurringInvoiceItemModel {
    studentId: number;
    feeType: string;
    feeTypeId: number;
    discountType: string | null;
    feeName: string;
    quantity: number;
    amount: number;
}