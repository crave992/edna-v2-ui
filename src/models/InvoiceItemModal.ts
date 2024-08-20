export default interface InvoiceItemModal {
    invoiceId: number;
    studentId: number;
    feeType: string;
    feeTypeId: number;
    discountType: string | null;
    feeName: string;
    quantity: number;
    amount: number;
    itemAddedOn: Date;
    occurrence: string;
}