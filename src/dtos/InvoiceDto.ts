import { InvoicePaymentDto } from "./InvoicePaymentDto";
import { ParentBasicDto } from "./ParentDto";
import { StudentBasicDto, StudentDto } from "./StudentDto";

export interface InvoiceDto {
    id: number;
    invoiceId: number;
    parent: ParentBasicDto;
    invoiceNumber: string;
    tax: number;
    cardProcessingFee: number;
    discount: number;
    invoiceTotal: number;
    paidAmount: number;
    balanceAmount: number;
    invoiceDate: Date;
    invoiceDateString: string;
    createdOn: Date;
    createdOnString: string;
    resendDate: Date;
    resendDateString: string;
    updatedOn: Date | null;
    invoiceItems: InvoiceItemDto[];
    payment: InvoicePaymentDto[] | null;
    isBalanceForwarded: boolean;
    forwardToInvoiceId: number | null;
    forwardToInvoice: InvoiceMostBasicDto | null;
    forwardInvoices: InvoiceMostBasicDto[] | null;
}

export interface InvoiceBasicDto {
    id: number;
    invoiceId: number;
    invoiceNumber: string;
    paymentReferenceId: string[];
    tax: number;
    cardProcessingFee: number;
    discount: number;
    invoiceTotal: number;
    paidAmount: number;
    balanceAmount: number;
    invoiceDate: Date;
    invoiceDateString: string;
    createdOn: Date;
    createdOnString: string;
    resendDate: Date;
    resendDateString: string;
    parentId: number;
    parentName: string;
    profilePicture: string;
    secondParent: ParentBasicDto[] | null;
    students: StudentBasicDto[] | null;
    isBalanceForwarded: boolean;
    forwardToInvoiceId: number | null;
    forwardToInvoice: InvoiceMostBasicDto | null;
    forwardInvoices: InvoiceMostBasicDto[] | null;
}

export interface InvoiceItemDto {
    id: number;
    studentId: number | null;
    student: StudentDto;
    feeType: string; //Tuition Fee|Additional Fee|Individual Fee|Discount
    feeTypeId: number | null;
    discountType: string; //Percentage|Flat
    feeName: string;
    quantity: number;
    amount: number;
    displaySequence: number;
    createdOn: Date;
    itemAddedOn: Date | null;
    itemAddedOnString: string;
    occurrence: string;
}

export interface InvoiceMostBasicDto {
    id: number;
    invoiceId: number;
    invoiceNumber: string;
}