export interface InvoicePaymentModal {
    invoiceId: number;
    paymentGatewayId: number;
    savedAchCardId: number;
    cvv: string | null;
}

export interface DirectPaymentModal {
    invoiceId: number;
    amount: string;
    paymentDate: Date;
    comment: string | null;
}