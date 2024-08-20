export interface InvoicePaymentDto {
    id: number;
    invoiceId: number;
    invoiceNumber: string;
    paymentReferenceId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentResponse: string | null;
    amount: number;
    paidBy: string;
    paymentDate: Date;
    paymentDateString: string;
    createdOn: Date;
}


export interface OldInvoicePaymentDto {
    id: number;
    transactionNumber: string;
    transactionDate: Date;
    methodOfPayment: string;
    modeOfPayment: string;
    paidBy: string;
    transactionAmount: string;
    status: string;
    items: OldInvoicePaymentItemsDto[] | null;
}

export interface OldInvoicePaymentItemsDto {
    id: number;
    type: string;
    quantity: string;
    amount: string;
    total: string;
}