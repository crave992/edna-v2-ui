import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { InvoiceBasicDto, InvoiceDto, InvoiceItemDto } from "@/dtos/InvoiceDto";
import { InvoiceModal } from "@/models/InvoiceModal";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import InvoiceListParams from "@/params/InvoiceListParams";
import { DirectPaymentModal, InvoicePaymentModal } from "@/models/InvoicePaymentModal";
import PaymentListParams from "@/params/PaymentListParams";
import { InvoicePaymentDto, OldInvoicePaymentDto, OldInvoicePaymentItemsDto } from "@/dtos/InvoicePaymentDto";
import InvoiceItemModal from "@/models/InvoiceItemModal";
import { StudentInvoiceDto } from "@/dtos/StudentInvoiceDto";
import { StudentPaymentModal } from "@/models/StudentPaymentModal";
import PlainDto from "@/dtos/PlainDto";

export default interface IInvoiceService {
  getAll(p: InvoiceListParams): Promise<AxiosResponse<Response<ListResponseDto<InvoiceBasicDto>>>>;
  getPayments(p: PaymentListParams): Promise<AxiosResponse<Response<ListResponseDto<InvoicePaymentDto>>>>;
  generate(model: InvoiceModal): Promise<AxiosResponse<Response<InvoiceDto>>>;  
  details(id: number): Promise<AxiosResponse<Response<InvoiceDto>>>;  
  resend(id: number): Promise<AxiosResponse<Response<PlainDto>>>;  
  makePayment(model: InvoicePaymentModal): Promise<AxiosResponse<Response<InvoiceDto>>>;

  makeAdmissionPayment(model: StudentPaymentModal): Promise<AxiosResponse<Response<StudentInvoiceDto>>>;
  getStudentPaymentDetailsByStudentId(studentId: number): Promise<AxiosResponse<Response<StudentInvoiceDto>>>;
  getStudentAdmissionPaymentDetails(p: InvoiceListParams): Promise<AxiosResponse<Response<ListResponseDto<StudentInvoiceDto>>>>;

  getInvoiceItemById(invoiceId: number, itemId: number): Promise<AxiosResponse<Response<InvoiceItemDto>>>;
  saveInvoiceItem(itemId: number, model: InvoiceItemModal): Promise<AxiosResponse<Response<InvoiceItemDto>>>;
  deleteInvoiceItemById(invoiceId: number, itemId: number): Promise<AxiosResponse<Response<InvoiceItemDto>>>;

  getOldPayments(p: PaymentListParams): Promise<AxiosResponse<Response<ListResponseDto<OldInvoicePaymentDto>>>>;
  getOldPaymentDetailsByReferenceNumber(referenceNumber?: string): Promise<AxiosResponse<Response<OldInvoicePaymentDto>>>;

  delete(id: number): Promise<AxiosResponse<Response<InvoiceDto>>>;

  directPayment(model: DirectPaymentModal): Promise<AxiosResponse<Response<InvoiceDto>>>;
}