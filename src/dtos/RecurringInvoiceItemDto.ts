import { StudentBasicDto } from "./StudentDto";

export interface RecurringInvoiceItemDto {
    id: number;
    studentId: number;
    student: StudentBasicDto;
    feeType: string;
    feeTypeId: number | null;
    discountType: string | null;
    feeName: string;
    quantity: number;
    amount: number;
    createdOn: Date;
    createdOnString: string;
}