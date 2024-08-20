import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import DocuSignDto from "@/dtos/DocuSignDto";
import { DocuSignModel, DocuSignStudentConsentFormModel } from "@/models/DocuSignModel";
import PlainDto from "@/dtos/PlainDto";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";

export default interface IDocuSignService
{
   getStaffDocumentForSigned(model: DocuSignModel): Promise<AxiosResponse<Response<DocuSignDto>>>;
   getParentDocumentForSigned(model: DocuSignStudentConsentFormModel): Promise<AxiosResponse<Response<DocuSignDto>>>;
   saveStaffSignedDocument(envelopeId?:string, employmentFormId? :number): Promise<AxiosResponse<Response<PlainDto>>>;
   saveParentSignedDocument(formId? :number,studentId?:number,envelopeId?:string,): Promise<AxiosResponse<Response<PlainDto>>>;
}