import { OrganizationDto } from "./OrganizationDto";
import { ParentBasicDto, ParentDto } from "./ParentDto";
import { StudentBasicDto, StudentDto } from "./StudentDto";


export interface StudentInvoiceDto {
    id: number;
    studentInvoiceId: number;
    organizationId: number;
    organization: OrganizationDto;
    parentId: number;
    parent: ParentDto;
    studentId: number;
    student: StudentDto;
    invoiceNumber: string;
    tax: number;
    cardProcessingFee: number;
    discount: number;
    invoiceTotal: number;
    paidAmount: number;
    balanceAmount: number;
    invoiceDate: Date;
    createdOn: Date;
    createdOnString: string;
    updatedOn: string | null;
    paymentReferenceId: string;
    paymentStatus: string;
    paymentMethod: string;
    paymentResponse: string | null;
    parentName: string;
    secondParent: ParentBasicDto[] | null;
    applicationFee: number;
    registrationFee: number;
    taxPercentage: number;
    taxAmount: number;
    totalAmount: number;
}