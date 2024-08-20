import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import StudentConsentFormModel from "@/models/StudentConsentFormModel";
import StudentConsentFormDto from "@/dtos/StudentConsentFormDto";
import { StudentInputFormDto } from "@/dtos/StudentInpurFormDto";
import StudentInputFormModel, { StudentInputFormAnsweredQuestionModel } from "@/models/StudentInputFormModel";

export default interface IStudentConsentAndQuestionForm {
    getStudentConsentAndQuestionFormById(studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto[]>>>;
    getStudentConsentFormByFormIdAndStudentId(formId: number, studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto>>>;
    updateStudentConsentAndQuestionForm(model: StudentConsentFormModel): Promise<AxiosResponse<Response<StudentConsentFormDto>>>;

    getStudentInputFormByStudentIdAndFormType(studentId: number, formType: string): Promise<AxiosResponse<Response<StudentInputFormDto[]>>>;
    saveStudentInputFormByStudentIdAndFormType(studentId: number, formType: string, model: StudentInputFormAnsweredQuestionModel[]): Promise<AxiosResponse<Response<StudentInputFormDto>>>;
    getGetSignedDocumentByParent(formId: number, studentId: number): Promise<AxiosResponse<Response<StudentConsentFormDto>>>;
}
