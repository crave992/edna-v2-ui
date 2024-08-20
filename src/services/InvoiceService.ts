import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IInvoiceService from "./interfaces/IInvoiceService";
import { InvoiceModal } from "@/models/InvoiceModal";
import { InvoiceBasicDto, InvoiceDto, InvoiceItemDto } from "@/dtos/InvoiceDto";
import { ListResponseDto } from "@/dtos/ListResponseDto";
import InvoiceListParams from "@/params/InvoiceListParams";
import { DirectPaymentModal, InvoicePaymentModal } from "@/models/InvoicePaymentModal";
import PaymentListParams from "@/params/PaymentListParams";
import { InvoicePaymentDto, OldInvoicePaymentDto, OldInvoicePaymentItemsDto } from "@/dtos/InvoicePaymentDto";
import InvoiceItemModal from "@/models/InvoiceItemModal";
import { StudentPaymentModal } from "@/models/StudentPaymentModal";
import { StudentInvoiceDto } from "@/dtos/StudentInvoiceDto";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class InvoiceService implements IInvoiceService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: InvoiceListParams): Promise<AxiosResponse<Response<ListResponseDto<InvoiceBasicDto>>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<InvoiceBasicDto>, AxiosResponse<Response<ListResponseDto<InvoiceBasicDto>>>>(
                `/Invoice`, {
                params: p,
            });
        return result;
    }

    getPayments(p: PaymentListParams): Promise<AxiosResponse<Response<ListResponseDto<InvoicePaymentDto>>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<InvoicePaymentDto>, AxiosResponse<Response<ListResponseDto<InvoicePaymentDto>>>>(
                `/Invoice/GetPayments`, {
                params: p,
            });
        return result;
    }

    getOldPayments(p: PaymentListParams): Promise<AxiosResponse<Response<ListResponseDto<OldInvoicePaymentDto>>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<OldInvoicePaymentDto>, AxiosResponse<Response<ListResponseDto<OldInvoicePaymentDto>>>>(
                `/Invoice/GetOldPayments`, {
                params: p,
            });
        return result;
    }
    getOldPaymentDetailsByReferenceNumber(referenceNumber?: string): Promise<AxiosResponse<Response<OldInvoicePaymentDto>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<OldInvoicePaymentDto>, AxiosResponse<Response<OldInvoicePaymentDto>>>(
                `/Invoice/GetOldPaymentDetailsByReferenceNumber?referenceNumber=${referenceNumber}`);
        return result;
    }

    generate(model: InvoiceModal): Promise<AxiosResponse<Response<InvoiceDto>>> {
        let result = this.httpService
            .call()
            .post<InvoiceDto, AxiosResponse<Response<InvoiceDto>>>(`/Invoice/Generate`, model);

        return result;
    }

    details(id: number): Promise<AxiosResponse<Response<InvoiceDto>>> {
        let result = this.httpService
            .call()
            .get<InvoiceDto, AxiosResponse<Response<InvoiceDto>>>(`/Invoice/Details/${id}`);

        return result;
    }

    resend(id: number): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/Invoice/Resend/${id}`);

        return result;
    }

    makePayment(model: InvoicePaymentModal): Promise<AxiosResponse<Response<InvoiceDto>>> {
        let result = this.httpService
            .call()
            .post<InvoiceDto, AxiosResponse<Response<InvoiceDto>>>(`/Invoice/Payment`, model);

        return result;
    }
    makeAdmissionPayment(model: StudentPaymentModal): Promise<AxiosResponse<Response<StudentInvoiceDto>>> {
        let result = this.httpService
            .call()
            .post<StudentInvoiceDto, AxiosResponse<Response<StudentInvoiceDto>>>(`/Invoice/AdmissionPayment`, model);

        return result;
    }
    getStudentPaymentDetailsByStudentId(studentId: number): Promise<AxiosResponse<Response<StudentInvoiceDto>>> {
        let result = this.httpService
            .call()
            .get<StudentInvoiceDto, AxiosResponse<Response<StudentInvoiceDto>>>(`/Invoice/GetStudentPaymentDetailsByStudentId/${studentId}`);

        return result;
    }
    getStudentAdmissionPaymentDetails(p: InvoiceListParams): Promise<AxiosResponse<Response<ListResponseDto<StudentInvoiceDto>>>> {
        let result = this.httpService
            .call()
            .get<ListResponseDto<StudentInvoiceDto>, AxiosResponse<Response<ListResponseDto<StudentInvoiceDto>>>>(`/Invoice/GetStudentAdmissionPaymentDetails`, {
                params: p,
            });

        return result;
    }

    getInvoiceItemById(invoiceId: number, itemId: number): Promise<AxiosResponse<Response<InvoiceItemDto>>> {
        const result = this.httpService
            .call()
            .get<InvoiceItemDto, AxiosResponse<Response<InvoiceItemDto>>>(`/Invoice/GetInvoiceItemById/${invoiceId}/${itemId}`);

        return result;
    }

    saveInvoiceItem(itemId: number, model: InvoiceItemModal): Promise<AxiosResponse<Response<InvoiceItemDto>>> {
        const result = this.httpService
            .call()
            .post<InvoiceItemDto, AxiosResponse<Response<InvoiceItemDto>>>(`/Invoice/SaveInvoiceItem/${itemId}`, model);

        return result;
    }

    deleteInvoiceItemById(invoiceId: number, itemId: number): Promise<AxiosResponse<Response<InvoiceItemDto>>> {
        const result = this.httpService
            .call()
            .post<InvoiceItemDto, AxiosResponse<Response<InvoiceItemDto>>>(`/Invoice/DeleteInvoiceItemById/${invoiceId}/${itemId}`);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<InvoiceDto>>> {
        let result = this.httpService
            .call()
            .delete<InvoiceDto, AxiosResponse<Response<InvoiceDto>>>(
                `/Invoice/${id}`
            );

        return result;
    }

    directPayment(model: DirectPaymentModal): Promise<AxiosResponse<Response<InvoiceDto>>> {
        let result = this.httpService
            .call()
            .post<InvoiceDto, AxiosResponse<Response<InvoiceDto>>>(`/Invoice/DirectPayment`, model);

        return result;
    }
}
