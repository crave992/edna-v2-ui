import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";

import { injectable } from "inversify";
import IDocuSignService from "./interfaces/IDocuSignService";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import DocuSignDto from "@/dtos/DocuSignDto";
import { DocuSignModel, DocuSignStudentConsentFormModel } from "@/models/DocuSignModel";
import PlainDto from "@/dtos/PlainDto";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";

@injectable()
export default class DocuSignService implements IDocuSignService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    
  getStaffDocumentForSigned(model: DocuSignModel): Promise<AxiosResponse<Response<DocuSignDto>>> {
    let result = this.httpService
      .call()
      .post<DocuSignDto, AxiosResponse<Response<DocuSignDto>>>(`/DocuSign/GetStaffDocumentForSigned`,model);

    return result;
  }
  getParentDocumentForSigned(model: DocuSignStudentConsentFormModel): Promise<AxiosResponse<Response<DocuSignDto>>> {
    let result = this.httpService
      .call()
      .post<DocuSignDto, AxiosResponse<Response<DocuSignDto>>>(`/DocuSign/GetParentDocumentForSigned`,model);

    return result;
  }
  saveStaffSignedDocument(envelopeId?: string,employmentFormId? :number): Promise<AxiosResponse<Response<PlainDto>>>{
   let result = this.httpService
      .call()
      .get<PlainDto, AxiosResponse<Response<PlainDto>>>(`/DocuSign/SaveStaffSignedDocument?envelopeId=${envelopeId}&employmentFormId=${employmentFormId}`);

    return result;
    }
    
  
   saveParentSignedDocument(formId? :number,studentId?:number,envelopeId?:string,): Promise<AxiosResponse<Response<PlainDto>>>{
   let result = this.httpService
      .call()
      .get<PlainDto, AxiosResponse<Response<PlainDto>>>(`/DocuSign/SaveParentSignedDocument?formId=${formId}&studentId=${studentId}&envelopeId=${envelopeId}`);

    return result;
    }
}