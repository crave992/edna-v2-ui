import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import StudentConsentFormModel from "@/models/StudentConsentFormModel";
import IStudentConsentAndQuestionForm from "./interfaces/IStudentConsentAndQuestionForm";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";
import { StudentInputFormDto } from "@/dtos/StudentInpurFormDto";
import { StudentInputFormAnsweredQuestionModel } from "@/models/StudentInputFormModel";

@injectable()
export default class StudentConsentAndQuestionForm implements IStudentConsentAndQuestionForm {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getStudentConsentAndQuestionFormById(studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentConsentFormDto[], AxiosResponse<Response<StudentConsentFormDto[]>>>(`/StudentConsentAndQuestionForm/GetStudentConsentFormByStudentId?studentId=${studentId}`);


        return result;
    }
    getStudentConsentFormByFormIdAndStudentId(formId: number, studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto>>> {
        let result = this.httpService
            .call()
            .get<StudentConsentFormDto, AxiosResponse<Response<StudentConsentFormDto>>>(`/StudentConsentAndQuestionForm/GetStudentConsentFormByFromIdAndStudentId/${formId}/${studentId}`);
        return result;
    }


    updateStudentConsentAndQuestionForm(model: StudentConsentFormModel): Promise<AxiosResponse<Response<StudentConsentFormDto>>> {
        let result = this.httpService
            .call()
            .post<StudentConsentFormDto, AxiosResponse<Response<StudentConsentFormDto>>>(
                `/StudentConsentAndQuestionForm/StudentConsentForm`,
                model
            );

        return result;
    }

    getStudentInputFormByStudentIdAndFormType(studentId: number, formType: string): Promise<AxiosResponse<Response<StudentInputFormDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentInputFormDto[], AxiosResponse<Response<StudentInputFormDto[]>>>(`/StudentConsentAndQuestionForm/GetStudentInputFormByStudentIdAndFormType/${studentId}/${formType}`);

        return result;
    }

    saveStudentInputFormByStudentIdAndFormType(studentId: number, formType: string, model: StudentInputFormAnsweredQuestionModel[]): Promise<AxiosResponse<Response<StudentInputFormDto>>> {
        let result = this.httpService
            .call()
            .post<StudentInputFormDto, AxiosResponse<Response<StudentInputFormDto>>>(
                `/StudentConsentAndQuestionForm/SaveStudentInputFormByStudentIdAndFormType/${studentId}/${formType}`,
                model
            );

        return result;
    }

    getGetSignedDocumentByParent(formId: number, studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto>>> {
        let result = this.httpService
            .call()
            .get<StudentConsentFormDto, AxiosResponse<Response<StudentConsentFormDto>>>(`/StudentConsentAndQuestionForm/GetSignedDocumentByParent/${formId}/${studentId}`);
        return result;
    }



}
