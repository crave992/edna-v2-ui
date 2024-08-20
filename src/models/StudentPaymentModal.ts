export interface StudentPaymentModal {
    studentId: number;
    paymentGatewayId: number;
    savedAchCardId: number;
    cvv: string | null;
}